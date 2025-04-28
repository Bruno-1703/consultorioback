import { Logger } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { Auditoria } from 'src/auditoria/auditoria.dto';

export async function getAuditoriaById(
  mongoConnection: Db,
  auditoriaId: string,
): Promise<Auditoria | null> {
  const logger = new Logger();
  try {
    logger.debug({
      action: 'getAuditoriaById',
      auditoriaId,
    });

    const auditoriaQuery = await mongoConnection.collection('Auditoria').findOne({
      _id: new ObjectId(auditoriaId),
    });

    if (auditoriaQuery) {
      const auditoria: any = { ...auditoriaQuery, id_auditoria: auditoriaQuery._id.toString() };
      return auditoria as Auditoria;
    }
    return null;
  } catch (error) {
    logger.error({ action: 'getAuditoriaById', auditoriaId, error });
    throw new Error('Error al buscar la auditoría');
  }
}
