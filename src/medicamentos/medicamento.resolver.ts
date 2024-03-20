import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { query } from "express";
import { Medicamento, MedicamentoResultadoBusqueda } from "./medicamento.dto";
import { MedicamentoInput, MedicamentoWhereInput } from "./medicamento.input";
import { MedicamentosService } from "./medicamento.service";

@Resolver(() => Medicamento)
export class MedicamentoResolver {
  constructor(private medicamentoService: MedicamentosService) {}

  @Query(() => Medicamento,{nullable:true})
  async getMedicamento(
    @Args("id") id: string): Promise<Medicamento | null> {
    return this.medicamentoService.getMedicamento(id);
  }

  @Query(() => MedicamentoResultadoBusqueda)
  async getMedicamentos(
    @Args({ name: "where", type: () => MedicamentoWhereInput, nullable: true })
    where?: MedicamentoWhereInput,
    @Args({ name: "skip", type: () => Int, nullable: true }) skip?: number,
    @Args({ name: "limit", type: () => Int, nullable: true }) limit?: number
  ): Promise<MedicamentoResultadoBusqueda> {
    return this.medicamentoService.getMedicamentos(where, skip, limit);
  }

  @Mutation(() => String)
  async createMedicamento(
    @Args({ name: "data", type: () => MedicamentoInput}) data: MedicamentoInput,
  ): Promise<string> {
    return this.medicamentoService.createMedicamento(data);
  }

  @Mutation(() => String)
  async updateMedicamento(
    @Args({ name: "data", type: () => MedicamentoInput}) data: MedicamentoInput,
    @Args({ name: "medicamentoId", type: () => String}) medicamentoId: string,
  ): Promise<string> {
    return this.medicamentoService.updateMedicamento(data, medicamentoId);
  }
}
