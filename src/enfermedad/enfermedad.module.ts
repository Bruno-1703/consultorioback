import { Module } from "@nestjs/common"
import { PrismaModule } from "../prisma/prisma.module"
import { EnfermedadResolver } from "./enfermedad.resolver"
import { EnfermedadService } from "./enfermedad.service"

@Module({
  providers: [EnfermedadResolver,EnfermedadService],
  imports: [PrismaModule],
})
export class EnfermedadModule {}
