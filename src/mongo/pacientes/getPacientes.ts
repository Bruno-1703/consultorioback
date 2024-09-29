import { Logger } from '@nestjs/common';
import { Db } from 'mongodb';
import {
  PacienteEdge,
  PacientesResultadoBusqueda,
} from 'src/paciente/paciente.dto';
import { PacienteWhereInput } from 'src/paciente/paciente.input';

export async function getPacientes(
  mongoConnection: Db,
  limit: number,
  skip: number,
  where: PacienteWhereInput,
): Promise<PacientesResultadoBusqueda | null> {
  const logger = new Logger();
  try {
    logger.log('Iniciando búsqueda de pacientes');
    const query: any = [{}];

    const buscar = where?.nombre_paciente || '';
    const dni = where?.dni || '';
    console.log(dni)
    if (dni) {
      query.push({ dni: dni });
    }
    if (buscar) {
      const regexBuscar = new RegExp(diacriticSensitiveRegex(buscar), 'i');
      query.push({ nombre_paciente: regexBuscar });
      query.push({ apellido_paciente: regexBuscar });
    }
    const consulta = mongoConnection
      .collection('Paciente')
      .aggregate([
        { $match: query.lenthg > 0?  { $and: query } : {} },
        { $sort: { dni: -1 } },
        { $skip: skip ? skip : 0 },
        { $limit: limit ? limit : 10 },      
      ]);

    // Contar los documentos que coinciden con el matchStage
    const consultaCantidad = await mongoConnection
      .collection('Paciente')
      .aggregate([{ $match: { $and: query } }, { $count: 'cantidad' }])
      .toArray();
    const cantidad = consultaCantidad[0]?.['cantidad'] || 0;
    const pacientes = await consulta.toArray();
    const edges: PacienteEdge[] = pacientes.map((paciente: any) => ({
      node: Object.assign({}, paciente, { id: paciente._id }),
      cursor: paciente._id,
    }));
    return {
      aggregate: {
        count: cantidad,
      },
      edges,
    };
  } catch (error) {
    logger.error('Error al buscar pacientes: ', error);
    throw new Error('Error al realizar la búsqueda de pacientes.');
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
