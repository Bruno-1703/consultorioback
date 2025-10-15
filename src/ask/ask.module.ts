import { Module } from '@nestjs/common';
import { AskResolver } from './ask.resolver';
import { AskService } from './ask.service';

@Module({
  providers: [AskService, AskResolver],
})
export class AskModule {}
