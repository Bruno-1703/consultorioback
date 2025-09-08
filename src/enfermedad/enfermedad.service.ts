import { Injectable, Logger } from '@nestjs/common';
//import { ObjectId } from "mongodb";

import { PrismaService } from 'src/prisma/prisma.service';
import { Enfermedad, EnfermedadResultadoBusqueda } from './enfermedad.dto';
import { EnfermedadInput } from './enfermedad.input';

@Injectable()
export class EnfermedadService {
  constructor(private prisma: PrismaService) { }
  private readonly logger = new Logger(EnfermedadService.name);

  async getEnfermedadById(id: string): Promise<Enfermedad | null> {
    try {
      this.logger.debug(`Recuperando enfermedad con ID ${id}`);

      const enfermedad = await this.prisma.client.enfermedad.findUnique({
        where: {
          id_enfermedad: id,
        },
      });

      this.logger.debug(`Enfermedad recuperada exitosamente`);
      return enfermedad;
    } catch (error) {
      console.error('Error al recuperar enfermedad', error);
      this.logger.error(error);
      throw new Error('Error al recuperar enfermedad');
    }
  }

async getEnfermedad(
  where?: any,
  skip?: number,
  limit?: number,
): Promise<EnfermedadResultadoBusqueda> {
  try {
    console.log('Parámetros recibidos:', { where, skip, limit });

    const filteredEnfermedad = await this.prisma.client.enfermedad.findMany({
      where: where || {},
      skip: skip ?? undefined,
      take: limit ?? undefined,
    });

    const totalEnfermedades = await this.prisma.client.enfermedad.count({
      where: where || {},
    });

    return {
      edges: filteredEnfermedad.map((enfermedad) => ({
        node: {
          id_enfermedad: enfermedad.id_enfermedad,
          nombre_enf: enfermedad.nombre_enf,
          sintomas: enfermedad.sintomas,
          gravedad: enfermedad.gravedad,
        },
        cursor: enfermedad.id_enfermedad,
      })),
      aggregate: { count: totalEnfermedades },
    };
  } catch (error) {
    console.error('Error Prisma:', error);
    throw new Error('Error al buscar enfermedad');
  }
}

  async createEnfermedad(data: EnfermedadInput): Promise<string> {
    try {
      await this.prisma.client.enfermedad.create({
        data: {
          id_enfermedad: data.id_enfermedad,
          nombre_enf: data.nombre_enf,
          sintomas: data.sintomas,
          gravedad: data.gravedad,
        },
      });
      return 'ENFERMEDAD created successfully';
    } catch (error) {
      console.error('Error creating enfermedad', error);
      throw new Error('Error creating enfermedad');
    }
  }

  async updateEnfermedad(
    data: EnfermedadInput,
    enfermedadId: string,
  ): Promise<string> {
    try {
      await this.prisma.client.enfermedad.update({
        where: { id_enfermedad: enfermedadId },
        data,
      });

      return 'Enfermedad actualizada exitosamente';
    } catch (error) {
      console.error('Error al actualizar la enfermedad', error);
      this.logger.error(error);
      throw new Error('Error al actualizar la enfermedad');
    }
  }
  async deleteEnfermedad(id: string): Promise<string> {
    // Buscar la enfermedad primero
    const enfermedad = await this.prisma.client.enfermedad.findUnique({
      where: { id_enfermedad: id }  // debe ser objeto con campo llave primaria
    });
    if (!enfermedad) {
      throw new Error('Enfermedad no encontrada');
    }
    // Eliminar la enfermedad
    await this.prisma.client.enfermedad.delete({
      where: { id_enfermedad: id }
    });
    return 'Enfermedad eliminada correctamente';
  }


}
