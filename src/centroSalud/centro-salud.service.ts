import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CentroSaludInput, CentroSaludWhereInput } from './centro-salud.input';
import { CentroSaludResultadoBusqueda } from './centro-salud.dto';
import { getCentros } from 'src/mongo/centroSalud/getCentros';

@Injectable()
export class CentroSaludService {
  private readonly logger = new Logger(CentroSaludService.name);

  constructor(private prisma: PrismaService) { }

  /**
   * Crea un nuevo centro de salud limpiando los datos para evitar errores de Prisma
   */
  async createCentro(data: CentroSaludInput) {
    this.logger.log(`Intentando crear centro: ${data.nombre}`);
    // 1. Limpieza de datos: Solo extraemos lo que Prisma conoce según tu schema
    try {
      const nuevoCentro = await this.prisma.client.centroSalud.create({
        data: {
          nombre: data.nombre,
          direccion: data.direccion,
          tipo: data.tipo,
        },
      });

      this.logger.log(`Centro creado exitosamente con ID: ${nuevoCentro.id}`);
      return nuevoCentro;
    } catch (error) {
      this.logger.error(`Error al crear centro: ${error.message}`, error.stack);

      if (error.code === 'P2002') {
        throw new BadRequestException('Ya existe un centro con ese nombre.');
      }

      if (error instanceof SyntaxError) {
        throw new BadRequestException('El campo configuracion no es un JSON válido.');
      }

      throw new InternalServerErrorException('Error al procesar la creación del centro.');
    }
  }
  async getCentros(
    skip: number,
    limit: number,
    where?: CentroSaludWhereInput
  ): Promise<CentroSaludResultadoBusqueda> {
    try {
      return await getCentros(this.prisma.mongodb, skip, limit, where);
    } catch (error) {
      this.logger.error('Error al buscar centros de salud', error);
      throw new Error('Error al buscar centros de salud');
    }
  }

  /**
   * Vincula un usuario (ej. Gisela o Ana) a un centro
   */
  async vincularUsuario(usuarioId: string, centroId: string, rol: string) {
    try {
      // Verificamos si ya existe la vinculación para evitar duplicados
      const existe = await this.prisma.client.usuarioCentro.findFirst({
        where: { usuarioId, centroSaludId: centroId }
      });

      if (existe) throw new BadRequestException('El usuario ya está vinculado a este centro.');

      return await this.prisma.client.usuarioCentro.create({
        data: {
          usuarioId,
          centroSaludId: centroId,
          rol,
        },
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Error al vincular usuario al centro.');
    }
  }

  /**
   * Obtiene los centros vinculados a un usuario específico
   */
  async getCentrosPorUsuario(
    usuarioId: string,
    skip: number = 0,
    limit: number = 10
  ): Promise<CentroSaludResultadoBusqueda> {
    try {
      const [vinculaciones, total] = await Promise.all([
        this.prisma.client.usuarioCentro.findMany({
          where: { usuarioId },
          include: { centroSalud: true },
          skip,
          take: limit,
        }),
        this.prisma.client.usuarioCentro.count({ where: { usuarioId } }),
      ]);

      return {
        edges: vinculaciones.map((v) => ({
          node: this.formatCentroOutput(v.centroSalud),
          cursor: v.id,
        })),
        aggregate: { count: total },
      };
    } catch (error) {
      this.logger.error('Error en getCentrosPorUsuario', error);
      throw new InternalServerErrorException('No se pudieron recuperar los centros del usuario.');
    }
  }

  /**
   * Helper para estandarizar la salida del objeto CentroSalud
   */
  private formatCentroOutput(centro: any) {
    return {
      ...centro,
      configuracion: centro.configuracion ? JSON.stringify(centro.configuracion) : null,
      direccion: centro.direccion || null,
    };
  }
}