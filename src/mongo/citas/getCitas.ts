import { Logger } from "@nestjs/common";
import { Db } from "mongodb";
import { CitaEdge, CitaResultadoBusqueda } from "src/citas/cita.dto";
import { CitaWhereInput } from "src/citas/cita.input";

export async function getCitas(
  mongoConnection: Db,
  limit: number,
  skip: number,
  where: CitaWhereInput,
): Promise<CitaResultadoBusqueda | null> {
  const logger = new Logger("getCitas");

  try {
    logger.log("------------ INICIO getCitas ------------");

    logger.log("WHERE recibido:");
    console.log(JSON.stringify(where, null, 2));

    const query: any[] = [];

    // ------------------------------------------------------------------------------------------------
    // 1) FILTRO POR PACIENTE
    // ------------------------------------------------------------------------------------------------
    if (where?.paciente?.id_paciente) {
      query.push({ "paciente.id_paciente": where.paciente.id_paciente });
    }

    if (where?.paciente?.dni) {
      query.push({ "paciente.dni": where.paciente.dni });
    }

    // ------------------------------------------------------------------------------------------------
    // En tu archivo del backend donde está getCitas:

    // ... (dentro del try, después del filtro de paciente)

    // 2) FILTRO DOCTOR - ¡DESCOMENTAR Y VERIFICAR!
   // 2) FILTRO DOCTOR - Mejora la búsqueda para cubrir datos viejos y nuevos
// --- Dentro de getCitas en el Backend ---

if (where?.doctor) {
  const d = where.doctor;
  const doctorConditions = [];

  // Agregamos las condiciones que existan en el input
  if (d.id_Usuario) doctorConditions.push({ "doctor.id_Usuario": d.id_Usuario });
  if (d.dni) doctorConditions.push({ "doctor.dni": d.dni });

  // Si hay condiciones de doctor, las unimos con un $or 
  // Esto permite que traiga la cita si coincide el ID O el DNI
  if (doctorConditions.length > 0) {
    query.push({ $or: doctorConditions });
  }

}
    // ------------------------------------------------------------------------------------------------
    // 3) FILTRO DE BÚSQUEDA GENERAL
    // ------------------------------------------------------------------------------------------------
    if (where?.buscar && where.buscar.trim() !== "") {
      const texto = where.buscar.trim();

      query.push({
        $or: [
          { motivoConsulta: { $regex: texto, $options: "i" } },
          { observaciones: { $regex: texto, $options: "i" } },
          { "paciente.nombre_paciente": { $regex: texto, $options: "i" } },
          { "paciente.apellido_paciente": { $regex: texto, $options: "i" } },
          { "paciente.dni": { $regex: texto, $options: "i" } },
        ],
      });
    }

    logger.log("QUERY ARMADO:");
    console.log(JSON.stringify(query, null, 2));

    const matchStage = query.length > 0
      ? { $match: { $and: query } }
      : { $match: {} };

    logger.log("MATCH FINAL:");
    console.log(JSON.stringify(matchStage, null, 2));

    // Preview
    const preview = await mongoConnection
      .collection("Cita")
      .aggregate([matchStage], { allowDiskUse: true })
      .toArray();

    logger.log("PREVIEW RESULTADOS:", preview.length);

    // Query principal
    const citas = await mongoConnection
      .collection("Cita")
      .aggregate(
        [
          matchStage,
          { $sort: { fechaSolicitud: 1 } },
          { $skip: skip || 0 },
          { $limit: limit || 10 },
        ],
        { allowDiskUse: true },
      )
      .toArray();

    logger.log("RESULTADOS FINALES:", citas.length);

    const cantidad = (
      await mongoConnection
        .collection("Cita")
        .aggregate([matchStage, { $count: "cantidad" }])
        .toArray()
    )[0]?.cantidad || 0;

    const edges: CitaEdge[] = citas.map((cita: any) => ({
      node: { ...cita, id_cita: cita._id.toString() },
      cursor: cita._id.toString(),
    }));

    logger.log("------------ FIN getCitas ------------");

    return {
      aggregate: { count: cantidad },
      edges,
    };

  } catch (error) {
    logger.error(error);
    throw new Error("Error al buscar citas");
  }
}
