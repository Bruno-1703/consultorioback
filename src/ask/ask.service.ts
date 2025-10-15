import { Injectable, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class AskService {
  private readonly HF_API_URL = 'https://api-inference.huggingface.co/models/ai21labs/AI21-Jamba-1.5-Mini';
  private readonly HF_API_TOKEN = process.env.HF_API_TOKEN;

  async askQuestion(question: string): Promise<string> {
    if (!this.HF_API_TOKEN) {
      throw new UnauthorizedException('Falta el token de Hugging Face. Asegúrate de definir HF_API_TOKEN en tu .env');
    }

    try {
      const response = await fetch(this.HF_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.HF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: question,
          parameters: { temperature: 0.3, max_new_tokens: 300 },
        }),
      });

      if (!response.ok) {
        const text = await response.text();

        if (response.status === 404) {
          throw new NotFoundException('Modelo no encontrado en Hugging Face. Verifica el nombre del modelo.');
        } else if (response.status === 401) {
          throw new UnauthorizedException('Token de Hugging Face inválido o expirado.');
        } else {
          throw new InternalServerErrorException(`Error en la API de Hugging Face (${response.status}): ${text}`);
        }
      }

      const data = await response.json();

      // Hugging Face puede devolver distintos formatos según el modelo
      if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text.trim();
      }

      if (data?.generated_text) {
        return data.generated_text.trim();
      }

      return 'Sin respuesta generada por el modelo.';

    } catch (error) {
      console.error('[AskService Error]', error);
      throw new InternalServerErrorException('Error al comunicarse con Hugging Face.');
    }
  }
}
