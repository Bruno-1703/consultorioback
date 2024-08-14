import { Logger } from '@nestjs/common';
import { Db } from 'mongodb';
import { MedicamentoWhereInput } from 'src/medicamentos/medicamento.input';
import {
  PacienteEdge,
  PacientesResultadoBusqueda,
} from 'src/paciente/paciente.dto';

export async function getMedicamento(
  mongoConnection: Db,
  take: number,
  skip: number,
  where: MedicamentoWhereInput,
): Promise<PacientesResultadoBusqueda | null> {
  const logger = new Logger();
  try {
    logger.log({ action: 'getPacientes' });

    const buscar = where ? where.nombre_med : null;

    const query: any[] = [];
    if (buscar) {
      const regexBuscar = new RegExp(diacriticSensitiveRegex(buscar), 'i');
      query.push({
        $or: [
          { dni: regexBuscar },
          { nombre_paciente: regexBuscar },
          { apellido_paciente: regexBuscar },
        ],
      });
    }
    const consulta = mongoConnection.collection('medicamento').aggregate(
      [
        { $match: { $and: query } },
        { $sort: { dni: -1 } },
        { $skip: skip ? skip : 0 },
        { $limit: take ? take : 0 },
        // { $project: { mensajes: 0 } }
        // Proyección de los valores que solo necesitas
      ],
      { allowDiskUse: true },
    );

    const cantidad = await mongoConnection
      .collection('medicamento')
      .countDocuments({ $and: query });

    const pacientes = await consulta.toArray();
    const edges: PacienteEdge[] = pacientes.map((paciente: any) => ({
      node: Object.assign({}, paciente, {
        id: paciente._id,
      }),
      cursor: paciente._id,
    }));

    return {
      aggregate: {
        count: cantidad,
      },
      edges,
    };
  } catch (error) {
    logger.error(error);
    throw new Error('Error al buscar el dato estático del paciente');
  }
}

export const diacriticSensitiveRegex = (text = '') => {
  return text
    .replace(/[aá]/g, '[a,á,à,ä]')
    .replace(/[eé]/g, '[e,é,ë]')
    .replace(/[ií]/g, '[i,í,ï]')
    .replace(/[oó]/g, '[o,ó,ö,ò]')
    .replace(/[uú]/g, '[u,ü,ú,ù]');
};
