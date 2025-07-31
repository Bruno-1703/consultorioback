import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Usuario, UsuarioResultadoBusqueda } from './usuario.dto';
import { UsuarioInput, UsuarioWhereInput } from './usuario.input';
import { UsuarioService } from './usuario.service';

@Resolver(() => Usuario)
export class UsuarioResolver {
  constructor(private usuarioService: UsuarioService) { }

  @Query(() => Usuario, { nullable: true })
  async getUsuario(@Args('email') email: string): Promise<Usuario | null> {
    return this.usuarioService.getUsuario(email);
  }
  @Query(() => UsuarioResultadoBusqueda)
  async getUsuarios(
    @Args({ name: 'skip', type: () => Int, nullable: true }) skip?: number,
    @Args({ name: 'limit', type: () => Int, nullable: true }) limit?: number,
    @Args({ name: 'where', type: () => UsuarioWhereInput, nullable: true }) where?: UsuarioWhereInput,

  ): Promise<UsuarioResultadoBusqueda> {
    return this.usuarioService.getUsuarios(skip, limit, where);
  }

  @Mutation(() => String)
  async createUsuario(
    @Args({ name: 'data', type: () => UsuarioInput }) data: UsuarioInput,
  ): Promise<string> {
    return this.usuarioService.createUsuario(data);
  }

  @Mutation(() => String)
  async updateUsuario(
    @Args({ name: 'data', type: () => UsuarioInput }) data: UsuarioInput,
    @Args({ name: 'usuarioId', type: () => String }) usuarioId: string,
  ): Promise<string> {
    return this.usuarioService.updateUsuario(data, usuarioId);
  }

  @Mutation(() => String)
  async deleteUsuario(@Args('id') id: string):
    Promise<string> {
    return this.usuarioService.deleteUsuario(id);
  }
@Mutation(() => String)
async solicitarRecuperacionPassword(
  @Args('email') email: string
): Promise<string> {
  return this.usuarioService.solicitarRecuperacionPassword(email);
}
@Mutation(() => String)
async resetearPassword(
  @Args('token') token: string,
  @Args('nuevaPassword') nuevaPassword: string
): Promise<string> {
  return this.usuarioService.resetearPassword(token, nuevaPassword);
}
@Query(() => Usuario, { nullable: true })
async getUsuarioById(@Args('id') id: string): Promise<Usuario | null> {
  return this.usuarioService.getUsuarioById(id);
}

}
