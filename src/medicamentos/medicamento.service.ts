import { Injectable, Logger } from '@nestjs/common';
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
    where?: MedicamentoWhereInput | undefined,
    skip?: number,
    limit?: number,
  ): Promise<MedicamentoResultadoBusqueda | null> {
    try {
      const medicamentos = await getMedicamentos(this.prisma.mongodb, skip, limit, where
      );
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
        data,
      });

      this.logger.debug('Medicamento creado:', medicamento);
      return 'Medicamento creado exitosamente';
    } catch (error) {
      console.error('Error al crear medicamento', error);
      this.logger.error(error);
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
}
