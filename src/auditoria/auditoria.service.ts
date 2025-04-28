import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Auditoria, AuditoriaResultadoBusqueda } from './auditoria.dto';
import { AuditoriaInput, AuditoriaWhereInput } from './auditoria.input';
import { getAuditorias } from 'src/mongo/auditoria/getAuditorias';
import { getAuditoriaById } from 'src/mongo/auditoria/getAuditoriaById';


@Injectable()
export class AuditoriaService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(AuditoriaService.name);

  async getAuditoria(id: string): Promise<Auditoria | null> {
    try {
      const auditoria = await getAuditoriaById(this.prisma.mongodb, id);

      if (!auditoria) {
        throw new Error(`No se encontró la auditoría con ID ${id}`);
      }
      return auditoria;
    } catch (error) {
      console.error('Error al obtener la auditoría', error);
      this.logger.error(error);
      throw new Error('Error al obtener la auditoría');
    }
  }

  async getAuditorias(
    limit?: number,
    skip?: number,
    where?: AuditoriaWhereInput,
  ): Promise<AuditoriaResultadoBusqueda | null> {
    try {
      const auditorias = await getAuditorias(this.prisma.mongodb, skip, limit, where);

      return auditorias;
    } catch (error) {
      console.error('Error al buscar auditorías', error);
      this.logger.error(error);
      throw new Error('Error al buscar auditorías');
    }
  }

  async createAuditoria(data: AuditoriaInput): Promise<string> {
    try {
      const nuevaAuditoria = await this.prisma.client.auditoria.create({
        data: {
          fecha: data.fecha ?? new Date(),
          accion: data.accion,
          usuarioId: data.usuarioId,
          usuarioNom: data.usuarioNom,
          model: data.modelo,  // Corrige 'modelo' a 'model' para coincidir con el modelo Prisma
          detalles: data.detalles ?? null, // Si no hay detalles, se pasa null
          registro_id: data.id ?? null, // Si no hay registro_id, se pasa null
        },
      });
  
      this.logger.debug('Auditoría creada:', nuevaAuditoria);
      return nuevaAuditoria.id; // Mejor devolver el ID de la auditoría creada
    } catch (error) {
      console.error('Error al crear la auditoría', error);
      this.logger.error(error);
      throw new Error(`Error al crear la auditoría: ${error.message || error}`); // Mensaje de error más detallado
    }
  }
  
  async updateAuditoria(data: AuditoriaInput, auditoriaId: string): Promise<string> {
    try {
      const auditoriaActualizada = await this.prisma.client.auditoria.update({
        where: { id: auditoriaId },
        data,
      });

      this.logger.debug('Auditoría actualizada:', auditoriaActualizada);
      return 'Auditoría actualizada exitosamente';
    } catch (error) {
      console.error('Error al actualizar la auditoría', error);
      this.logger.error(error);
      throw new Error('Error al actualizar la auditoría');
    }
  }
}
