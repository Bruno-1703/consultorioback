import { Module } from '@nestjs/common';
import { UsuarioResolver } from './usuario.resolver';
import { UsuarioService } from './usuario.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  providers: [UsuarioService, UsuarioResolver],
  imports: [PrismaModule,
        EmailModule, 

  ],
  exports: [UsuarioService]
})
export class UsersModule {}
``