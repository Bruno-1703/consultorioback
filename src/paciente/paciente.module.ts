import { Module } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteResolver } from './paciente.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [PacienteService, PacienteResolver],
  imports: [PrismaModule],
})
export class PacienteModule {}
