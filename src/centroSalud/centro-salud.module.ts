import { Module } from '@nestjs/common';
import { CentroSaludService } from './centro-salud.service';
import { CentroSaludResolver } from './centro-salud.resolver';
import { PrismaModule } from 'src/prisma/prisma.module'; // Asegúrate de que la ruta sea correcta

@Module({
  imports: [PrismaModule],
  providers: [CentroSaludService, CentroSaludResolver],
  exports: [CentroSaludService], // Lo exportamos por si quieres usarlo en CitaService
})
export class CentroSaludModule {}