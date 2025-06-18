import { Logger } from "@nestjs/common";
import { Db } from "mongodb";
import { CitaEdge, CitaResultadoBusqueda } from "src/citas/cita.dto";
import { CitaWhereInput } from "src/citas/cita.input";

export async function getCitasByfecha(
  mongoConnection: Db,
  limit: number,
  skip: number,
  where?: CitaWhereInput,
): Promise<CitaResultadoBusqueda | null> {
  const logger = new Logger('getCitasByfecha');
  try {
    logger.log('Buscando citas...');

    const query: any[] = [];

    const matchStage = query.length > 0 ? { $match: { $and: query } } : { $match: {} };

    const pipeline = [
      matchStage,
      { $sort: { fechaSolicitud: -1 } },
      { $skip: skip || 0 },
      { $limit: limit || 10 },
    ];

    const consulta = mongoConnection
      .collection('Cita')
      .aggregate(pipeline, { allowDiskUse: true });

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
      node: {
        ...cita,
        id_cita: cita._id.toString(),
      },
      cursor: cita._id.toString(),
    }));

    return {
      aggregate: {
        count: cantidad,
      },
      edges,
    };
  } catch (error) {
    logger.error('Error en getCitasByfecha', error);
    throw new Error('Error al buscar el dato estático de las citas');
  }
}
