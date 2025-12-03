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
      const auditoria = await this.prisma.client.auditoria.findUnique({
        where: { id },
      });
      if (!auditoria) {
        throw new Error(`No se encontró la auditoría con ID ${id}`);
      }
      // Mapear 'createdAt' como 'fecha' para cumplir con el DTO
      return {
        ...auditoria,
        fecha: auditoria?.createdAt,
      } as Auditoria;
    } catch (error) {
      this.logger.error('Error al obtener la auditoría', error);
      throw new Error('Error al obtener la auditoría');
    }
  }

  async getAuditorias(
    limit?: number,
    skip?: number,
    where?: AuditoriaWhereInput,
  ): Promise<AuditoriaResultadoBusqueda | null> {
    try {
      // Solo usar los campos válidos para Prisma
      const prismaWhere: any = {};
      if (where?.id) prismaWhere.id = where.id;
      if (where?.accion) prismaWhere.accion = where.accion;
      if (where?.usuarioId) prismaWhere.usuarioId = where.usuarioId;
      if (where?.detalles) prismaWhere.detalles = where.detalles;
      if (where?.modelo) prismaWhere.model = where.modelo;
      // No existe 'fecha' en el modelo Prisma

      const auditorias = await this.prisma.client.auditoria.findMany({
        where: prismaWhere,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      });
      const total = await this.prisma.client.auditoria.count({ where: prismaWhere });
      return {
        edges: auditorias.map(auditoria => ({
          node: {
            ...auditoria,
            fecha: auditoria.createdAt,
            accion: auditoria.accion as any,
          },
          cursor: auditoria.id,
        })),
        aggregate: { count: total },
      };
    } catch (error) {
      this.logger.error('Error al buscar auditorías', error);
      throw new Error('Error al buscar auditorías');
    }
  }

  async createAuditoria(data: AuditoriaInput): Promise<string> {
    try {
      // Solo usar los campos válidos para Prisma
      const auditoriaData: any = {
        accion: data.accion,
        usuarioId: data.usuarioId,
        usuarioNom: data.usuarioNom,
        model: data.modelo,
        detalles: data.detalles ?? null,
        registro_id: data.id ?? null,
      };
      const nuevaAuditoria = await this.prisma.client.auditoria.create({
        data: auditoriaData,
      });
      this.logger.debug('Auditoría creada:', nuevaAuditoria);
      return nuevaAuditoria.id;
    } catch (error) {
      this.logger.error('Error al crear la auditoría', error);
      throw new Error(`Error al crear la auditoría: ${error.message || error}`);
    }
  }
  
  async updateAuditoria(data: AuditoriaInput, auditoriaId: string): Promise<string> {
    try {
      // Solo usar los campos válidos para Prisma
      const auditoriaData: any = {
        accion: data.accion,
        usuarioId: data.usuarioId,
        usuarioNom: data.usuarioNom,
        model: data.modelo,
        detalles: data.detalles ?? null,
        registro_id: data.id ?? null,
      };
      const auditoriaActualizada = await this.prisma.client.auditoria.update({
        where: { id: auditoriaId },
        data: auditoriaData,
      });
      this.logger.debug('Auditoría actualizada:', auditoriaActualizada);
      return 'Auditoría actualizada exitosamente';
    } catch (error) {
      this.logger.error('Error al actualizar la auditoría', error);
      throw new Error('Error al actualizar la auditoría');
    }
  }
}
