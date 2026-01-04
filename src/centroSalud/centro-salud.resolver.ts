// centro-salud.resolver.ts

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CentroSalud, CentroSaludResultadoBusqueda } from './centro-salud.dto'; // Importa el nuevo DTO
import { CentroSaludInput, CentroSaludWhereInput } from './centro-salud.input';
import { CentroSaludService } from './centro-salud.service';

@Resolver(() => CentroSalud)
export class CentroSaludResolver {
  constructor(private readonly centroService: CentroSaludService) {}

  @Mutation(() => CentroSalud)
  async createCentro(@Args('data') data: CentroSaludInput) {
    return this.centroService.createCentro(data);
  }

  // Actualizado para devolver CentroSaludResultadoBusqueda
@Query(() => CentroSaludResultadoBusqueda)
async getCentros(
  @Args({ name: 'skip', type: () => Int, nullable: true }) skip?: number,
  @Args({ name: 'limit', type: () => Int, nullable: true }) limit?: number,
  @Args('where', { nullable: true }) where?: CentroSaludWhereInput
) {
  console.log('🔥 ENTRO A getCentros', { skip, limit, where });
  return this.centroService.getCentros(skip, limit, where);
}


  // Actualizado para devolver CentroSaludResultadoBusqueda
  @Query(() => CentroSaludResultadoBusqueda)
  async misCentros(
    @Args('usuarioId') usuarioId: string,
    @Args({ name: 'skip', type: () => Int, nullable: true }) skip?: number,
    @Args({ name: 'limit', type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.centroService.getCentrosPorUsuario(usuarioId, skip, limit);
  }

  @Mutation(() => String)
  async vincularUsuarioACentro(
    @Args('usuarioId') usuarioId: string,
    @Args('centroId') centroId: string,
    @Args('rol') rol: string,
  ) {
    await this.centroService.vincularUsuario(usuarioId, centroId, rol);
    return 'Vínculo creado con éxito';
  }
}