import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Usuario, UsuarioResultadoBusqueda } from './usuario.dto';
import { UsuarioInput, UsuarioWhereInput } from './usuario.input';
import { UsuarioService } from './usuario.service';

@Resolver(() => Usuario)
export class UsuarioResolver {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Query(() => Usuario, { nullable: true })
  getUsuario(@Args('email') email: string): Promise<Usuario | null> {
    return this.usuarioService.getUsuario(email);
  }

  @Query(() => UsuarioResultadoBusqueda)
  getUsuarios(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('where', { type: () => UsuarioWhereInput, nullable: true }) where?: UsuarioWhereInput,
  ): Promise<UsuarioResultadoBusqueda> {
    return this.usuarioService.getUsuarios(skip, limit, where);
  }

  @Query(() => Usuario, { nullable: true })
  getUsuarioById(@Args('id') id: string): Promise<Usuario | null> {
    return this.usuarioService.getUsuarioById(id);
  }

  @Mutation(() => String)
  createUsuario(
    @Args('data', { type: () => UsuarioInput }) data: UsuarioInput,
  ): Promise<string> {
    return this.usuarioService.createUsuario(data);
  }

  @Mutation(() => String)
  updateUsuario(
    @Args('data', { type: () => UsuarioInput }) data: UsuarioInput,
    @Args('usuarioId') usuarioId: string,
  ): Promise<string> {
    return this.usuarioService.updateUsuario(data, usuarioId);
  }

  @Mutation(() => String)
  deleteUsuario(@Args('id') id: string): Promise<string> {
    return this.usuarioService.deleteUsuario(id);
  }

  @Mutation(() => String)
  solicitarRecuperacionPassword(
    @Args('email') email: string,
  ): Promise<string> {
    return this.usuarioService.solicitarRecuperacionPassword(email);
  }

  @Mutation(() => String)
  resetearPassword(
    @Args('token') token: string,
    @Args('nuevaPassword') nuevaPassword: string,
  ): Promise<string> {
    return this.usuarioService.resetearPassword(token, nuevaPassword);
  }
}
