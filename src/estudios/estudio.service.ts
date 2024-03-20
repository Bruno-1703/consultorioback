import { Injectable, Logger } from '@nestjs/common';
//import { PrismaService } from '../prisma/prisma.service';
//import { ObjectId } from "mongodb";
import { Prisma } from '@prisma/client';
import { Estudio, EstudioResultadoBusqueda } from './estudio.dto';
import { EstudioInput, EstudioWhereInput } from './estudio.input';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EstudioService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(EstudioService.name);

  async getEstudio(id: string): Promise<Estudio | null> {
    try {
      const estudio = await this.prisma.client.estudio.findUnique({
        where: { id_estudio: id },
      });

      return estudio;
    } catch (error) {
      console.error('Error al obtener el estudio', error);
      this.logger.error(error);
      throw new Error('Error al obtener el estudio');
    }
  }
  async getEstudios(
    where?: EstudioWhereInput,
    skip?: number,
    limit?: number,
  ): Promise<EstudioResultadoBusqueda | null> {
    try {
      const estudios = await this.prisma.client.estudio.findMany({
        where,
        skip,
        take: limit,
      });

      const totalEstudios = await this.prisma.client.estudio.count({ where });

      const resultadoBusqueda: EstudioResultadoBusqueda = {
        edges: estudios.map((estudio) => ({ node: estudio, cursor: '' })),
        aggregate: { count: totalEstudios },
      };

      return resultadoBusqueda;
    } catch (error) {
      console.error('Error al buscar estudios', error);
      this.logger.error(error);
      throw new Error('Error al buscar estudios');
    }
  }

  async createEstudio(data: EstudioInput): Promise<string> {
    try {
      const nuevoEstudio = await this.prisma.client.estudio.create({
        data,
      });
      this.logger.debug('Estudio creado:', nuevoEstudio);
      return 'Estudio creado exitosamente';
    } catch (error) {
      console.error('Error al crear el estudio', error);
      this.logger.error(error);
      throw new Error('Error al crear el estudio');
    }
  }

  async updateEstudio(data: EstudioInput, estudioId: string): Promise<string> {
    try {
      const estudioActualizado = await this.prisma.client.estudio.update({
        where: { id_estudio: estudioId },
        data,
      });

      this.logger.debug('Estudio actualizado:', estudioActualizado);
      return 'Estudio actualizado exitosamente';
    } catch (error) {
      console.error('Error al actualizar el estudio', error);
      this.logger.error(error);
      throw new Error('Error al actualizar el estudio');
    }
  }
}
