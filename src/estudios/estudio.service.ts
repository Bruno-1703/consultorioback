import { Injectable, Logger } from '@nestjs/common';
//import { PrismaService } from '../prisma/prisma.service';
//import { ObjectId } from "mongodb";
import { Prisma } from '@prisma/client';
import { Estudio, EstudioResultadoBusqueda } from './estudio.dto';
import { EstudioInput, EstudioWhereInput } from './estudio.input';
import { PrismaService } from '../prisma/prisma.service';
import { getEstudios } from 'src/mongo/estudios/getEstudios';
import { getEstudioById } from 'src/mongo/estudios/getEstudiosById';

@Injectable()
export class EstudioService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(EstudioService.name);

  async getEstudio(id: string): Promise<Estudio | null> {
    try {
      const estudio = await getEstudioById(this.prisma.mongodb, id );

      if (!estudio) {
        throw new Error(`No se encontró el estudio con ID ${id}`);
      }
      return estudio;
    } catch (error) {
      console.error('Error al obtener el estudio', error);
      this.logger.error(error);
      throw new Error('Error al obtener el estudio');
    }
  }
  async getEstudios(
    limit?: number,
    skip?: number,
    where?: EstudioWhereInput,

  ): Promise<EstudioResultadoBusqueda | null> {
    try {
      const estudios = await getEstudios(
        this.prisma.mongodb, skip, limit, where
      );   

      return estudios;
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
