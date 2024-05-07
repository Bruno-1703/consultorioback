import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from 'src/users/usuario.service';
import { RegisterDto } from './register.dto';
import * as bcryptjs from 'bcryptjs'
import { Usuario } from 'src/users/usuario.dto';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor
  (private readonly userService: UsuarioService,
    private readonly jwtService: JwtService
  ) {}
  async register(registerDto: RegisterDto) {
    
    const user = await this.userService.getUsuario(registerDto.email);
    console.log(user)
    if (user) {
      throw new BadRequestException('El usuario ya existe');
    }
    try {
      const hashedPassword = await bcryptjs.hash(registerDto.password, 10);
      console.log(hashedPassword)
      await this.userService.createUsuario({
        nombre_usuario: registerDto.email,
        password: hashedPassword,
        email: registerDto.email,
        rol_usuario: 'admin',
      });
      return 'Usuario registrado exitosamente';
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw new Error('Error al registrar usuario');
    }
  }
  async login(loginDto: LoginDto) {
    const user: Usuario = await this.userService.getUsuario(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const isPasswordValid = await bcryptjs.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { userId: user.id_Usuario, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload)

    return { accessToken };
  }
}
