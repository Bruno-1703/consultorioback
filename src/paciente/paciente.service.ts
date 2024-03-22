import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Paciente, PacientesResultadoBusqueda } from './paciente.dto';

import { Prisma } from '@prisma/client';
import { CitaInput } from '../citas/cita.input';
import { EnfermedadInput } from '../enfermedad/enfermedad.input';
import { PacienteInput, PacienteWhereInput } from './paciente.input';
@Injectable()
export class PacienteService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(PacienteService.name);

  async getPaciente(id: string): Promise<Paciente | null> {
    try {
      this.logger.debug(`Recuperando paciente con ID ${id}`);
      const paciente = await this.prisma.client.paciente.findUnique({
        where: {
          id_paciente: id,
        },
        include: {
          medicamentos: false,
          cita: false,
          Enfermedad: true,
          estudios: true,
        },
      });

      if (!paciente) {
        throw new Error(`No se encontró el paciente con ID ${id}`);
      }
      this.logger.debug('Paciente recuperado exitosamente');
      console.log(paciente);
      return paciente;
    } catch (error) {
      console.error('Error al recuperar paciente', error);
      this.logger.error(error);
      throw new Error('Error al recuperar paciente');
    }
  }
  async getPacientes(
    where?: PacienteWhereInput | undefined,
    skip?: number,
    limit?: number,
  ): Promise<PacientesResultadoBusqueda | null> {
    try {
      this.logger.debug('Buscando pacientes con criterios:', where);

      const pacientes = await this.prisma.client.paciente.findMany({
        where: {},
        skip,
        take: limit,
        include: {
          cita: true,
          medicamentos: true,
          estudios: true,
          Enfermedad: true,
        },
      });
      const totalPacientes = await this.prisma.client.paciente.count({});

      const resultadoBusqueda: PacientesResultadoBusqueda = {
        edges: pacientes.map((node) => ({
          node,
          cursor: node.id_paciente,
        })),
        aggregate: {
          count: totalPacientes,
        },
      };

      this.logger.debug('Pacientes encontrados:', resultadoBusqueda);
      return resultadoBusqueda;
    } catch (error) {
      console.error('Error al buscar pacientes', error);
      this.logger.error(error);
      throw new Error('Error al buscar pacientes');
    }
  }

  async createPaciente(data: PacienteInput): Promise<string> {
    try {
      this.logger.debug('Creando paciente');
      const pacienteData: Prisma.PacienteCreateInput = {
        dni: data.dni,
        nombre_paciente: data.nombre_paciente,
        apellido_paciente: data.apellido_paciente,
        edad: data.edad,
        altura: data.altura,
        telefono: data.telefono,
        fecha_nacimiento: data.fecha_nacimiento,
        sexo: data.sexo,
        grupo_sanguineo: data.grupo_sanguineo,
        alergias: data.alergias,
      };
      const paciente = await this.prisma.client.paciente.create({
        data: pacienteData,
      });
      this.logger.debug('Paciente creado exitosamente');
      console.log(paciente);
      return 'Paciente creado exitosamente';
    } catch (error) {
      console.error('Error al crear paciente', error);
      this.logger.error(error);
      throw new Error('Error al crear paciente');
    }
  }
  async createPacienteEnfermedad(
    paciente: PacienteInput,
    enfermedades: EnfermedadInput[],
  ): Promise<string> {
    this.logger.log({ action: 'CreatePacienteEnfermedad' });
    try {
      // Crear el paciente con las enfermedades agregadas
      await this.prisma.client.paciente.create({
        data: {
          dni: paciente.dni,
          nombre_paciente: paciente.nombre_paciente,
          apellido_paciente: paciente.apellido_paciente,
          edad: paciente.edad,
          altura: paciente.altura,
          telefono: paciente.telefono,
          fecha_nacimiento: paciente.fecha_nacimiento,
          sexo: paciente.sexo,
          grupo_sanguineo: paciente.grupo_sanguineo,
          alergias: paciente.alergias,
          enfermedad: {
            set: enfermedades.map((enfermedad) => ({
              id_enfermedad: enfermedad.id_enfermedad,
              nombre_enf: enfermedad.nombre_enf,
              gravedad: enfermedad.gravedad,
              sintomas: enfermedad.sintomas,
            })),
          },
        },
      });
      return 'Enfermedades agregadas al paciente exitosamente';
    } catch (error) {
      console.error('Error al agregar enfermedades al paciente:', error);
      throw new Error('No se pudieron agregar las enfermedades al paciente');
    }
  }
  async createPacienteCitas(
    paciente: PacienteInput,
    citas: CitaInput[],
  ): Promise<string> {
    this.logger.log({ action: 'CreatePacienteCitas' });
    try {
      // Crear el paciente con las citas agregadas
      await this.prisma.client.paciente.create({
        data: {
          dni: paciente.dni,
          nombre_paciente: paciente.nombre_paciente,
          apellido_paciente: paciente.apellido_paciente,
          edad: paciente.edad,
          altura: paciente.altura,
          telefono: paciente.telefono,
          fecha_nacimiento: paciente.fecha_nacimiento,
          sexo: paciente.sexo,
          grupo_sanguineo: paciente.grupo_sanguineo,
          alergias: paciente.alergias,
          cita: {
            set: citas.map((cita) => ({
              motivoConsulta: cita.motivoConsulta,
              cancelada: cita.cancelada,
              fechaSolicitud: cita.fechaSolicitud,
              fechaConfirmacion: cita.fechaConfirmacion,
              observaciones: cita.observaciones,
            })),
          },
        },
      });
      return 'Citas agregadas al paciente exitosamente';
    } catch (error) {
      console.error('Error al agregar citas al paciente:', error);
      throw new Error('No se pudieron agregar las citas al paciente');
    }
  }
  async updatePaciente(
    data: PacienteInput,
    pacienteId: string,
  ): Promise<string> {
    try {
      this.logger.debug(`Actualizando paciente con ID ${pacienteId}`);
      const existingPaciente = await this.prisma.client.paciente.findUnique({
        where: {
          id_paciente: pacienteId,
        },
      });
      if (!existingPaciente) {
        throw new Error(`No se encontró el paciente con ID ${pacienteId}`);
      }
      await this.prisma.client.paciente.update({
        where: { id_paciente: pacienteId },
        data: {
          dni: data.dni || existingPaciente.dni,
          nombre_paciente:
            data.nombre_paciente || existingPaciente.nombre_paciente,
          apellido_paciente:
            data.apellido_paciente || existingPaciente.apellido_paciente,
          edad: data.edad || existingPaciente.edad,
          altura: data.altura || existingPaciente.altura,
          telefono: data.telefono || existingPaciente.telefono,
          fecha_nacimiento:
            data.fecha_nacimiento || existingPaciente.fecha_nacimiento,
          sexo: data.sexo || existingPaciente.sexo,
          grupo_sanguineo:
            data.grupo_sanguineo || existingPaciente.grupo_sanguineo,
          alergias: data.alergias || existingPaciente.alergias,
        },
      });

      this.logger.debug('Paciente actualizado exitosamente');
      return 'Paciente actualizado exitosamente';
    } catch (error) {
      console.error('Error al actualizar paciente', error);
      this.logger.error(error);
      throw new Error('Error al actualizar paciente');
    }
  }
  async buscarPacientesPorNombreO_DNI(
    nombre: string,
    dni: string,
  ): Promise<Paciente[] | null> {
    try {
      this.logger.debug(
        `Buscando pacientes con nombre: ${nombre} o DNI: ${dni}`,
      );
      const pacientes = await this.prisma.client.paciente.findMany({
        where: {
          OR: [
            {
              nombre_paciente: {
                contains: nombre,
              },
            },
            {
              dni: {
                contains: dni,
              },
            },
          ],
        },
      });

      this.logger.debug('Pacientes encontrados:', pacientes);
      return null;
    } catch (error) {
      console.error('Error al buscar pacientes por nombre o DNI', error);
      this.logger.error(error);
      throw new Error('Error al buscar pacientes por nombre o DNI');
    }
  }
}
