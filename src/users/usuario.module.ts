import { Module } from '@nestjs/common';
import { UsuarioResolver } from './usuario.resolver';
import { UsuarioService } from './usuario.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [UsuarioService, UsuarioResolver],
  imports: [PrismaModule],
  exports: [UsuarioService]
})
export class UsersModule {}
``