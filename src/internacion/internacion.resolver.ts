import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { InternacionService } from './internacion.service';
import { CreateInternacionInput } from './create-internacion.input';
import { AltaInternacionInput } from './alta-internacion.input';
import { UpdateInternacionInput } from './update-internacion.input';
import { Cama } from './cama.entity';
import { Internacion } from './internacion.entity';
import { HistorialInternacion } from './historial-internacion.entity';


@Resolver()
export class InternacionResolver {
  constructor(private readonly internacionService: InternacionService) {}

  @Mutation(() => String)
  async internarPaciente(
    @Args('data') data: CreateInternacionInput,
  ) {
    const i = await this.internacionService.internarPaciente(data);
    return `Internación creada con ID ${i.id_internacion}`;
  }

  @Mutation(() => String)
  async darAltaInternacion(
    @Args('data') data: AltaInternacionInput,
  ) {
    const i = await this.internacionService.darAlta(data);
    return `Alta realizada correctamente. ID internación: ${i.id_internacion}`;
  }

  @Mutation(() => String)
  async updateInternacion(
    @Args('data') data: UpdateInternacionInput,
  ) {
    await this.internacionService.updateInternacion(data);
    return 'Internación actualizada.';
  }

  @Query(() => String)
  testInternacion() {
    return 'Internación OK';
  }

 @Query(() => [Internacion])
internacionesActivas() {
  return this.internacionService.activas();
}

  @Query(() => [HistorialInternacion])
  historialInternacionPaciente(
    @Args('pacienteId') pacienteId: string,
  ) {
    return this.internacionService.historialPorPaciente(pacienteId);
  }

  @Query(() => [Cama])
  camasDisponibles() {
    return this.internacionService.camasDisponibles();
  }
}
