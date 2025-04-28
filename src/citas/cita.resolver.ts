import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cita, CitaResultadoBusqueda } from './cita.dto';
import { CitaInput, CitaWhereInput } from './cita.input';
import { CitaService } from './cita.service';
import { EnfermedadInput } from 'src/enfermedad/enfermedad.input';
import { MedicamentoInput } from 'src/medicamentos/medicamento.input';
import { PacienteCitaInput } from 'src/paciente/paciente.input';
import { EstudioInput } from 'src/estudios/estudio.input';

@Resolver(() => Cita)
export class CitaResolver {
  constructor(private citaService: CitaService) {}
  @Query(() => Cita, { nullable: true })
  async getCita(@Args('id') id: string): Promise<Cita | null> {
    return this.citaService.getCita(id);
  }

  @Query(() => CitaResultadoBusqueda)
  async getCitas(
    
    //@Usuario() usuario: any,
    @Args({ name: 'skip', type: () => Int, nullable: true }) skip?: number,
    @Args({ name: 'limit', type: () => Int, nullable: true }) limit?: number,
    @Args({ name: 'where', type: () => CitaWhereInput, nullable: true })
    where?: CitaWhereInput
  ): Promise<CitaResultadoBusqueda> {
    return this.citaService.getCitas( skip,limit,where);
  }

  @Mutation(() => String)
  async createCita(
   //@Usuario() usuario: any,
    @Args({ name: 'data', type: () => CitaInput }) data: CitaInput,
    @Args('paciente', { type: () => PacienteCitaInput })
    paciente: PacienteCitaInput,
  ): Promise<string> {
    return this.citaService.createCita(data,paciente);
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
  @Mutation(() => String)
  async createCitaEstudio(
    @Args('citaId') citaId: string,
    @Args('estudios', { type: () => [EstudioInput] })
    estudios: EstudioInput[],
  ): Promise<string> {
    return this.citaService.createCitaEstudios(citaId, estudios,);

  }  
  @Mutation(() => String)
async cancelarCita(
  @Args('id', { type: () => String }) id: string,
): Promise<string> {
  return this.citaService.cancelarCita(id);
}


}
