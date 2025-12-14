import { Module } from '@nestjs/common';
import { InternacionResolver } from './internacion.resolver';
import { InternacionService } from './internacion.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [InternacionResolver, InternacionService, PrismaService],
})
export class InternacionModule {}
