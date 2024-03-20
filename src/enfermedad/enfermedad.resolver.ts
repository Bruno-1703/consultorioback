import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Enfermedad, EnfermedadResultadoBusqueda } from "./enfermedad.dto";
import { EnfermedadInput, EnfermedadWhereInput } from "./enfermedad.input";
import { EnfermedadService } from "./enfermedad.service";

@Resolver(() => Enfermedad)
export class EnfermedadResolver {
  constructor(private enfermedadService: EnfermedadService) {}
  @Query(() => Enfermedad, { nullable: true })
  async getEnfermedad(@Args('id') id: string): Promise<Enfermedad | null> {
    return this.enfermedadService.getEnfermedadById(id);
  }

  @Query(() => EnfermedadResultadoBusqueda)
  async getCitas(
    @Args({ name: 'where', type: () => EnfermedadWhereInput, nullable: true }) where?: EnfermedadWhereInput,
    @Args({ name: 'skip', type: () => Int, nullable: true }) skip?: number,
    @Args({ name: 'limit', type: () => Int, nullable: true }) limit?: number
  ): Promise<EnfermedadResultadoBusqueda> {
    return this.enfermedadService.getEnfermedad(where, skip, limit);
  }

  @Mutation(() => String)
  async createEnfermedad(@Args({ name: 'data', type: () => EnfermedadInput }) data: EnfermedadInput): Promise<string> {
    return this.enfermedadService.createEnfermedad(data);
  }

  @Mutation(() => String)
  async updateEnfermedad(
    @Args({ name: 'data', type: () => EnfermedadInput }) data: EnfermedadInput,
    @Args({ name: 'citaId', type: () => String }) enfermedadId: string
  ): Promise<string> {
    return this.enfermedadService.updateEnfermedad(data, enfermedadId);
  }
}
