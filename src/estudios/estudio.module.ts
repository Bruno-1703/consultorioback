import { Module } from '@nestjs/common';
import { EstudioService } from './estudio.service';
import { EstudioResolver } from './estudio.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { CitaModule } from 'src/citas/cita.module';

@Module({
  providers: [EstudioService, EstudioResolver],
  imports: [PrismaModule,CitaModule],
})
export class EstudioModule {}
