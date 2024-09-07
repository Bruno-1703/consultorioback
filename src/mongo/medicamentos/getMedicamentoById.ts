import { Logger } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { Medicamento } from 'src/medicamentos/medicamento.dto';

export async function getMedicamentoById(
  mongoConnection: Db,
  medicamentoId: string,
): Promise<Medicamento | null> {
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
      const medicamento: any = { ...medicamentoQuery, id: medicamentoQuery._id };
      return medicamento as Medicamento;
    }
    return null;
  } catch (error) {
    logger.error({ action: 'getMedicamentoById', medicamentoId, error });
    throw new Error('Error al buscar paciente');
  }
}
