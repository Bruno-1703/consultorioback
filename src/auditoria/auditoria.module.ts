import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AuditoriaResolver } from './auditoria.resolver';
import { AuditoriaService } from './auditoria.service';

@Module({
  providers: [AuditoriaService, AuditoriaResolver],
  imports: [PrismaModule],
})
export class AuditoriaModule {}
