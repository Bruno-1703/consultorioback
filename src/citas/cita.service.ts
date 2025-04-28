import { Injectable, Logger } from '@nestjs/common';
//import { ObjectId } from "mongodb";
import { Cita, CitaResultadoBusqueda } from './cita.dto';
import { CitaInput, CitaWhereInput } from './cita.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnfermedadInput } from 'src/enfermedad/enfermedad.input';
import { MedicamentoInput } from 'src/medicamentos/medicamento.input';
import { getCitaById } from 'src/mongo/citas/getCitaById';
import { getCitas } from 'src/mongo/citas/getCitas';
import { PacienteCitaInput, PacienteInput } from 'src/paciente/paciente.input';
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
    limit: number,
    skip: number,
    where: CitaInput,
  ): Promise<CitaResultadoBusqueda> {
    try {
      const citas = await getCitas(this.prisma.mongodb,skip,limit , where);
      return citas;
    } catch (error) {
      console.error('Error al buscar citas', error);
      throw new Error('Error al buscar citas');
    }
  }
  async createCita(data: CitaInput,  paciente: PacienteCitaInput,): Promise<string> {
    try {
      await this.prisma.client.cita.create({
        data: {
          motivoConsulta: data.motivoConsulta,
          observaciones: data.observaciones,
          cancelada: false,
          fechaSolicitud: data.fechaSolicitud,     
          id_userDoctor:  ""    ,
          paciente: {
            set: {
              id_paciente: paciente.id_paciente,
              dni: paciente.dni,
              nombre_paciente: paciente.nombre_paciente,
            },
          },
        },
      });
      await this.prisma.client.auditoria.create({
        data: {
          accion: 'CREATE', // Asegúrate de usar el valor correcto del enum, en este caso 'CREAR'
          usuarioId: "", // Si es obligatorio, asegúrate de asignar un ID válido o manejarlo como null
          usuarioNom: "usuarioNombre", // Asumí que 'usuarioNom' es el campo correcto para el nombre del usuario
          detalles: `Se creó una nueva cita con ID ${data.id_cita}.`, // Detalles de la acción realizada
          model: 'Cita', // El modelo afectado
          registro_id: data.id_cita, // ID de la cita afectada
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
      await this.prisma.client.auditoria.create({
        data: {
          accion: 'UPDATE', 
          usuarioId:"",
          usuarioNom: "usuarioNombre",
          detalles: `Se actualizó la cita con ID ${data.id_cita}.`,
          model: 'Cita',
          registro_id: data.id_cita,
        },
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
              id_estudio: estudio?.id_estudio || "",
              fecha_realizacion: estudio?.fecha_realizacion,
              observaciones: estudio?.observaciones,
              tipo_estudio: estudio?.tipo_estudio,
              medico_solicitante: estudio?.medico_solicitante
            })),
          },
        },
      });

      return 'Cita actualizada exitosamente con los Estudios agregados';
    } catch (error) {
      console.error('Error al agregar Estudios a la cita:', error);
      throw new Error('No se pudieron agregar  con los Estudios a la cita');
    }
  }
  async cancelarCita(id: string): Promise<string> {
    const cita = await this.prisma.client.cita.findUnique({ where: { id_cita: id } });
  
    if (!cita) {
      throw new Error('La cita no existe');
    }
  
    await this.prisma.client.cita.update({
      where: { id_cita: id },
      data: { cancelada: true },
    });
  
    return 'Cita cancelada correctamente';
  }
  

}
