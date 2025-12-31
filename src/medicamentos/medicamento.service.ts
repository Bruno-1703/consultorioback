import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Medicamento, MedicamentoResultadoBusqueda } from './medicamento.dto';
import { MedicamentoInput, MedicamentoWhereInput } from './medicamento.input';
import { PrismaService } from '../prisma/prisma.service';
import { getMedicamentos } from 'src/mongo/medicamentos/getMedicamentos';
import { getMedicamentoById } from 'src/mongo/medicamentos/getMedicamentoById';

@Injectable()
export class MedicamentosService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(MedicamentosService.name);

  async getMedicamento(id: string): Promise<Medicamento | null> {
    try {
      this.logger.debug(`Recuperando medicamento con ID ${id}`);

      const medicamento = await getMedicamentoById(
        this.prisma.mongodb, id
      );
      if (!medicamento) {
        throw new Error(`No se encontró el medicamento con ID ${id}`);
      }

      this.logger.debug('Medicamento encontrado:', medicamento);
      return medicamento;
    } catch (error) {
      console.error(`Error al recuperar medicamento con ID ${id}`, error);
      this.logger.error(error);
      throw new Error('Error al recuperar medicamento');
    }
  }
  async getMedicamentos(
    limit: number,
    skip: number,
    where?: MedicamentoWhereInput,

  ): Promise<MedicamentoResultadoBusqueda | null> {
    try {
      const medicamentos = await getMedicamentos(this.prisma.mongodb, skip,limit, where
      );
      console.log('Resultado de getMedicamentos:', medicamentos);

      return medicamentos;
    } catch (error) {
      console.error('Error al buscar medicamentos', error);
      this.logger.error(error);
      throw new Error('Error al buscar medicamentos');
    }
  }
  async createMedicamento(data: MedicamentoInput): Promise<string> {
    try {
      this.logger.debug('Creando medicamento');
      const medicamento = await this.prisma.client.medicamento.create({
        data: {
          centroSalud: { connect: { id: "" } },
          id_medicamento: data.id_medicamento,
          nombre_med: data.nombre_med,
          marca: data.marca,
          fecha_vencimiento: data.fecha_vencimiento,
          dosis_hs: data.dosis_hs,
          agente_principal: data.agente_principal,
          efectos_secundarios: data.efectos_secundarios,
          lista_negra: data.lista_negra,
          categoria: data.categoria,
          contraindicaciones: data.contraindicaciones,
          prescripcion_requerida: data.prescripcion_requerida,
          stock: data.stock,
          eliminadoLog: false
        },
      });
      return 'Medicamento creado correctamente';
    } catch (error) {
      this.logger.error('Error al crear medicamento', error);  // Asegúrate de loguear el error
      throw new Error('Error al crear medicamento');
    }
  }
  
  async updateMedicamento(
    data: MedicamentoInput,
    medicamentoId: string,
  ): Promise<string> {
    try {
      this.logger.debug(`Actualizando medicamento con ID ${medicamentoId}`);
      // Asegúrate de tener una entidad Medicamento definida en tu Prisma client
      const medicamento = await this.prisma.client.medicamento.update({
        where: {
          id_medicamento: medicamentoId,
        },
        data,
      });

      this.logger.debug('Medicamento actualizado:', medicamento);
      return 'Medicamento actualizado exitosamente';
    } catch (error) {
      console.error(
        `Error al actualizar medicamento con ID ${medicamentoId}`,
        error,
      );
      this.logger.error(error);
      throw new Error('Error al actualizar medicamento');
    }
  }
  async deleteMedicamentoLog(id: string) {
    await this.prisma.client.medicamento.update({
      where: { id_medicamento:id },
       data: { eliminadoLog: true }, //Cambiar el campo "eliminado" a true
    });
    return `Medicamento con ID ${id} eliminado lógicamente.`;
  }

  // Eliminación definitiva: Borrar el medicamento de la base de datos
  async deleteMedicamento(id: string) {
    await this.prisma.client.medicamento.delete({
      where: { id_medicamento:id },
    });
    return `Medicamento con ID ${id} eliminado definitivamente.`;
  }
  async getStock(medicamentoId: string): Promise<number> {
     const medicamento = await this.prisma.client.medicamento.findUnique({
     where: { id_medicamento: medicamentoId },
       select: { stock: true },
     });

    if (!medicamento) {
       throw new NotFoundException('Medicamento no encontrado');
     }

     return medicamento.stock;
  }

  async aumentarStock(medicamentoId: string, cantidad: number): Promise<string> {
    if (cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser positiva');
    }

    await this.prisma.client.medicamento.update({
      where: { id_medicamento: medicamentoId },
      data: {
        stock: {
          increment: cantidad,
        },
      },
    });

    return `Stock aumentado en ${cantidad} unidades`;
  }

  async reducirStock(medicamentoId: string, cantidad: number): Promise<string> {
    const medicamento = await this.prisma.client.medicamento.findUnique({
      where: { id_medicamento: medicamentoId },
      select: { stock: true },
    });

    if (!medicamento) {
      throw new NotFoundException('Medicamento no encontrado');
    }

    if (cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser positiva');
    }

    if (medicamento.stock < cantidad) {
      throw new BadRequestException('Stock insuficiente');
    }

    await this.prisma.client.medicamento.update({
      where: { id_medicamento: medicamentoId },
      data: {
        stock: {
          decrement: cantidad,
        },
      },
    });

   return `Stock reducido en ${cantidad} unidades`;
   }
}
