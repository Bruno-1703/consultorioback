import { Logger } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { Paciente } from 'src/paciente/paciente.dto';

export async function getMedicamentoById(
  mongoConnection: Db,
  medicamentoId: string,
): Promise<Paciente | null> {
  const logger = new Logger();
  try {
    logger.debug({
      action: 'getMedicamentoById',
      medicamentoId,
    });
    //  if (!ObjectId.isValid(medicamentoId)) {
    //    throw new Error("ID de paciente no válido");
    //  }
    const medicamentoQuery = await mongoConnection.collection('Medicamento').findOne({
      _id: new ObjectId(medicamentoId),
    });
    if (medicamentoQuery) {
      const paciente: any = { ...medicamentoQuery, id: medicamentoQuery._id };
      return paciente as Paciente;
    }
    return null;
  } catch (error) {
    logger.error({ action: 'getMedicamentoById', medicamentoId, error });
    throw new Error('Error al buscar paciente');
  }
}
