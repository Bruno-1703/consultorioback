import { Logger } from '@nestjs/common';
import { Db } from 'mongodb';
import {
  PacienteEdge,
  PacientesResultadoBusqueda,
} from 'src/paciente/paciente.dto';
import { PacienteWhereInput } from 'src/paciente/paciente.input';

export async function getPacientes(
  mongoConnection: Db,
  take: number,
  skip: number,
  where: PacienteWhereInput,
): Promise<PacientesResultadoBusqueda | null> {
  const logger = new Logger();
  try {
    logger.log('Iniciando búsqueda de pacientes');

    const buscar = where?.nombre_paciente || '';
    const dni = where?.dni || '';

    const query: any[] = [];
    // if (dni) {
    //   query.push({ dni: dni });
    // }
    // if (buscar) {
    //   const regexBuscar = new RegExp(diacriticSensitiveRegex(buscar), 'i');
    //   query.push({ nombre_paciente: regexBuscar });
    //   query.push({ apellido_paciente: regexBuscar });
    // }
    const matchStage = query.length > 0 ? { $and: query } : {};

    const consulta = mongoConnection
      .collection("Paciente")
      .aggregate(
        [
          { $match: matchStage },
          { $skip: skip >= 0  },
          { $limit: take >= 0  },
        ],
        { allowDiskUse: true },
      );

    // Contar los documentos que coinciden con el matchStage
    const cantidad = await mongoConnection
      .collection("Paciente")
      .countDocuments(matchStage);
      console.log(consulta)
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
