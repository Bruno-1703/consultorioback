import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Estudio, EstudioResultadoBusqueda } from './estudio.dto';
import { EstudioService } from './estudio.service';
import { EstudioInput, EstudioWhereInput } from './estudio.input';

@Resolver(() => Estudio)
export class EstudioResolver {
  constructor(private estudioService: EstudioService) {}

  @Query(() => Estudio, { nullable: true })
  async getEstudio(@Args('id') id: string): Promise<Estudio | null> {
    return this.estudioService.getEstudio(id);
  }

  @Query(() => EstudioResultadoBusqueda)
  async getEstudios(
    @Args({ name: 'where', type: () => EstudioWhereInput, nullable: true })
    where?: EstudioWhereInput,
    @Args({ name: 'skip', type: () => Int, nullable: true }) skip?: number,
    @Args({ name: 'limit', type: () => Int, nullable: true }) limit?: number,
  ): Promise<EstudioResultadoBusqueda | null> {
    return this.estudioService.getEstudios(where, skip, limit);
  }

  @Mutation(() => String)
  async createEstudio(
    @Args({ name: 'data', type: () => EstudioInput }) data: EstudioInput,
  ): Promise<string> {
    return this.estudioService.createEstudio(data);
  }

  @Mutation(() => String)
  async updateEstudio(
    @Args({ name: 'data', type: () => EstudioInput }) data: EstudioInput,
    @Args({ name: 'estudioId', type: () => String }) estudioId: string,
  ): Promise<string> {
    return this.estudioService.updateEstudio(data, estudioId);
  }
}
