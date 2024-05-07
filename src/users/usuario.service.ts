import { Injectable, Logger } from '@nestjs/common';
import { UsuarioInput } from './usuario.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Usuario } from './usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(UsuarioService.name);

  async getUsuario(email: string): Promise<Usuario | null> {
    try {
      const usuario = await this.prisma.client.usuario.findFirst({
        where: { email: email },
      });
      return usuario || null;
    } catch (error) {
      console.error('Error al obtener el usuario', error);
      throw new Error('Error al obtener el usuario');
    }
  }

  // async getUsuarios(where?, skip?, limit?): Promise<{ usuarios: Usuario[]; count: number }> {
  //   try {
  //     const filteredUsuarios = await this.prisma.client.usuario.findMany({
  //       where,
  //       skip,
  //       take: limit,
  //     });

  //     const totalUsuarios = await this.prisma.client.usuario.count({ where });

  //     return { usuarios: filteredUsuarios, count: totalUsuarios };
  //   } catch (error) {
  //     console.error('Error al buscar usuarios', error);
  //     throw new Error('Error al buscar usuarios');
  //   }
  // }

  async createUsuario(data: UsuarioInput): Promise<string> {
    try {
      await this.prisma.client.usuario.create({
        data: {
          nombre_usuario: data.nombre_usuario,
          email: data.email,
          password: data.password,
          rol_usuario:'user'

          
        },
      });
      return 'Usuario creado exitosamente';
    } catch (error) {
      console.error('Error al crear usuario', error);
      throw new Error('Error al crear usuario');
    }
  }

  async updateUsuario(data: UsuarioInput, usuarioId: string): Promise<string> {
    try {
      await this.prisma.client.usuario.update({
        where: { id_Usuario: usuarioId },
        data,
      });

      return 'Usuario actualizado exitosamente';
    } catch (error) {
      console.error('Error al actualizar el usuario', error);
      throw new Error('Error al actualizar el usuario');
    }
  }

  async deleteUsuario(id: string): Promise<string> {
    try {
      await this.prisma.client.usuario.delete({
        where: { id_Usuario: id },
      });

      return 'Usuario eliminado exitosamente';
    } catch (error) {
      console.error('Error al eliminar el usuario', error);
      throw new Error('Error al eliminar el usuario');
    }
  }
}
