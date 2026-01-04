import { Logger } from '@nestjs/common';
import { Db } from 'mongodb';
import { CitaResultadoBusqueda, CitaEdge } from 'src/citas/cita.dto';
import { CitaWhereInput } from 'src/citas/cita.input';

export async function getCitasByfecha(
  mongo: Db,
  skip = 0,
  limit = 10,
  where?: CitaWhereInput,
): Promise<CitaResultadoBusqueda> {
  const logger = new Logger('getCitasByfecha');

  try {
    const filtros: any[] = [];

    // 🔹 finalizada (default: false)
    filtros.push({
      finalizada: where?.finalizada ?? false,
    });

    // 🔍 búsqueda libre
    if (where?.buscar?.trim()) {
      filtros.push({
        $or: [
          { motivoConsulta: { $regex: where.buscar, $options: 'i' } },
          { observaciones: { $regex: where.buscar, $options: 'i' } },
        ],
      });
    }

    // 📝 motivo
    if (where?.motivoConsulta?.trim()) {
      filtros.push({
        motivoConsulta: { $regex: where.motivoConsulta, $options: 'i' },
      });
    }

    // 📝 observaciones
    if (where?.observaciones?.trim()) {
      filtros.push({
        observaciones: { $regex: where.observaciones, $options: 'i' },
      });
    }

    // 📅 rango de fecha
    // 📅 Rango de fecha mejorado
    if (where?.fechaProgramada) {
      const dateFilter: any = {};

      if (where.fechaProgramada) {
        dateFilter.$gte = new Date(where.fechaProgramada);
      }
      if (where.fechaProgramada) {
        dateFilter.$lte = new Date(where.fechaProgramada);
      }

      if (Object.keys(dateFilter).length > 0) {
        filtros.push({ fechaProgramada: dateFilter });
      }
    }

    const match = filtros.length ? { $and: filtros } : {};

    const [citas, total] = await Promise.all([
      mongo
        .collection('Cita')
        .find(match)
        .skip(skip)
        .limit(limit)
        .toArray(),

      mongo.collection('Cita').countDocuments(match),
    ]);

   const edges: CitaEdge[] = citas.map((cita: any) => ({
  node: {
    ...cita,
    id_cita: cita._id.toString(),
    doctor: cita.doctor ? {
      ...cita.doctor,
      id_doctor: cita.doctor._id?.toString(),
    } : null,
    // Importante añadir esto si el paciente tiene _id de Mongo
    paciente: cita.paciente ? {
      ...cita.paciente,
      id_paciente: cita.paciente._id?.toString(),
    } : null,
  },
  cursor: cita._id.toString(),
}));

    return {
      aggregate: { count: total },
      edges,
    };
  } catch (error) {
    logger.error(error);
    throw error; // 👈 no tapes el error real
  }
}
