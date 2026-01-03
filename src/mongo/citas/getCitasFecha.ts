import { Logger } from "@nestjs/common";
import { Db, ObjectId } from "mongodb";
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
    const query: any[] = [];

    // Siempre buscar las no finalizadas, si no se indica lo contrario
    if (where?.finalizada !== undefined) {
      query.push({ finalizada: where.finalizada });
    } else {
      query.push({ finalizada: false });
    }

    // Filtro por texto libre (buscar)
    if (where?.buscar) {
      query.push({
        $or: [
          { motivoConsulta: { $regex: where.buscar, $options: 'i' } },
          { observaciones: { $regex: where.buscar, $options: 'i' } },
        ],
      });
    }

    // Filtro por motivo exacto
    if (where?.motivoConsulta) {
      query.push({ motivoConsulta: { $regex: new RegExp(where.motivoConsulta, 'i') } });
    }

    // Filtro por observaciones exactas
    if (where?.observaciones) {
      query.push({ observaciones: { $regex: new RegExp(where.observaciones, 'i') } });
    }

    // Filtro por fecha exacta (rango del día)
    // Filtro por fecha exacta (rango del día en UTC)
    if (where?.fechaProgramada) {
      const base = new Date(where.fechaProgramada);
      const desde = new Date(base);
      desde.setUTCHours(0, 0, 0, 0);

      const hasta = new Date(base);
      hasta.setUTCHours(23, 59, 59, 999);

      query.push({ fechaProgramada: { $gte: desde, $lte: hasta } });
    }

    const matchStage = query.length > 0 ? { $match: { $and: query } } : { $match: {} };

    // Aquí está la corrección: usar matchStage y agregar skip y limit
    const citas = await mongoConnection
      .collection('Cita')
      .aggregate([
        matchStage,
        { $skip: skip },
        { $limit: limit }
      ])
      .toArray();

    const cantidad = await mongoConnection
      .collection('Cita')
      .countDocuments(query.length > 0 ? { $and: query } : {});

    const edges: CitaEdge[] = citas.map((cita: any) => ({
      node: {
        ...cita,
        id_cita: cita._id.toString(),

        doctor: cita.doctor
          ? {
            ...cita.doctor,
            id_doctor: cita.doctor._id.toString(),
          }
          : null,
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
