import { Logger } from '@nestjs/common';
import { Db } from 'mongodb';
import { UsuarioResultadoBusqueda, UsuarioEdge } from 'src/users/usuario.dto';
import { UsuarioWhereInput } from 'src/users/usuario.input';

export async function getUsuarios(
  mongoConnection: Db,
  skip: number,
  limit: number,
  where: UsuarioWhereInput,
): Promise<UsuarioResultadoBusqueda | null> {
  const logger = new Logger('getUsuarios');

  try {
    logger.log('Buscando usuarios...');

    const query: any[] = [];

    if (where?.rol_usuario) {
      query.push({ rol_usuario: "doctor" });
    }

    // if (where?.dni) {
    //   query.push({ dni: where.dni });
    // }

    // if (where?.email) {
    //   query.push({ email: where.email });
    // }

    // if (where?.nombre_usuario) {
    //   query.push({ name: { $regex: where.nombre_usuario, $options: 'i' } });
    // }

    const matchStage = query.length > 0 ? { $match: { $and: query } } : { $match: {} };

    const pipeline = [
      matchStage,
      { $sort: { name: 1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const usuarios = await mongoConnection
      .collection('Usuario')
      .aggregate(pipeline, { allowDiskUse: true })
      .toArray();

    const total = await mongoConnection
      .collection('Usuario')
      .aggregate([matchStage, { $count: 'cantidad' }])
      .toArray();

    const count = total[0]?.cantidad || 0;

    const edges: UsuarioEdge[] = usuarios.map((usuario: any) => ({
      node: {
        id_Usuario: usuario._id.toString(),
        nombre_usuario: usuario.nombre_usuario,
        email: usuario.email,
        password: usuario.password,
        rol_usuario: usuario.rol_usuario,
        nombre_completo: usuario.nombre_completo,
        especialidad: usuario.especialidad || '',
        matricula: usuario.matricula || '',
        telefono: usuario.telefono || '',
        dni: usuario.dni || '',
        deletLogico: usuario.deletLogico || false,
      },
      cursor: usuario._id.toString(),
    }));

    return {
      aggregate: { count },
      edges,
    };
  } catch (error) {
    logger.error('Error al buscar usuarios:', error);
    throw new Error('Error al buscar usuarios');
  }
}
