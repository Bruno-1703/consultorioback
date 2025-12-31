import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Paciente, PacientesResultadoBusqueda } from './paciente.dto';
import { PacienteInput, PacienteWhereInput } from './paciente.input';
import { PacienteService } from './paciente.service';
import { CurrentUser } from 'src/auth/current-user.decorator';


@Resolver(() => Paciente)
export class PacienteResolver {
  constructor(private pacienteService: PacienteService) { }

  @Query(() => Paciente, { nullable: true })
  async getPaciente(@Args('id') id: string): Promise<Paciente | null> {
    return this.pacienteService.getPaciente(id);
  }
@Query(() => PacientesResultadoBusqueda)
async getPacientes(
  @CurrentUser() user: any,
  @Args({ name: 'skip', type: () => Int, nullable: true }) skip?: number,
  @Args({ name: 'limit', type: () => Int, nullable: true }) limit?: number,
  @Args({ name: 'where', type: () => PacienteWhereInput, nullable: true })
  where?: PacienteWhereInput,
) {
  return this.pacienteService.getPacientes(
    // user.centroSaludId, // 🔐
    skip,
    limit,
    where,
  );
}

 @Mutation(() => String)
  async createPaciente(
    @CurrentUser() user: any,
    @Args({ name: 'data', type: () => PacienteInput }) data: PacienteInput,
  ) {
    return this.pacienteService.createPaciente(
      data,
      user.centroSaludId,
    );
  }
  @Mutation(() => String)
  async updatePaciente(
    @Args({ name: 'data', type: () => PacienteInput }) data: PacienteInput,
    @Args({ name: 'pacienteId', type: () => String }) pacienteId: string,
  ): Promise<string> {
    return this.pacienteService.updatePaciente(data, pacienteId);
  }

  @Mutation(() => String)
  async ElimiarPacienteLog(
    @Args({ name: 'pacienteId', type: () => String }) pacienteId: string,
  ): Promise<string> {
    return this.pacienteService.ElimiarPacienteLog(pacienteId);
  }

  @Mutation(() => String)
  async EliminarPaciente(
    @Args({ name: 'pacienteId', type: () => String }) pacienteId: string,
  ): Promise<string> {
    return this.pacienteService.EliminarPaciente(pacienteId);
  }
@Query(() => Paciente, { nullable: true })
async getPacientePorDNI(
  @CurrentUser() user: any,
  @Args('dni') dni: string,
): Promise<Paciente | null> {
  return this.pacienteService.getPacientePorDNI(
    dni,
    user.centroSaludId,
  );
}
}
