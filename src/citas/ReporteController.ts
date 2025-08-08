// reporte.controller.ts
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { CitaService } from './cita.service';

@Controller('reporte')
export class ReporteController {
  constructor(private readonly citaService: CitaService) {}

  @Get('citas')
  async descargarReporte(@Res() res: Response): Promise<void> {
    return this.citaService.generarReporteCitas(res);
  }
}
