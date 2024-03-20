import { Module } from "@nestjs/common"
import { EstudioService } from "./estudio.service"
import { EstudioResolver } from "./estudio.resolver"
import { PrismaModule } from "../prisma/prisma.module"

@Module({
  providers: [EstudioService, EstudioResolver],
  imports: [PrismaModule],
})
export class EstudioModule {}
