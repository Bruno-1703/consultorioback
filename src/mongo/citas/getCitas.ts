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

    // FILTRO DNI PACIENTE
    // Buscar solo como string
    // FILTRO DNI PACIENTE
    if (where?.paciente?.dni) {
      query.push({ "paciente.dni": where.paciente.dni });
    }



    // FILTRO DOCTOR
    if (where?.doctor) {
      const d = where.doctor;

      if (d.id_Usuario) query.push({ "doctor.id_Usuario": d.id_Usuario });
      if (d.dni) query.push({ "doctor.dni": d.dni });
      if (d.nombre_usuario) query.push({ "doctor.nombre_usuario": d.nombre_usuario });
      if (d.email) query.push({ "doctor.email": d.email });
      if (d.matricula) query.push({ "doctor.matricula": d.matricula });
      if (d.telefono) query.push({ "doctor.telefono": d.telefono });
      if (d.nombre_completo) query.push({ "doctor.nombre_completo": d.nombre_completo });
    }

    logger.log("QUERY ARMADO:");
    console.log(JSON.stringify(query, null, 2));

    const matchStage = query.length > 0
      ? { $match: { $and: query } }
      : { $match: {} };

    logger.log("MATCH FINAL:");
    console.log(JSON.stringify(matchStage, null, 2));

    // EJECUTAR CONSULTA SIN SORT/LIMIT PARA VER SI MATCHEA ALGO
    const preview = await mongoConnection
      .collection("Cita")
      .aggregate([matchStage], { allowDiskUse: true })
      .toArray();

    logger.log("PREVIEW RESULTADOS (antes de skip/limit):");
    console.log(preview);

    // CONSULTA REAL
    const consulta = mongoConnection
      .collection("Cita")
      .aggregate(
        [
          matchStage,
          { $sort: { fechaSolicitud: 1 } },
          { $skip: skip || 0 },
          { $limit: limit || 10 },
        ],
        { allowDiskUse: true },
      );

    const citas = await consulta.toArray();

    logger.log("RESULTADOS FINALES:");
    console.log(citas);

    const consultaCantidad = await mongoConnection
      .collection("Cita")
      .aggregate([matchStage, { $count: "cantidad" }])
      .toArray();

    const cantidad = consultaCantidad[0]?.cantidad || 0;

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
