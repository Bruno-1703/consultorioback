import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(5)
  nombre_usuario: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  nombre_completo: string;

  @IsString()
  @IsNotEmpty()
  especialidad: string;

  @IsString()
  @IsNotEmpty()
  matricula: string;

  @IsString()
  @IsNotEmpty()
  dni: string;

  @IsOptional()
  @IsString()
  telefono?: string;

}
