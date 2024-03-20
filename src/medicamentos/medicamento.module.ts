import { Module } from "@nestjs/common"
import { MedicamentoResolver } from "./medicamento.resolver"
import { MedicamentosService } from "./medicamento.service"
import { PrismaModule } from "../prisma/prisma.module"

@Module({
  providers: [MedicamentoResolver, MedicamentosService],
  imports: [PrismaModule],
})
export class MedicamentoModule {}
