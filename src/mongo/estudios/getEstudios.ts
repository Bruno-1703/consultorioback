import { Logger } from '@nestjs/common';
import { Db } from 'mongodb';
import { EstudioEdge, EstudioResultadoBusqueda } from 'src/estudios/estudio.dto';
import { EstudioWhereInput } from 'src/estudios/estudio.input';

export async function getEstudios(
  mongoConnection: Db,
  take: number,
  skip: number,
  where: EstudioWhereInput,
): Promise<EstudioResultadoBusqueda | null> {
  const logger = new Logger();
  try {
    logger.log({ action: 'getEstudios' });
    const query: any = [{}];

    const buscar = where ? where.codigo_referencia : null;

    if (buscar) {
      const regexBuscar = new RegExp(diacriticSensitiveRegex(buscar), 'i');
      query.push({
        $or: [
          { codigo_referencia: regexBuscar },
        ],
      });
    }
    const consulta = mongoConnection.collection('Estudio').aggregate(
      [
        { $match: { $and: query } },
        { $sort: { fecha_realizacion: -1 } },
        { $skip: skip },
        { $limit: take},
      ],
      { allowDiskUse: true },
    );

    const consultaCantidad = await mongoConnection
      .collection('Estudio')
      .aggregate([{ $match: { $and: query } }, { $count: 'cantidad' }])
      .toArray();

      const cantidad = consultaCantidad[0]?.['cantidad'] || 0;
      const estudios = await consulta.toArray();

      const edges: EstudioEdge[] = estudios.map((estudio: any) => ({
      node: Object.assign({}, estudio, {
        id: estudio._id,
      }),
      cursor: estudio._id,
    }));

    return {
      aggregate: {
        count: cantidad,
      },
      edges,
    };
  } catch (error) {
    logger.error(error);
    throw new Error('Error al buscar el dato estático del estudio');
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
