import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend = new Resend(process.env.RESEND_API_KEY);
  private readonly logger = new Logger(MailService.name);

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: 'Tu App <no-reply@tu-dominio.resend.dev>',
        to,
        subject,
        html,
      });
    } catch (error) {
      this.logger.error('Error al enviar email', error);
      throw new InternalServerErrorException('No se pudo enviar el correo electrónico');
    }
  }
}
