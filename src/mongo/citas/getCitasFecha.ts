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
    const query: any = {};
    console.log(where.fechaProgramada)
 if (where?.fechaProgramada) {
  const base = new Date(where.fechaProgramada); // ISO string: "2025-07-23"
  
  const desde = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), 0, 0, 0, 0));
  const hasta = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), 23, 59, 59, 999));

  query.fechaProgramada = { $gte: desde, $lte: hasta };
}

  
    const pipeline = [
      { $match: query },
      { $sort: { fechaProgramada: -1 } },
      { $skip: skip || 0 },
      { $limit: limit || 10 },
    ];

    const citas = await mongoConnection
      .collection('Cita')
      .aggregate(pipeline, { allowDiskUse: true })
      .toArray();

    const cantidad = await mongoConnection
      .collection('Cita')
      .countDocuments(query);

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
    logger.error(error);
    throw new Error('Error al buscar el dato estático de las citas');
  }
}
