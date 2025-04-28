import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auditoria, AuditoriaResultadoBusqueda } from './auditoria.dto';
import { AuditoriaService } from './auditoria.service';
import { AuditoriaInput, AuditoriaWhereInput } from './auditoria.input';

@Resolver(() => Auditoria)
export class AuditoriaResolver {
  constructor(private auditoriaService: AuditoriaService) {}

  @Query(() => Auditoria, { nullable: true })
  async getAuditoria(@Args('id') id: string): Promise<Auditoria | null> {
    return this.auditoriaService.getAuditoria(id);
  }

  @Query(() => AuditoriaResultadoBusqueda)
  async getAuditorias(
    @Args({ name: 'where', type: () => AuditoriaWhereInput, nullable: true })
    where?: AuditoriaWhereInput,
    @Args({ name: 'skip', type: () => Int, nullable: true }) skip?: number,
    @Args({ name: 'limit', type: () => Int, nullable: true }) limit?: number,
  ): Promise<AuditoriaResultadoBusqueda | null> {
    return this.auditoriaService.getAuditorias(skip, limit, where);
  }

  @Mutation(() => String)
  async createAuditoria(
    @Args({ name: 'data', type: () => AuditoriaInput }) data: AuditoriaInput,
  ): Promise<string> {
    return this.auditoriaService.createAuditoria(data);
  }

  @Mutation(() => String)
  async updateAuditoria(
    @Args({ name: 'data', type: () => AuditoriaInput }) data: AuditoriaInput,
    @Args({ name: 'auditoriaId', type: () => String }) auditoriaId: string,
  ): Promise<string> {
    return this.auditoriaService.updateAuditoria(data, auditoriaId);
  }
}
