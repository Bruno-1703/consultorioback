import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsuarioInput, UsuarioWhereInput } from './usuario.input'; // Importamos tus tipos exactos
import { Usuario, UsuarioResultadoBusqueda } from './usuario.dto';
import { getUsuarios } from 'src/mongo/usuarios/getUsuarios';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { addHours } from 'date-fns';
import { MailService } from 'src/email/email.service';

@Injectable()
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) { }

  // Mantenemos tus nombres de métodos exactos
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

  async getUsuarios(skip?: number, limit?: number, where?: UsuarioWhereInput): Promise<UsuarioResultadoBusqueda> {
    try {
      // Usamos el helper de mongo pasando el cliente y tus filtros
      return await getUsuarios(this.prisma.mongodb as any, skip, limit, where);
    } catch (error) {
      this.logger.error('Error al buscar usuarios', error);
      throw new InternalServerErrorException('Error al buscar usuarios');
    }
  }

  async createUsuario(data: UsuarioInput): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Aquí resolvemos el error: usamos la relación 'centros' de tu modelo
      await this.prisma.client.usuario.create({
        data: {
          nombre_usuario: data.nombre_usuario,
          email: data.email,
          password: hashedPassword,
          rol_usuario: data.rol_usuario || 'usuario',
          nombre_completo: data.nombre_completo,
          especialidad: data.especialidad,
          matricula: data.matricula,
          dni: data.dni,
          telefono: data.telefono,
          // Si envías centroSaludId, creamos la entrada en la tabla intermedia UsuarioCentro
          centros: data.centroSaludId ? {
            create: {
              centroSaludId: data.centroSaludId,
              rol: data.rol_usuario || 'usuario'
            }
          } : undefined
        },
      });

      return 'Usuario creado exitosamente';
    } catch (error) {
      this.logger.error('Error al crear usuario', error);
      throw new InternalServerErrorException(error.message || 'Error al crear usuario');
    }
  }

  async updateUsuario(data: UsuarioInput, usuarioId: string): Promise<string> {
    try {
      const { centroSaludId, ...rest } = data;

      // 1. Actualizamos los datos básicos del usuario
      await this.prisma.client.usuario.update({
        where: { id_Usuario: usuarioId },
        data: {
          ...rest,
          // Si hay un cambio de rol, lo replicamos en la tabla intermedia
          centros: data.rol_usuario ? {
            updateMany: {
              where: { usuarioId: usuarioId }, // Para todas sus sedes
              data: { rol: data.rol_usuario }
            }
          } : undefined
        },
      });

      return 'Usuario y sus permisos actualizados';
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar');
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
    if (!user) return 'Si el email está registrado, se enviará un correo';

    const token = randomBytes(32).toString('hex');
    const expiry = addHours(new Date(), 1);

    await this.prisma.client.usuario.update({
      where: { id_Usuario: user.id_Usuario },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;
    await this.mailService.sendEmail(email, 'Recuperación', `<p><a href="${resetUrl}">Reset</a></p>`);

    return 'Si el email está registrado, se enviará un correo';
  }

  async resetearPassword(token: string, nuevaPassword: string): Promise<string> {
    const user = await this.prisma.client.usuario.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gte: new Date() } },
    });
    if (!user) throw new NotFoundException('Token inválido');

    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    await this.prisma.client.usuario.update({
      where: { id_Usuario: user.id_Usuario },
      data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    });

    return 'Contraseña actualizada correctamente';
  }

  async getUsuarioById(id: string): Promise<Usuario | null> {
    try {
      return await this.prisma.client.usuario.findUnique({
        where: { id_Usuario: id },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener usuario por ID');
    }
  }
}