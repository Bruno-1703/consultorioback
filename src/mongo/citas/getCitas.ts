import { Logger } from "@nestjs/common";
import { Db } from "mongodb";
import { CitaEdge, CitaResultadoBusqueda } from "src/citas/cita.dto";
import { CitaWhereInput } from "src/citas/cita.input";
 
export async function getCitas(
  mongoConnection: Db,
  take: number,
  skip: number,
  where: CitaWhereInput, 
): Promise<CitaResultadoBusqueda | null> {
  const logger = new Logger();
  try {
    logger.log({ action: "getCitas" });

    const buscar = where ? where.buscar : null;
    const fechaSolicitud = where ? where.fechaSolicitud : null;
    console.log(fechaSolicitud)
    const query: any[] = [];
    if(fechaSolicitud){
      query.push({fechaSolicitud:fechaSolicitud})
    }
    if (buscar) {
      const regexBuscar = new RegExp(diacriticSensitiveRegex(buscar), 'i');
      query.push(
        {"motivoConsulta": regexBuscar }, 
         {
          "observaciones": regexBuscar
         });
    }
    // Construir la consulta MongoDB
    const matchStage = query.length > 0 ? { $and: query } : {};

    const consulta = mongoConnection
      .collection("Cita")
      .aggregate(
        [
          { $match: matchStage },
          { $sort: { fechaSolicitud: -1 } },
          { $skip: skip ? skip : 0 },
          { $limit: take ? take : 0 },       
        ],
        { allowDiskUse: true }
      );

    const cantidad = await mongoConnection
      .collection("Cita")
      .countDocuments(matchStage);

    const citas = await consulta.toArray();
    const edges: CitaEdge[] = citas.map((cita: any) => ({
      node: Object.assign({}, cita, {
        id: cita._id,
      }),
      cursor: cita._id,
    }));

    return {
      aggregate: {
        count: cantidad,
      },
      edges,
    };
  } catch (error) {
    logger.error(error);
    throw new Error("Error al buscar el dato estático de la citas");
  }
}

export const diacriticSensitiveRegex = (text = "") => {
  return text
    .replace(/[aá]/g, "[a,á,à,ä]")
    .replace(/[eé]/g, "[e,é,ë]")
    .replace(/[ií]/g, "[i,í,ï]")
    .replace(/[oó]/g, "[o,ó,ö,ò]")
    .replace(/[uú]/g, "[u,ü,ú,ù]");
};
