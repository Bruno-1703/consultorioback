import { Logger } from "@nestjs/common";
import { Db, ObjectId } from "mongodb";
import { Cita } from "src/citas/cita.dto";

export async function getCitaById(
  //usuario: UsuarioExpedientes,
  mongoConnection: Db,
  citaId: string
): Promise<Cita | null> {
  const logger = new Logger();
  try {
    logger.debug({
      action: "getCiintaById",
      citaId,
      // usuario,
    });

    const emailQuery = await mongoConnection.collection("cita").findOne({
      _id: new ObjectId(citaId),   
            
   
    });

    if (emailQuery) {
      const cita: any = Object.assign({}, emailQuery, {
        id: emailQuery._id,
        // mensajes: emailQuery.mensajes?.map((mensaje) => ({
        //   ...mensaje,
        // })),
      });
      return cita as Cita;
    }
    return null;
  } catch (error) {
    logger.error({ action: "getCitaById", citaId, error });
    throw new Error("Error al buscar cita");
  }
}
