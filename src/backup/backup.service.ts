import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BackupService {
  constructor(private prisma: PrismaService) {}

  async exportBackupJson() {
    const pacientes = await this.prisma.client.paciente.findMany();
    const citas = await this.prisma.client.cita.findMany();
    const usuarios = await this.prisma.client.usuario.findMany();
    const medicamentos = await this.prisma.client.medicamento.findMany();
    const enfermedades = await this.prisma.client.enfermedad.findMany();

    return {
      pacientes,
      citas,
      usuarios,
      medicamentos,
      enfermedades,
      generado: new Date(),
    };
  }
}
