import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // importante
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';

@Module({
  controllers: [BackupController],
  providers: [BackupService, PrismaService],
})
export class BackupModule {}
