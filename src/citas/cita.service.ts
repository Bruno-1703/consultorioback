import { Injectable, Logger } from '@nestjs/common';
//import { ObjectId } from "mongodb";
import { Cita, CitaResultadoBusqueda } from './cita.dto';
import { CitaInput, CitaWhereInput } from './cita.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnfermedadInput } from 'src/enfermedad/enfermedad.input';
import { MedicamentoInput } from 'src/medicamentos/medicamento.input';
import { getCitaById } from 'src/mongo/citas/getCitaById';
import { getCitas } from 'src/mongo/citas/getCitas';
import { PacienteInput } from 'src/paciente/paciente.input';
import { EstudioInput } from 'src/estudios/estudio.input';

@Injectable()
export class CitaService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(CitaService.name);

  async getCita(id: string): Promise<Cita | null> {
    try {
      const cita = await getCitaById(this.prisma.mongodb, id);
      // const cita = await this.prisma.client.cita.findUnique({
      //   where: { id_cita: id },
      // });

      return cita || null;
    } catch (error) {
      console.error('Error al obtener la cita', error);
      throw new Error('Error al obtener la cita');
    }
  }
  async getCitas(
    take: number,
    skip: number,
    where: CitaInput,
  ): Promise<CitaResultadoBusqueda> {
    try {
      const citas = await getCitas(this.prisma.mongodb, skip, take, where);
      return citas;
    } catch (error) {
      console.error('Error al buscar citas', error);
      throw new Error('Error al buscar citas');
    }
  }
  async createCita(data: CitaInput,  paciente: PacienteInput,): Promise<string> {
    try {
      await this.prisma.client.cita.create({
        data: {
          motivoConsulta: data.motivoConsulta,
          observaciones: data.observaciones,
          cancelada: false,
          paciente: {
            set: {
              id_paciente: paciente.id_paciente,
              dni: paciente.dni,
              nombre_paciente: paciente.nombre_paciente,
            },
          },
        },
      });
      return 'Cita creada Exitosamente';
    } catch (error) {
      console.error('Error crear cita', error);
      throw new Error('Error crear cita');
    }
  }

  async updateCita(data: CitaInput, citaId: string): Promise<string> {
    try {
      await this.prisma.client.cita.update({
        where: { id_cita: citaId },
        data,
      });

      return 'Cita actualizada exitosamente';
    } catch (error) {
      console.error('Error al actualizar la cita', error);
      throw new Error('Error al actualizar la cita');
    }
  }
  async createCitaEnfermedad(
    citaId: string,
    enfermedades: EnfermedadInput[],
  ): Promise<string> {
    this.logger.log({ action: 'CrearCitaEnfermedad' });
    try {
      await this.prisma.client.cita.update({
        where: {
          id_cita: citaId,
        },
        data: {
          enfermedades: {
            push: enfermedades.map((enfermedad) => ({
              id_enfermedad: enfermedad?.id_enfermedad,
              nombre_enf: enfermedad?.nombre_enf,
              fecha: new Date(),
            })),
          },
        },
      });

      return 'Cita actualizada exitosamente con las enfermedades agregadas';
    } catch (error) {
      console.error('Error al agregar enfermedades a la cita:', error);
      throw new Error('No se pudieron agregar las enfermedades a la cita');
    }
  }
  async createCitaMedicametos(
    citaId: string,
    medicamenetos: MedicamentoInput[],
  ): Promise<string> {
    this.logger.log({ action: 'crearCitaMedicametos' });
    try {
      await this.prisma.client.cita.update({
        where: {
          id_cita: citaId,
        },
        data: {
          medicamentos: {
            push: medicamenetos.map((medicamento) => ({
              id_medicamento: medicamento?.id_medicamento,
              nombre_med: medicamento?.nombre_med,
            })),
          },
        },
      });

      return 'Cita actualizada exitosamente con los medicamentos agregados';
    } catch (error) {
      console.error('Error al agregar enfermedades a la cita:', error);
      throw new Error('No se pudieron agregar  con los medicamentos a la cita');
    }
  }
  async createCitaEstudios(
    citaId: string,
    estudios: EstudioInput[],
  ): Promise<string> {
    this.logger.log({ action: 'crearCitaEstudios' });
    try {
      await this.prisma.client.cita.update({
        where: {
          id_cita: citaId,
        },
        data: {
          estudios: {
            push: estudios.map((estudio) => ({
              codigo_referencia: estudio?.codigo_referencia,
              id_estudio: estudio?.id_estudio,
              fecha_realizacion: estudio?.fecha_realizacion
            })),
          },
        },
      });

      return 'Cita actualizada exitosamente con los medicamentos agregados';
    } catch (error) {
      console.error('Error al agregar enfermedades a la cita:', error);
      throw new Error('No se pudieron agregar  con los medicamentos a la cita');
    }
  }

}
