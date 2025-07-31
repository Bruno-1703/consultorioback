import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UsuarioInput } from './usuario.input';
import { PrismaService } from '../prisma/prisma.service';
import { Usuario, UsuarioResultadoBusqueda } from './usuario.dto';
import { getUsuarios } from 'src/mongo/usuarios/getUsuarios';
import { MailService } from 'src/email/email.service';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { addHours } from 'date-fns';

@Injectable()
export class UsuarioService {
constructor(
  private prisma: PrismaService,
  private mailService: MailService, // corregido aquí
) {}
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

  async getUsuarios(skip?, limit?, where?): Promise<UsuarioResultadoBusqueda> {
    try {
      const usuarios = await getUsuarios(this.prisma.mongodb,
        skip,
        limit,
        where,
      );

      return usuarios;
    } catch (error) {
      console.error('Error al buscar usuarios', error);
      throw new Error('Error al buscar usuarios');
    }
  }

  async createUsuario(data: UsuarioInput): Promise<string> {
    try {
      await this.prisma.client.usuario.create({
        data: {
          nombre_usuario: data.nombre_usuario,
          email: data.email,
          password: data.password,
          rol_usuario: 'user',
          nombre_completo: data.nombre_completo,
          especialidad: data.especialidad,
          matricula: data.matricula,
          dni: data.dni,


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
async solicitarRecuperacionPassword(email: string): Promise<string> {
  const user = await this.prisma.client.usuario.findFirst({ where: { email } }); // ✅ cambiado findUnique → findFirst

  if (!user) return 'Si el email está registrado, se enviará un correo';

  const token = randomBytes(32).toString('hex');
const expiry = addHours(new Date(), 1); // ✅ esto será un Date

  try {
    await this.prisma.client.usuario.update({
      where: { id_Usuario: user.id_Usuario }, // ✅ ahora usamos la PK real
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;

    await this.mailService.sendEmail(
      email,
      'Recuperación de contraseña',
      `<p>Haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña. Este enlace expira en 1 hora.</p>`
    );

    return 'Si el email está registrado, se enviará un correo';
  } catch (error) {
    this.logger.error('Error al solicitar recuperación de contraseña', error);
    throw new InternalServerErrorException('No se pudo procesar la solicitud');
  }
}
async resetearPassword(token: string, nuevaPassword: string): Promise<string> {
    const user = await this.prisma.client.usuario.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Token inválido o expirado');
    }

    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    try {
      await this.prisma.client.usuario.update({
        where: { id_Usuario: user.id_Usuario },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      return 'Contraseña actualizada correctamente';
    } catch (error) {
      this.logger.error('Error al resetear la contraseña', error);
      throw new InternalServerErrorException('No se pudo actualizar la contraseña');
    }
  }
async getUsuarioById(id: string): Promise<Usuario | null> {
  try {
    const usuario = await this.prisma.client.usuario.findUnique({
      where: { id_Usuario: id },
    });
    return usuario || null;
  } catch (error) {
    throw new Error('Error al obtener usuario por ID');
  }
}
}


