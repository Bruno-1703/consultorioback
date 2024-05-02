import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Paciente, PacientesResultadoBusqueda } from './paciente.dto';
import { PacienteInput, PacienteWhereInput } from './paciente.input';
import { PacienteService } from './paciente.service';
import { EnfermedadInput } from '../enfermedad/enfermedad.input';
import { CitaInput } from '../citas/cita.input';

@Resolver(() => Paciente)
export class PacienteResolver {
  constructor(private pacienteService: PacienteService) {}

  @Query(() => Paciente, { nullable: true })
  async getPaciente(@Args('id') id: string): Promise<Paciente | null> {
    return this.pacienteService.getPaciente(id);
  }
  @Query(() => PacientesResultadoBusqueda)
  async getPacientes(
    @Args({ name: 'where', type: () => PacienteWhereInput, nullable: true })
    where?: PacienteWhereInput,
    @Args({ name: 'skip', type: () => Int, nullable: true }) skip?: number,
    @Args({ name: 'limit', type: () => Int, nullable: true }) limit?: number,
  ): Promise<PacientesResultadoBusqueda | null> {
    return this.pacienteService.getPacientes(where, skip, limit);
  }
  @Mutation(() => String)
  async createPaciente(
    @Args({ name: 'data', type: () => PacienteInput }) data: PacienteInput,
  ): Promise<string> {
    return this.pacienteService.createPaciente(data);
  }


  @Mutation(() => String)
  async createPacienteCitas(
    @Args('paciente') paciente: PacienteInput,
    @Args('citas', { type: () => [CitaInput] }) citas: CitaInput[],
  ): Promise<string> {
    return this.pacienteService.createPacienteCitas(paciente, citas);
  }
  @Mutation(() => String)
  async updatePaciente(
    @Args({ name: 'data', type: () => PacienteInput }) data: PacienteInput,
    @Args({ name: 'pacienteId', type: () => String }) pacienteId: string,
  ): Promise<string> {
    return this.pacienteService.updatePaciente(data, pacienteId);
  }
  @Query(() => [Paciente])
  async buscarPacientesPorNombreODNI(
    @Args({ name: 'nombre', type: () => String }) nombre: string,
    @Args({ name: 'dni', type: () => String }) dni: string,
  ): Promise<Paciente[]> {
    return this.pacienteService.buscarPacientesPorNombreO_DNI(nombre, dni);
  }
}
