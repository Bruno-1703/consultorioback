import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cita, CitaResultadoBusqueda } from './cita.dto';
import { CitaInput, CitaWhereInput } from './cita.input';
import { CitaService } from './cita.service';
import { EnfermedadInput } from 'src/enfermedad/enfermedad.input';
import { MedicamentoInput } from 'src/medicamentos/medicamento.input';

@Resolver(() => Cita)
export class CitaResolver {
  constructor(private citaService: CitaService) {}
  @Query(() => Cita, { nullable: true })
  async getCita(@Args('id') id: string): Promise<Cita | null> {
    return this.citaService.getCita(id);
  }

  @Query(() => CitaResultadoBusqueda)
  async getCitas(
    @Args({ name: 'where', type: () => CitaWhereInput, nullable: true })
    where?: CitaWhereInput,
    @Args({ name: 'skip', type: () => Int, nullable: true }) skip?: number,
    @Args({ name: 'limit', type: () => Int, nullable: true }) limit?: number,
  ): Promise<CitaResultadoBusqueda> {
    return this.citaService.getCitas(where, skip, limit);
  }

  @Mutation(() => String)
  async createCita(
    @Args({ name: 'data', type: () => CitaInput }) data: CitaInput,
  ): Promise<string> {
    return this.citaService.createCita(data);
  }

  @Mutation(() => String)
  async updateCita(
    @Args({ name: 'data', type: () => CitaInput }) data: CitaInput,
    @Args({ name: 'citaId', type: () => String }) citaId: string,
  ): Promise<string> {
    return this.citaService.updateCita(data, citaId);
  }
  @Mutation(() => String)
  async createCitaEnfermedad(
    @Args('citaId') citaId: string,
    @Args('enfermedades', { type: () => [EnfermedadInput] })
    enfermedades: EnfermedadInput[],
  ): Promise<string> {
    return this.citaService.createCitaEnfermedad(citaId, enfermedades,);
  }
  @Mutation(() => String)
  async createCitaMedicamento(
    @Args('citaId') citaId: string,
    @Args('medicamentos', { type: () => [MedicamentoInput] })
    medicamentos: MedicamentoInput[],
  ): Promise<string> {
    return this.citaService.createCitaMedicametos(citaId, medicamentos,);
  }
}
