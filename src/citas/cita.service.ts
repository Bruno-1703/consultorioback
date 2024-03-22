import { Injectable, Logger } from '@nestjs/common';
//import { ObjectId } from "mongodb";
import { Cita, CitaResultadoBusqueda } from './cita.dto';
import { CitaInput } from './cita.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CitaService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(CitaService.name);

  async getCita(id: string): Promise<Cita | null> {
    try {
      const cita = await this.prisma.client.cita.findUnique({
        where: { id_cita: id },
      });

      return cita || null;
    } catch (error) {
      console.error('Error al obtener la cita', error);
      // Handle additional error logging or custom error handling if needed
      throw new Error('Error al obtener la cita');
    }
  }

  async getCitas(where?, skip?, limit?): Promise<CitaResultadoBusqueda> {
    try {
      const filteredCitas = await this.prisma.client.cita.findMany({
        where,
        skip,
        take: limit,
      });

      const totalCitas = await this.prisma.client.cita.count({ where });

      const resultadoBusqueda: CitaResultadoBusqueda = {
        edges: filteredCitas.map((cita) => ({
          node: { ...cita, id: cita.id_cita },
          cursor: cita.id_cita,
        })),
        aggregate: { count: totalCitas },
      };

      return resultadoBusqueda;
    } catch (error) {
      console.error('Error al buscar citas', error);
      // Handle additional error logging or custom error handling if needed
      throw new Error('Error al buscar citas');
    }
  }
  async createCita(data: CitaInput): Promise<string> {
    try {
      await this.prisma.client.cita.create({
        data: {
          id_cita: data.id_cita,
          motivoConsulta: data.motivoConsulta,
          fechaSolicitud: data.fechaSolicitud,
          fechaConfirmacion: data.fechaConfirmacion,
          observaciones: data.observaciones,
        },
      });
      return 'Cita created successfully';
    } catch (error) {
      console.error('Error creating cita', error);
      throw new Error('Error creating cita');
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
}
