import { Logger } from "@nestjs/common";
import { Db, ObjectId } from "mongodb";
import { CentroSaludWhereInput } from "src/centroSalud/centro-salud.input";
import {
  CentroSaludEdge,
  CentroSaludResultadoBusqueda,
} from "src/centroSalud/centro-salud.dto";

export async function getCentros(
  mongoConnection: Db,
  skip = 0,
  limit = 10,
  where?: CentroSaludWhereInput,
): Promise<CentroSaludResultadoBusqueda> {

  const logger = new Logger("getCentros MongoDB");

  try {
    const filtros: any[] = [];

    if (where?.nombre) {
      filtros.push({ nombre: { $regex: where.nombre, $options: "i" } });
    }

    if (where?.tipo) {
      filtros.push({ tipo: where.tipo });
    }

    const matchStage =
      filtros.length > 0 ? { $match: { $and: filtros } } : { $match: {} };

    const centros = await mongoConnection
      .collection("CentroSalud")
      .aggregate([
        matchStage,
        { $skip: skip },
        { $limit: limit },
      ])
      .toArray();

    const cantidad = await mongoConnection
      .collection("CentroSalud")
      .countDocuments(filtros.length > 0 ? { $and: filtros } : {});

    const edges: CentroSaludEdge[] = centros.map((centro: any) => ({
      node: {
        ...centro,
        id: centro._id.toString(), // 👈 CLAVE
      },
      cursor: centro._id.toString(),
    }));

    return {
      aggregate: {
        count: cantidad,
      },
      edges,
    };
  } catch (error) {
    logger.error(error);
    throw new Error("Error al obtener los centros de salud");
  }
}
