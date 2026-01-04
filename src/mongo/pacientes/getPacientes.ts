import { PacienteWhereInput } from "src/paciente/paciente.input";
import { diacriticSensitiveRegex } from "../estudios/getEstudios";
import { Db } from "mongodb";
import { PacientesResultadoBusqueda } from "src/paciente/paciente.dto";

export async function getPacientes(
  mongo: Db,
  skip = 0,
  limit = 10,
  where?: PacienteWhereInput,
): Promise<PacientesResultadoBusqueda> {

  const filtros: any[] = [];

  // 1. Filtro de Eliminados (Se mantiene igual)
  filtros.push({
    $or: [
      { eliminadoLog: false },
      { eliminadoLog: { $exists: false } },
    ],
  });

  // 2. Filtro por DNI
  if (where?.dni?.trim()) {
    filtros.push({ dni: where.dni.trim() });
  }

  // 3. Filtro por Nombre/Apellido con Regex (Se mantiene tu lógica de diacríticos)
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

  try {
    const [pacientes, total] = await Promise.all([
      mongo
        .collection('Paciente')
        .find(match)
        .sort({ apellido_paciente: 1 }) // Orden alfabético
        .skip(skip)
        .limit(limit)
        .toArray(),

      mongo
        .collection('Paciente')
        .countDocuments(match),
    ]);

    // 4. MAPEO CRÍTICO DE DATOS
    return {
      edges: pacientes.map((p: any) => ({
        node: { 
          ...p, 
          // Importante: Asegurarnos que todos los campos requeridos por el DTO existan
          id_paciente: p._id.toString(), 
          nombre_paciente: p.nombre_paciente || '',
          apellido_paciente: p.apellido_paciente || '',
          dni: p.dni || '',
        },
        cursor: p._id.toString(),
      })),
      aggregate: {
        count: total,
      },
    };
  } catch (error) {
    console.error("Error en getPacientes:", error);
    throw new Error("No se pudo obtener la lista de pacientes");
  }
}