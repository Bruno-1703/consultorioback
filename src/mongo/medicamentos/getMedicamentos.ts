import { Logger } from '@nestjs/common';
import { Db } from 'mongodb';
import { MedicamentoEdge, MedicamentoResultadoBusqueda } from 'src/medicamentos/medicamento.dto';
import { MedicamentoWhereInput } from 'src/medicamentos/medicamento.input';

export async function getMedicamentos(
  mongoConnection: Db,
  limit: number,
  skip: number, 
  where: MedicamentoWhereInput,
): Promise<MedicamentoResultadoBusqueda | null> {
  const logger = new Logger();
  try {
    logger.log({ action: 'getMedicamentos' });
    const query: any = [{}];

    // const buscar = where ? where.nombre_med : null;

    // if (buscar) {
    //   const regexBuscar = new RegExp(diacriticSensitiveRegex(buscar), 'i');
    //   query.push({
    //     $or: [
    //       { nombre_med: regexBuscar },
    //       { marca: regexBuscar },
    //     ],
    //   });
    // }
    const consulta = mongoConnection.collection('Medicamento').aggregate(
      [
        { $match: query.length > 0 ? { $and: query } : {} },  // Ajuste aquí
        { $skip: skip ? skip : 0 },
        { $limit: limit ? limit : 10 },
      ],
      { allowDiskUse: true },
    );
    const consultaCantidad = await mongoConnection
      .collection('Medicamento')
      .aggregate([{ $match: { $and: query } }, { $count: 'cantidad' }])
      .toArray();

      const cantidad = consultaCantidad[0]?.['cantidad'] || 0;
      const medicamentos = await consulta.toArray();

      const edges: MedicamentoEdge[] = medicamentos.map((medicamento: any) => ({
        node: Object.assign({}, medicamento, {
          id: medicamento._id.toString(),
        }),
        cursor: medicamento._id.toString(),
      }));
      

    return {
      aggregate: {
        count: cantidad,
      },
      edges,
    };
  } catch (error) {
    logger.error(error);
    throw new Error('Error al buscar el dato estático del medicamento');
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
