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
  const logger = new Logger();
  try {
    logger.log({ action: 'getCitas' });

    const buscar = where?.buscar;

    const query: any[] = [];

    if (where?.paciente?.dni && where.paciente.dni.trim() !== "") {
      query.push({ "paciente.dni": where.paciente.dni });
    }


    const matchStage = query.length > 0 ? { $match: { $and: query } } : { $match: {} };

    const consulta = mongoConnection
      .collection('Cita')
      .aggregate(
        [
          matchStage,
          { $sort: { fechaSolicitud: -1 } },
          { $skip: skip || 0 },
          { $limit: limit || 10 },
        ],
        { allowDiskUse: true },
      );

    const consultaCantidad = await mongoConnection
      .collection('Cita')
      .aggregate([
        matchStage,
        { $count: 'cantidad' }
      ])
      .toArray();

    const cantidad = consultaCantidad[0]?.cantidad || 0;
    const citas = await consulta.toArray();

    const edges: CitaEdge[] = citas.map((cita: any) => ({
      node: Object.assign({}, cita, {
        id_cita: cita._id.toString(),
      }),
      cursor: cita._id.toString(),
    }));

    return {
      aggregate: {
        count: cantidad,
      },
      edges,
    };
  } catch (error) {
    logger.error(error);
    throw new Error('Error al buscar el dato estático de la citas');
  }
}
