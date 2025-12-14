import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInternacionInput } from './create-internacion.input';
import { AltaInternacionInput } from './alta-internacion.input';
import { UpdateInternacionInput } from './update-internacion.input';


@Injectable()
export class InternacionService {
  constructor(private prisma: PrismaService) {}

  // Crear internación
  async internarPaciente(data: CreateInternacionInput) {
    const cama = await this.prisma.client.cama.findUnique({
      where: { id_cama: data.camaId },
    });

    if (!cama) {
      throw new BadRequestException('La cama no existe.');
    }

    if (!cama.disponible) {
      throw new BadRequestException('La cama está ocupada.');
    }

    // Se marca la cama como ocupada
    await this.prisma.client.cama.update({
      where: { id_cama: data.camaId },
      data: { disponible: false },
    });

    // Crear internación
    return this.prisma.client.internacion.create({
      data: {
        paciente: { connect: { id_paciente: data.pacienteId } },
        cama: { connect: { id_cama: data.camaId } },
        diagnostico: data.diagnostico,
        observaciones: data.observaciones,
      },
    });
  }

  // Dar alta a una internación
  async darAlta(input: AltaInternacionInput) {
    const internacion = await this.prisma.client.internacion.findUnique({
      where: { id_internacion: input.id_internacion },
    });

    if (!internacion) {
      throw new BadRequestException('Internación no encontrada.');
    }

    if (!internacion.activa) {
      throw new BadRequestException('La internación ya está finalizada.');
    }

    // Libera cama
    await this.prisma.client.cama.update({
      where: { id_cama: internacion.camaId },
      data: { disponible: true },
    });

    // Actualiza internación
    return this.prisma.client.internacion.update({
      where: { id_internacion: input.id_internacion },
      data: {
        fecha_alta: new Date(),
        activa: false,
        observaciones: input.observaciones_alta ?? internacion.observaciones,
      },
    });
  }

  // Actualiza internación
  async updateInternacion(input: UpdateInternacionInput) {
    return this.prisma.client.internacion.update({
      where: { id_internacion: input.id_internacion },
      data: {
        diagnostico: input.diagnostico,
        observaciones: input.observaciones,
      },
    });
  }

  // Listar internaciones activas
  async activas() {
    return this.prisma.client.internacion.findMany({
      where: { activa: true },
      include: { paciente: true, cama: true },
    });
  }

  // Historial por paciente
  async historialPorPaciente(pacienteId: string) {
    return this.prisma.client.internacion.findMany({
      where: { pacienteId },
      orderBy: { fecha_ingreso: 'desc' },
      include: { cama: true },
    });
  }

  // Camas disponibles
  async camasDisponibles() {
    return this.prisma.client.cama.findMany({
      where: { disponible: true },
      include: { pabellon: true },
    });
  }
}
