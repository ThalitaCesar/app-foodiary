import { HttpResponse } from '../types/Http';

// transforma a resposta do controller em um formato compatível com o API Gateway
export function parseResponse({ statusCode, body }: HttpResponse) {
  return {
    statusCode,
    body: body ? JSON.stringify(body) : undefined,
  };
}