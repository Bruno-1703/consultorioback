import { Logger } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb'; // Importa ObjectId
import { CitaResultadoBusqueda, CitaEdge } from 'src/citas/cita.dto';
import { CitaWhereInput } from 'src/citas/cita.input';

export async function getCitasByfecha(
  mongo: Db,
  skip ,
  limit ,
  where?: CitaWhereInput,
): Promise<CitaResultadoBusqueda> {
  const logger = new Logger('getCitasByfecha');

  try {
    const filtros: any[] = [];

    // 1. FILTRO DE FECHA (REVISADO)
   // FILTRO DE FECHA (1 SOLA FECHA, BIEN HECHO)
if (where?.fechaProgramada) {
  const inicioDia = new Date(where.fechaProgramada);
  inicioDia.setHours(0, 0, 0, 0);

  const finDia = new Date(where.fechaProgramada);
  finDia.setHours(23, 59, 59, 999);

  filtros.push({
    fechaProgramada: {
      $gte: inicioDia,
      $lte: finDia,
    },
  });
}


    // 2. BÚSQUEDA LIBRE
    if (where?.buscar?.trim()) {
      filtros.push({
        $or: [
          { motivoConsulta: { $regex: where.buscar, $options: 'i' } },
          { observaciones: { $regex: where.buscar, $options: 'i' } },
        ],
      });
    }

    const match = filtros.length ? { $and: filtros } : {};

    // 🚨 DEBUG CRÍTICO: Mira la consola de tu servidor (terminal de NestJS)
    // Copia lo que salga aquí y pégalo en una consola de MongoDB para ver si trae algo
    console.log("QUERY MONGODB:", JSON.stringify(match));

    const [citas, total] = await Promise.all([
      mongo.collection('Cita').find(match).skip(skip).limit(limit).toArray(),
      mongo.collection('Cita').countDocuments(match),
    ]);

    // Mapeo seguro para evitar errores de TypeScript
    const edges: CitaEdge[] = citas.map((cita: any) => ({
      node: {
        ...cita,
        id_cita: cita._id.toString(),
        // Forzamos que los campos requeridos existan aunque sea vacíos
        motivoConsulta: cita.motivoConsulta || "Sin motivo",
        paciente: cita.paciente ? { ...cita.paciente, id_paciente: cita.paciente._id?.toString() } : null,
        doctor: cita.doctor ? { ...cita.doctor, id_doctor: cita.doctor._id?.toString() } : null,
      },
      cursor: cita._id.toString(),
    }));

    return { aggregate: { count: total }, edges };
  } catch (error) {
    logger.error("Error en getCitasByfecha:", error);
    throw error;
  }


}