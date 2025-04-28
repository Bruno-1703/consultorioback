import { Logger } from '@nestjs/common';
import { Db } from 'mongodb';
import {
  AuditoriaEdge,
  AuditoriaResultadoBusqueda,
} from 'src/auditoria/auditoria.dto';
import { AuditoriaWhereInput } from 'src/auditoria/auditoria.input';

export async function getAuditorias(
  mongoConnection: Db,
  limit: number,
  skip: number,
  where: AuditoriaWhereInput,
): Promise<AuditoriaResultadoBusqueda | null> {
  const logger = new Logger();
  try {
    logger.log('Iniciando búsqueda de auditorías');
    const query: any = [{}];

    const fecha = where?.fecha || '';
    const accion = where?.accion || '';
    const usuario = where?.usuarioId || '';

    // Si hay filtros adicionales, como fecha, acción o usuario, los agregamos al query
    if (fecha) {
      query.push({ fecha: { $eq: new Date(fecha) } });
    }
    if (accion) {
      query.push({ accion: { $regex: accion, $options: 'i' } });
    }
    if (usuario) {
      query.push({ usuario: { $regex: usuario, $options: 'i' } });
    }

    // Realizamos la consulta en la colección de Auditoria
    const consulta = mongoConnection
      .collection('Auditoria')
      .aggregate([
        { $match: query.length > 0 ? { $and: query } : {} },
        { $sort: { fecha: -1 } }, // Ordenamos por fecha de manera descendente
        { $skip: skip ? skip : 0 }, // Saltamos según el parámetro skip
        { $limit: limit ? limit : 10 }, // Limitamos el número de resultados
      ]);

    // Contamos cuántos documentos coinciden con la consulta
    const consultaCantidad = await mongoConnection
      .collection('Auditoria')
      .aggregate([{ $match: { $and: query } }, { $count: 'cantidad' }])
      .toArray();

    const cantidad = consultaCantidad[0]?.['cantidad'] || 0;
    const auditorias = await consulta.toArray();

    const edges: AuditoriaEdge[] = auditorias.map((auditoria: any) => ({
      node: Object.assign({}, auditoria, { id_auditoria: auditoria._id.toString() }), // Asignamos _id a id_auditoria
      cursor: auditoria._id.toString(), // Convertimos ObjectId a string si es necesario
    }));

    return {
      aggregate: {
        count: cantidad,
      },
      edges,
    };
  } catch (error) {
    logger.error('Error al buscar auditorías: ', error);
    throw new Error('Error al realizar la búsqueda de auditorías.');
  }
}
