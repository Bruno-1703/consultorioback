import { Logger } from "@nestjs/common";
import { Db, ObjectId } from "mongodb";
import { Paciente } from "src/paciente/paciente.dto";

export async function getPacienteById(
  mongoConnection: Db,
  pacienteId: string
): Promise<Paciente | null> {
  const logger = new Logger();
  try {
    logger.debug({
      action: "getCiintaById",
      pacienteId,
    });

    if (!ObjectId.isValid(pacienteId)) {
      throw new Error("ID de paciente no válido");
    }
    const pacienteQuery  = await mongoConnection.collection("paciente").findOne({
      _id: new ObjectId(pacienteId),  
    });

    if (pacienteQuery) {
      const paciente: any = { ...pacienteQuery, id: pacienteQuery._id };
      return paciente as Paciente;
    } else {
      throw new Error(`No se encontró el paciente con ID ${pacienteId}`);
    }
    return null;
  } catch (error) {
    logger.error({ action: "getPacienteById", pacienteId, error });
    throw new Error("Error al buscar paciente");
  }
}
