import { PacienteWhereInput } from "src/paciente/paciente.input";
import { diacriticSensitiveRegex } from "../estudios/getEstudios";
import { PacientesResultadoBusqueda } from "src/paciente/paciente.dto";
import { Db } from "mongodb";

export async function getPacientes(
  mongo: Db,
  skip = 0,
  limit = 10,
  where?: PacienteWhereInput,
): Promise<PacientesResultadoBusqueda> {

  const filtros: any[] = [];

  // 👇 pacientes activos
  filtros.push({
    $or: [
      { eliminadoLog: false },
      { eliminadoLog: { $exists: false } },
    ],
  });

  if (where?.dni?.trim()) {
    filtros.push({ dni: where.dni });
  }

  if (where?.nombre_paciente?.trim()) {
    const regex = new RegExp(
      diacriticSensitiveRegex(where.nombre_paciente),
      'i',
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
      .collection('Paciente') 
      .find(match)
      .sort({ apellido_paciente: 1 })
      .skip(skip)
      .limit(limit)
      .toArray(),

    mongo
      .collection('Paciente')
      .countDocuments(match),
  ]);

  return {
    edges: pacientes.map((p: any) => ({
      node: { ...p, id_paciente: p._id.toString() },
      cursor: p._id.toString(),
    })),
    aggregate: {
      count: total,
    },
  };
}
