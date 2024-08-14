import { Logger } from "@nestjs/common";
import { Db, ObjectId } from "mongodb";
import { Cita } from "src/citas/cita.dto";

export async function getCitaById(
  mongoConnection: Db,
  citaId: string
): Promise<Cita | null> {
  const logger = new Logger();
  try {
    logger.debug({
      action: "getCiintaById",
      citaId,
    });

    const citaQuery = await mongoConnection.collection("Cita").findOne({
      _id: new ObjectId(citaId),            
   
    });
    if (citaQuery) {
      const cita: any = Object.assign({}, citaQuery, {
        id: citaQuery._id,
   
      });
      console.log(cita)
      return cita as Cita;
    }
    return null;
  } catch (error) {
    logger.error({ action: "getCitaById", citaId, error });
    throw new Error("Error al buscar cita");
  }
}
