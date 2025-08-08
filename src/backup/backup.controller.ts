import { Controller, Get } from '@nestjs/common';
import { BackupService } from './backup.service';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('json')
  async getBackupJson() {
    return this.backupService.exportBackupJson();
  }
}
