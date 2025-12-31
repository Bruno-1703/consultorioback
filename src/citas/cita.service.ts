import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cita, CitaResultadoBusqueda } from './cita.dto';
import { CitaInput, CitaDiagnosticoInput, CitaReprogramarInput } from './cita.input';
import { EnfermedadInput } from 'src/enfermedad/enfermedad.input';
import { MedicamentoInput } from 'src/medicamentos/medicamento.input';
import { EstudioInput } from 'src/estudios/estudio.input';
import { PacienteCitaInput } from 'src/paciente/paciente.input';
import { getCitaById } from 'src/mongo/citas/getCitaById';
import { getCitas } from 'src/mongo/citas/getCitas';
import { getCitasByfecha } from 'src/mongo/citas/getCitasFecha';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class CitaService {
  private readonly logger = new Logger(CitaService.name);

  constructor(private prisma: PrismaService) { }

  // ======================
  // 🔍 CONSULTAS
  // ======================

  async getCita(id: string): Promise<Cita | null> {
    try {
      return await getCitaById(this.prisma.mongodb, id);
    } catch (error) {
      this.logger.error('Error al obtener la cita', error);
      throw new Error('Error al obtener la cita');
    }
  }

  async getCitas(
    limit: number,
    skip: number,
    where: CitaInput,
  ): Promise<CitaResultadoBusqueda> {
    try {
      return await getCitas(this.prisma.mongodb, skip, limit, where);
    } catch (error) {
      this.logger.error('Error al buscar citas', error);
      throw new Error('Error al buscar citas');
    }
  }

  async getCitasByFecha(
    limit: number,
    skip: number,
    where: CitaInput,
  ): Promise<CitaResultadoBusqueda> {
    try {
      return await getCitasByfecha(this.prisma.mongodb, skip, limit, where);
    } catch (error) {
      this.logger.error('Error al buscar citas por fecha', error);
      throw new Error('Error al buscar citas');
    }
  }

  // ======================
  // 🧾 SECRETARÍA
  // ======================
async createCita(
  data: CitaInput,
  paciente: PacienteCitaInput,
  // centroSaludId?: string,
): Promise<string> {


  try {
    const cita = await this.prisma.client.cita.create({
      data: {
        centroSalud: { connect: { id: ""} },
        motivoConsulta: data.motivoConsulta,
        observaciones: data.observaciones,
        fechaProgramada: data.fechaProgramada,
        cancelada: false,
        finalizada: false,
        registradoPorId: data.registradoPorId,
        doctor: { set: data.doctor },
        paciente: { set: paciente },
      },
    });

    await this.crearAuditoria(
      "CREATE",
      data.registradoPorId,
      "Secretaría",
      `Creación de cita en centro ID: ${"centroSaludId"}`,
      cita.id_cita,
    );

    return "Cita creada exitosamente";
  } catch (error) {
    this.logger.error("Error al crear cita", error);
    throw new Error("Error al crear la cita");
  }
}


  async updateCita(
    data: CitaInput,
    citaId: string,
  ): Promise<string> {
    try {
      await this.prisma.client.cita.update({
        where: { id_cita: citaId },
        data: {
          motivoConsulta: data.motivoConsulta,
          observaciones: data.observaciones,
          fechaProgramada: data.fechaProgramada,
        },
      });

      await this.crearAuditoria(
        'UPDATE',
        data.registradoPorId,
        'Secretaría',
        `Actualización de datos administrativos`,
        citaId,
      );

      return 'Cita actualizada exitosamente';
    } catch (error) {
      this.logger.error('Error al actualizar cita', error);
      throw new Error('Error al actualizar la cita');
    }
  }

  async cancelarCita(id: string): Promise<string> {
    const cita = await this.prisma.client.cita.findUnique({
      where: { id_cita: id },
    });

    if (!cita) throw new Error('La cita no existe');

    await this.prisma.client.cita.update({
      where: { id_cita: id },
      data: { cancelada: true },
    });

    await this.crearAuditoria(
      'UPDATE',
      cita.registradoPorId,
      'Secretaría',
      'Cancelación de cita',
      id,
    );

    return 'Cita cancelada correctamente';
  }

  // ======================
  // 🩺 MÉDICO
  // ======================

  async cargarDiagnosticoCita(
    citaId: string,
    data: CitaDiagnosticoInput,
  ): Promise<string> {
    const cita = await this.prisma.client.cita.findUnique({
      where: { id_cita: citaId },
    });

    if (!cita) throw new Error('La cita no existe');
    if (cita.cancelada) throw new Error('La cita está cancelada');

    await this.prisma.client.cita.update({
      where: { id_cita: citaId },
      data: {
        diagnostico: data.diagnostico,
        // finalizada: true,
      },
    });

    await this.crearAuditoria(
      'UPDATE',
      cita.doctor?.id_Usuario,
      'Médico',
      'Carga de diagnóstico y cierre de cita',
      citaId,
    );

    return 'Diagnóstico cargado correctamente';
  }

  // ======================
  // ➕ AGREGADOS
  // ======================

  async createCitaEnfermedad(
    citaId: string,
    enfermedades: EnfermedadInput[],
  ): Promise<string> {
    await this.prisma.client.cita.update({
      where: { id_cita: citaId },
      data: {
        enfermedades: {
          push: enfermedades.map(e => ({
            id_enfermedad: e.id_enfermedad,
            nombre_enf: e.nombre_enf,
            fecha: new Date(),
          })),
        },
      },
    });

    await this.crearAuditoria(
      'UPDATE',
      null,
      'Sistema',
      'Carga de enfermedades asociadas',
      citaId,
    );

    return 'Enfermedades agregadas correctamente';
  }

  async createCitaMedicametos(
    citaId: string,
    medicamentos: MedicamentoInput[],
  ): Promise<string> {
    await this.prisma.client.cita.update({
      where: { id_cita: citaId },
      data: {
        medicamentos: {
          push: medicamentos.map(m => ({
            id_medicamento: m.id_medicamento,
            nombre_med: m.nombre_med,
          })),
        },
      },
    });

    await this.crearAuditoria(
      'UPDATE',
      null,
      'Médico',
      'Carga de medicamentos',
      citaId,
    );

    return 'Medicamentos agregados correctamente';
  }

  async createCitaEstudios(
    citaId: string,
    estudios: EstudioInput[],
  ): Promise<string> {
    await this.prisma.client.cita.update({
      where: { id_cita: citaId },
      data: {
        estudios: {
          push: estudios.map(e => ({
            id_estudio: e.id_estudio || '',
            codigo_referencia: e.codigo_referencia,
            fecha_realizacion: e.fecha_realizacion,
            observaciones: e.observaciones,
            tipo_estudio: e.tipo_estudio,
            medico_solicitante: e.medico_solicitante,
          })),
        },
      },
    });

    await this.crearAuditoria(
      'UPDATE',
      null,
      'Médico',
      'Carga de estudios médicos',
      citaId,
    );

    return 'Estudios agregados correctamente';
  }

  // ======================
  // 🧾 AUDITORÍA CENTRALIZADA
  // ======================

  private async crearAuditoria(
    accion: 'CREATE' | 'UPDATE' | 'DELETE',
    usuarioId: string | null,
    usuarioNom: string,
    detalles: string,
    registroId: string,
  ) {
    await this.prisma.client.auditoria.create({
      data: {
        accion,
        usuarioId,
        usuarioNom,
        detalles,
        model: 'Cita',
        registro_id: registroId,
      },
    });
  }

  // ======================
  // 📊 REPORTE
  // ======================

  async finalizarCita(id: string): Promise<string> {
    const cita = await this.prisma.client.cita.findUnique({
      where: { id_cita: id },
    });

    if (!cita) {
      throw new Error('La cita no existe');
    }

    if (cita.cancelada) {
      throw new Error('No se puede finalizar una cita cancelada');
    }

    await this.prisma.client.cita.update({
      where: { id_cita: id },
      data: {
        finalizada: true,
      },
    });

    await this.prisma.client.auditoria.create({
      data: {
        accion: 'UPDATE',
        usuarioId: '', // médico
        usuarioNom: 'medico',
        detalles: `Se finalizó la cita ${id}`,
        model: 'Cita',
        registro_id: id,
      },
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

    citas.forEach(cita => {
      sheet.addRow({
        paciente: `${cita.paciente?.nombre_paciente ?? ''} ${cita.paciente?.apellido_paciente ?? ''}`,
        doctor: cita.doctor?.nombre_completo ?? '',
        motivo: cita.motivoConsulta,
        fecha: cita.fechaProgramada?.toLocaleString(),
        finalizada: cita.finalizada ? 'Sí' : 'No',
        cancelada: cita.cancelada ? 'Sí' : 'No',
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte-citas.xlsx');
    res.end(buffer);
  }
  async reprogramarCita(
    data: CitaReprogramarInput, // Usamos el input específico
    citaId: string,
  ): Promise<string> {
    try {
      const existingCita = await this.prisma.client.cita.findUnique({
        where: { id_cita: citaId },
      });

      if (!existingCita) {
        throw new Error('La cita no existe.');
      }
      if (existingCita.cancelada) {
        throw new Error('No se puede reprogramar una cita cancelada.');
      }
      if (existingCita.finalizada) {
        throw new Error('No se puede reprogramar una cita finalizada.');
      }

      await this.prisma.client.cita.update({
        where: { id_cita: citaId },
        data: {
          fechaProgramada: data.fechaProgramada, // <-- Solo actualizamos la fecha
        },
      });

      await this.crearAuditoria(
        'UPDATE',
        data.registradoPorId || 'Sistema',
        'Secretaría/Sistema',
        `Cita reprogramada a nueva fecha: ${data.fechaProgramada.toISOString()}`,
        citaId,
      );

      return 'Cita reprogramada exitosamente';
    } catch (error) {
      this.logger.error('Error al reprogramar cita', error);
      throw new Error(`Error al reprogramar la cita: ${error.message}`);
    }
  }
}
