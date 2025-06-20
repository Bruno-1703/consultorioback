import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { query } from 'express';
import { Medicamento, MedicamentoResultadoBusqueda } from './medicamento.dto';
import { MedicamentoInput, MedicamentoWhereInput } from './medicamento.input';
import { MedicamentosService } from './medicamento.service';

@Resolver(() => Medicamento)
export class MedicamentoResolver {
  constructor(private medicamentoService: MedicamentosService) {}

  @Query(() => Medicamento, { nullable: true })
  async getMedicamento(@Args('id') id: string): Promise<Medicamento | null> {
    return this.medicamentoService.getMedicamento(id);
  }

  @Query(() => MedicamentoResultadoBusqueda)
  async getMedicamentos(
    @Args({ name: 'skip', type: () => Int, nullable: true }) skip?: number,
    @Args({ name: 'limit', type: () => Int, nullable: true }) limit?: number,
    @Args({ name: 'where', type: () => MedicamentoWhereInput, nullable: true })
    where?: MedicamentoWhereInput,
 
  ): Promise<MedicamentoResultadoBusqueda> {
    return this.medicamentoService.getMedicamentos( skip, limit,where);
  }

  @Mutation(() => String)
  async createMedicamento(
    @Args({ name: 'data', type: () => MedicamentoInput })
    data: MedicamentoInput,
  ): Promise<string> {
    return this.medicamentoService.createMedicamento(data);
  }

  @Mutation(() => String)
  async updateMedicamento(
    @Args({ name: 'data', type: () => MedicamentoInput })
    data: MedicamentoInput,
    @Args({ name: 'medicamentoId', type: () => String }) medicamentoId: string,
  ): Promise<string> {
    return this.medicamentoService.updateMedicamento(data, medicamentoId);
  }
  @Mutation(() => String)
  async deleteMedicamentoLog(
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<string> {
    return this.medicamentoService.deleteMedicamentoLog(id);
  }

  // Mutación para la eliminación definitiva
  @Mutation(() => String)
  async deleteMedicamento(
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<string> {
    return this.medicamentoService.deleteMedicamento(id);
  }
  @Query(() => Number)
  async getStock(
    @Args('medicamentoId', { type: () => String }) medicamentoId: string,
  ): Promise<number> {
    return this.medicamentoService.getStock(medicamentoId);
  }

  @Mutation(() => String)
  async aumentarStock(
    @Args('medicamentoId', { type: () => String }) medicamentoId: string,
    @Args('cantidad', { type: () => Int }) cantidad: number,
  ): Promise<string> {
    return this.medicamentoService.aumentarStock(medicamentoId, cantidad);
  }

  @Mutation(() => String)
  async reducirStock(
    @Args('medicamentoId', { type: () => String }) medicamentoId: string,
    @Args('cantidad', { type: () => Int }) cantidad: number,
  ): Promise<string> {
    return this.medicamentoService.reducirStock(medicamentoId, cantidad);
  }
  
}
