import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly resend = new Resend(process.env.RESEND_API_KEY);
  private readonly logger = new Logger(MailService.name);

  async sendEmail(
    to: string | string[],
    subject: string,
    html: string,
  from = 'onboarding@resend.dev' // ✔️ reemplazo temporal para pruebas
  ): Promise<void> {
    if (!to || !subject || !html) {
      this.logger.warn('sendEmail llamado con datos incompletos', { to, subject });
      throw new InternalServerErrorException('Datos incompletos para enviar el correo');
    }

    try {
      const response = await this.resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      this.logger.log(`Correo enviado correctamente a ${Array.isArray(to) ? to.join(', ') : to}`);
      this.logger.debug('Respuesta del proveedor de correo:', JSON.stringify(response, null, 2));
    } catch (error) {
      this.logger.error('Error al enviar email', {
        error: error?.message || error,
        to,
        subject,
      });

      throw new InternalServerErrorException('No se pudo enviar el correo electrónico');
    }
  }
}
