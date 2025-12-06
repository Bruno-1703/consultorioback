import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsuarioInput } from './usuario.input';
import { Usuario, UsuarioResultadoBusqueda } from './usuario.dto';
import { getUsuarios } from 'src/mongo/usuarios/getUsuarios';
import { MailService } from 'src/email/email.service';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { addHours } from 'date-fns';

@Injectable()
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) { }

  async getUsuario(email: string): Promise<Usuario | null> {
    try {
      return await this.prisma.client.usuario.findFirst({
        where: { email },
      });
    } catch (error) {
      this.logger.error('Error al obtener el usuario', error);
      throw new InternalServerErrorException('Error al obtener el usuario');
    }
  }

  async getUsuarios(skip?, limit?, where?): Promise<UsuarioResultadoBusqueda> {
    try {
      return await getUsuarios(this.prisma.mongodb, skip, limit, where);
    } catch (error) {
      this.logger.error('Error al buscar usuarios', error);
      throw new InternalServerErrorException('Error al buscar usuarios');
    }
  }
  async createUsuario(data: UsuarioInput): Promise<string> {
    try {
      // Validar si ya existe un usuario con ese email
      const existingUser = await this.prisma.client.usuario.findFirst({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new InternalServerErrorException('El email ya está registrado');
      }

      // Hashear password correctamente
      const hashedPassword = await bcrypt.hash(data.password, 10);

      await this.prisma.client.usuario.create({
        data: {
          nombre_usuario: data.nombre_usuario,
          email: data.email,
          password: hashedPassword,      // ← SE GUARDA HASHEADA
          rol_usuario: data.rol_usuario || 'user',
          nombre_completo: data.nombre_completo,
          especialidad: data.especialidad,
          matricula: data.matricula,
          dni: data.dni,
        },
      });

      return 'Usuario creado exitosamente';
    } catch (error) {
      this.logger.error('Error al crear usuario', error);
      throw new InternalServerErrorException(
        error.message || 'Error al crear usuario',
      );
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
      this.logger.error('Error al actualizar el usuario', error);
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  async deleteUsuario(id: string): Promise<string> {
    try {
      await this.prisma.client.usuario.delete({
        where: { id_Usuario: id },
      });

      return 'Usuario eliminado exitosamente';
    } catch (error) {
      this.logger.error('Error al eliminar el usuario', error);
      throw new InternalServerErrorException('Error al eliminar el usuario');
    }
  }

  async solicitarRecuperacionPassword(email: string): Promise<string> {
    const user = await this.prisma.client.usuario.findFirst({ where: { email } });

    // No revelamos si el email existe
    if (!user) return 'Si el email está registrado, se enviará un correo';

    const token = randomBytes(32).toString('hex');
    const expiry = addHours(new Date(), 1);

    try {
      await this.prisma.client.usuario.update({
        where: { id_Usuario: user.id_Usuario },
        data: {
          resetToken: token,
          resetTokenExpiry: expiry,
        },
      });

      const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;

      await this.mailService.sendEmail(
        email,
        'Recuperación de contraseña',
        `<p>Haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña. El enlace expira en 1 hora.</p>`,
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
        resetTokenExpiry: { gte: new Date() },
      },
    });

    if (!user) throw new NotFoundException('Token inválido o expirado');

    try {
      const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

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
      this.logger.error('Error al resetear contraseña', error);
      throw new InternalServerErrorException('No se pudo actualizar la contraseña');
    }
  }

  async getUsuarioById(id: string): Promise<Usuario | null> {
    try {
      return await this.prisma.client.usuario.findUnique({
        where: { id_Usuario: id },
      });
    } catch (error) {
      this.logger.error('Error al obtener usuario por ID', error);
      throw new InternalServerErrorException('Error al obtener usuario por ID');
    }
  }
}
