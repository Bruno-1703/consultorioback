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
import { getCitasByfecha } from 'src/mongo/citas/getCitasFecha';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class CitaService {
  constructor(private prisma: PrismaService) { }
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
      const citas = await getCitas(this.prisma.mongodb, skip, limit, where);
      return citas;
    } catch (error) {
      console.error('Error al buscar citas', error);
      throw new Error('Error al buscar citas');
    }
  }
  async getCitasByFecha(
    limit: number,
    skip: number,
    where: CitaInput,
  ): Promise<CitaResultadoBusqueda> {
    try {
      const citas = await getCitasByfecha(this.prisma.mongodb, skip, limit, where);
      return citas;
    } catch (error) {
      console.error('Error al buscar citas', error);
      throw new Error('Error al buscar citas');
    }
  }
  async createCita(data: CitaInput, paciente: PacienteCitaInput): Promise<string> {
    try {
      const nuevaCita = await this.prisma.client.cita.create({
        data: {
          motivoConsulta: data.motivoConsulta,
          observaciones: data.observaciones,
          cancelada: false,
          fechaProgramada: data.fechaProgramada,
           registradoPorId: data.registradoPorId, // ID del usuario que registra

          doctor: {
            set: {
              id_Usuario: data.doctor.id,
              nombre_usuario: data.doctor.nombre_usuario,
              email: data.doctor.email,
              especialidad: data.doctor.especialidad,
              matricula: data.doctor.matricula,
              dni: data.doctor.dni,
              telefono: data.doctor.telefono,
            },
          },
          paciente: {
            set: {
              id_paciente: paciente.id_paciente,
              dni: paciente.dni,
              nombre_paciente: paciente.nombre_paciente,
              apellido_paciente: paciente.apellido_paciente,
            },
            
          },
        },
      });

      await this.prisma.client.auditoria.create({
        data: {
          accion: 'CREATE',
          usuarioId: "", // ID del usuario logueado
          usuarioNom: "usuarioNombre",
          detalles: `Se creó una nueva cita con ID ${nuevaCita.id_cita}.`,
          model: 'Cita',
          registro_id: nuevaCita.id_cita,
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
          usuarioId: "",
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

    return 'Cita finalizada correctamente';
  }
  async finalizarCita(id: string): Promise<string> {
    const cita = await this.prisma.client.cita.findUnique({ where: { id_cita: id } });

    if (!cita) {
      throw new Error('La cita no existe');
    }

    await this.prisma.client.cita.update({
      where: { id_cita: id },
      data: { finalizada: true },
    });

    return 'Cita finalizada correctamente';
  }

  async generarReporteCitas(res: Response): Promise<void> {
    const citas = await this.prisma.client.cita.findMany();


    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Citas');

    sheet.columns = [
      { header: 'Paciente', key: 'paciente', width: 30 },
      { header: 'Doctor', key: 'doctor', width: 30 },
      { header: 'Motivo', key: 'motivo', width: 40 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Finalizada', key: 'finalizada', width: 15 },
      { header: 'Cancelada', key: 'cancelada', width: 15 },
    ];

    for (const cita of citas) {
      sheet.addRow({
        paciente: `${cita.paciente?.nombre_paciente ?? ''} ${cita.paciente?.apellido_paciente ?? ''}`,
        doctor: cita.doctor?.nombre_completo ?? '',
        motivo: cita.motivoConsulta,
        fecha: cita.fechaProgramada?.toLocaleString(),
        finalizada: cita.finalizada ? 'Sí' : 'No',
        cancelada: cita.cancelada ? 'Sí' : 'No',
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-citas.xlsx');
    res.end(buffer);
  }
}
