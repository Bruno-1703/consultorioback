import { Module } from '@nestjs/common';
import { CitaResolver } from './cita.resolver';
import { CitaService } from './cita.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [CitaService, CitaResolver],
  imports: [PrismaModule],
})
export class CitaModule {}
