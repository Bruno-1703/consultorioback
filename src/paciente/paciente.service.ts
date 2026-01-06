import { createParamDecorator, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Paciente, PacientesResultadoBusqueda } from './paciente.dto';
import { Prisma } from '@prisma/client';
import { PacienteInput, PacienteWhereInput } from './paciente.input';
import { getPacientes } from 'src/mongo/pacientes/getPacientes';
import { getPacienteById } from 'src/mongo/pacientes/getPacienteById';
@Injectable()
export class PacienteService {
  constructor(private prisma: PrismaService) { }
  private readonly logger = new Logger(PacienteService.name);

  async getPaciente(id: string): Promise<Paciente | null> {
    try {
      this.logger.debug(`Recuperando paciente con ID ${id}`);
      const paciente = await getPacienteById(this.prisma.mongodb, id);

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
    skip?: number,
    limit?: number,
    where?: PacienteWhereInput,
  ): Promise<PacientesResultadoBusqueda | null> {
    try {
      this.logger.debug('Buscando pacientes con criterios:', where);
      const pacientes = await getPacientes(
        this.prisma.mongodb,
         skip,
        limit,
       
        where,
      );

      this.logger.debug('Pacientes recuperados exitosamente');
      return pacientes;
    } catch (error) {
      console.error('Error al buscar pacientes', error);
      this.logger.error(error);
      throw new Error('Error al buscar pacientes');
    }
  }

  async createPaciente(data: PacienteInput, centroSaludId: string,): Promise<string> {
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
        nacionalidad: data.nacionalidad,
        obra_social: data.obra_social,
        direccion: data.direccion,
        email: data.email,

      };
      const paciente = await this.prisma.client.paciente.create({
        data: pacienteData,
      });
      this.logger.debug('Paciente creado exitosamente');
      return 'Paciente creado exitosamente';
    } catch (error) {
      console.error('Error al crear paciente', error);
      this.logger.error(error);
      throw new Error('Error al crear paciente');
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
          dni: data.dni ?? existingPaciente.dni,
          nombre_paciente: data.nombre_paciente ?? existingPaciente.nombre_paciente,
          apellido_paciente: data.apellido_paciente ?? existingPaciente.apellido_paciente,
          edad: data.edad ?? existingPaciente.edad,
          altura: data.altura ?? existingPaciente.altura,
          telefono: data.telefono ?? existingPaciente.telefono,
          fecha_nacimiento: data.fecha_nacimiento ?? existingPaciente.fecha_nacimiento,
          sexo: data.sexo ?? existingPaciente.sexo,
          grupo_sanguineo: data.grupo_sanguineo ?? existingPaciente.grupo_sanguineo,
          alergias: data.alergias ?? existingPaciente.alergias,
          obra_social: data.obra_social ?? existingPaciente.obra_social,
          email: data.email ?? existingPaciente.email,
          direccion: data.direccion ?? existingPaciente.direccion,
          nacionalidad: data.nacionalidad ?? existingPaciente.nacionalidad,
        },
      });

      this.logger.debug('Paciente actualizado exitosamente');
      return 'Paciente actualizado exitosamente';
    } catch (error) {
      this.logger.error(error);
      throw new Error('Error al actualizar paciente');
    }
  }
  async ElimiarPacienteLog(pacienteId: string): Promise<string> {
    try {
      this.logger.debug(`Eliminando lógicamente el paciente con ID ${pacienteId}`);
      const existingPaciente = await this.prisma.client.paciente.findUnique({
        where: { id_paciente: pacienteId },
      });
      if (!existingPaciente) {
        throw new Error(`No se encontró el paciente con ID ${pacienteId}`);
      }

      await this.prisma.client.paciente.update({
        where: { id_paciente: pacienteId },
        data: {
          eliminadoLog: true,
        },
      });

      this.logger.debug('Paciente eliminado lógicamente exitosamente');
      return 'Paciente eliminado lógicamente';
    } catch (error) {
      console.error('Error al eliminar lógicamente el paciente', error);
      this.logger.error(error);
      throw new Error('Error al eliminar lógicamente el paciente');
    }
  }

  async EliminarPaciente(pacienteId: string): Promise<string> {
    try {
      this.logger.debug(`Eliminando definitivamente el paciente con ID ${pacienteId}`);
      const existingPaciente = await this.prisma.client.paciente.findUnique({
        where: { id_paciente: pacienteId },
      });
      if (!existingPaciente) {
        throw new Error(`No se encontró el paciente con ID ${pacienteId}`);
      }

      await this.prisma.client.paciente.delete({
        where: { id_paciente: pacienteId },
      });

      this.logger.debug('Paciente eliminado definitivamente exitosamente');
      return 'Paciente eliminado definitivamente';
    } catch (error) {
      console.error('Error al eliminar definitivamente el paciente', error);
      this.logger.error(error);
      throw new Error('Error al eliminar definitivamente el paciente');
    }
  }


  async getPacientePorDNI(dni: string, centroSaludId: string,): Promise<Paciente | null> {
    try {
      this.logger.debug(`Recuperando paciente con DNI ${dni}`);

      // Asume que tienes una función para buscar en MongoDB por DNI
      // Si usas Prisma, sería:
      return this.prisma.client.paciente.findFirst({
        where: {
          dni,
          eliminadoLog: false,
        },
      });
    } catch (error) {
      console.error('Error al recuperar paciente por DNI', error);
      this.logger.error(error);
      throw new Error('Error al recuperar paciente por DNI');
    }
  }

}
