import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  Enfermedad,
  EnfermedadResultadoBusqueda,
} from './enfermedad.dto';
import {
  ActualizarEnfermedadInput,
  EnfermedadInput,
  EnfermedadWhereInput,
} from './enfermedad.input';
import { EnfermedadService } from './enfermedad.service';

@Resolver(() => Enfermedad)
export class EnfermedadResolver {
  constructor(private readonly enfermedadService: EnfermedadService) {}

  // 🔍 Obtener por ID
  @Query(() => Enfermedad, { nullable: true })
  getEnfermedadById(@Args('id') id: string) {
    return this.enfermedadService.getEnfermedadById(id);
  }

  // 📄 Listado con paginación
  @Query(() => EnfermedadResultadoBusqueda)
  getEnfermedades(
    @Args('where', { nullable: true }) where?: EnfermedadWhereInput,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.enfermedadService.getEnfermedades(where, skip, limit);
  }

  // ➕ Crear
  @Mutation(() => String)
  createEnfermedad(
    @Args('data') data: EnfermedadInput,
  ): Promise<string> {
    return this.enfermedadService.createEnfermedad(data);
  }

  // ✏️ Actualizar
  @Mutation(() => String)
  updateEnfermedad(
    @Args('data') data: ActualizarEnfermedadInput,
  ): Promise<string> {
    return this.enfermedadService.updateEnfermedad(data);
  }

  // 🗑️ Soft delete
  @Mutation(() => String)
  deleteEnfermedad(@Args('id') id: string): Promise<string> {
    return this.enfermedadService.deleteEnfermedad(id);
  }
}
