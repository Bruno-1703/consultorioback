import { Db } from "mongodb";
import { PacientesResultadoBusqueda } from "src/paciente/paciente.dto";
import { PacienteWhereInput } from "src/paciente/paciente.input";
import { diacriticSensitiveRegex } from "../estudios/getEstudios";

export async function getPacientes(
  mongo: Db,
  skip ,
  limit ,
  where?: PacienteWhereInput,
): Promise<PacientesResultadoBusqueda> {

  const filtros: any[] = [];

  
  // ✅ Eliminados (ROBUSTO)
  filtros.push({
    eliminadoLog: { $ne: true },
  });

  // ✅ DNI (TIPO CORRECTO)
  if (where?.dni?.trim()) {
    filtros.push({ dni: Number(where.dni) });
  }

  // ✅ Nombre / Apellido (regex OK)
  if (where?.nombre_paciente?.trim()) {
    const regex = new RegExp(
      diacriticSensitiveRegex(where.nombre_paciente),
      "i",
    );

    filtros.push({
      $or: [
        { nombre_paciente: regex },
        { apellido_paciente: regex },
      ],
    });
  }

  const match = filtros.length ? { $and: filtros } : {};

  const [pacientes, total] = await Promise.all([
    mongo
      .collection("Paciente")
      .find(match)
      .collation({ locale: "es", strength: 1 })
      .sort({ apellido_paciente: 1 })
      .skip(skip)
      .limit(limit)
      .toArray(),

    mongo
      .collection("Paciente")
      .countDocuments(match),
  ]);

  return {
    edges: pacientes.map((p: any) => ({
      node: {
        ...p,
        id_paciente: p._id.toString(),
        nombre_paciente: p.nombre_paciente ?? "",
        apellido_paciente: p.apellido_paciente ?? "",
        dni: String(p.dni ?? ""),
      },
      cursor: p._id.toString(),
    })),
    aggregate: {
      count: total,
    },
  };
}
