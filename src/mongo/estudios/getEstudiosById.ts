import { Logger } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { Estudio } from 'src/estudios/estudio.dto';

export async function getEstudioById(
  mongoConnection: Db,
   estudioId: string,
): Promise<Estudio | null> {
  const logger = new Logger();
  try {
    logger.debug({
      action: 'getEstudioById',
      estudioId,
    });
    //  if (!ObjectId.isValid(medicamentoId)) {
    //    throw new Error("ID de paciente no válido");
    //  }
    const estudioQuery = await mongoConnection.collection('Estudio').findOne({
      _id: new ObjectId(estudioId),
    });
    if (estudioQuery) {
      const estudio: any = { ...estudioQuery, id: estudioQuery._id };
      return estudio as Estudio;
    }
    return null;
  } catch (error) {
    logger.error({ action: 'getestudioById', estudioId, error });
    throw new Error('Error al buscar estudio');
  }
}
