import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ActualizarEnfermedadInput,
  EnfermedadInput,
  EnfermedadWhereInput,
} from './enfermedad.input';
import { EnfermedadResultadoBusqueda } from './enfermedad.dto';

@Injectable()
export class EnfermedadService {
  private readonly logger = new Logger(EnfermedadService.name);

  constructor(private prisma: PrismaService) {}

  async getEnfermedadById(id: string) {
    return this.prisma.client.enfermedad.findUnique({
      where: { id_enfermedad: id },
    });
  }

  async getEnfermedades(
    where?: EnfermedadWhereInput,
    skip?: number,
    limit?: number,
  ): Promise<EnfermedadResultadoBusqueda> {
    const filtro = {
      ...where,
      eliminadoLog: false,
    };

    const [data, total] = await Promise.all([
      this.prisma.client.enfermedad.findMany({
        where: filtro,
        skip: skip ?? undefined,
        take: limit ?? undefined,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.enfermedad.count({ where: filtro }),
    ]);

    return {
      edges: data.map((enf) => ({
        node: enf,
        cursor: enf.id_enfermedad,
      })),
      aggregate: { count: total },
    };
  }

  async createEnfermedad(data: EnfermedadInput): Promise<string> {
    await this.prisma.client.enfermedad.create({
      data,
    });

    return 'Enfermedad creada correctamente';
  }

  async updateEnfermedad(
    data: ActualizarEnfermedadInput,
  ): Promise<string> {
    const { id_enfermedad, ...updateData } = data;

    await this.prisma.client.enfermedad.update({
      where: { id_enfermedad },
      data: updateData,
    });

    return 'Enfermedad actualizada correctamente';
  }

  async deleteEnfermedad(id: string): Promise<string> {
    await this.prisma.client.enfermedad.update({
      where: { id_enfermedad: id },
      data: { eliminadoLog: true },
    });

    return 'Enfermedad eliminada correctamente';
  }
}
