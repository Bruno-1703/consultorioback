import { Module } from '@nestjs/common';
import { CitaResolver } from './cita.resolver';
import { CitaService } from './cita.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ReporteController } from './ReporteController';

@Module({
  providers: [CitaService, CitaResolver],
  imports: [PrismaModule],
  exports: [CitaService], 
  controllers: [ReporteController],
})
export class CitaModule {}
