import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { validateAccessToken } from '../lib/jwt';
import { ProtectedHttpRequest } from '../types/Http';
import { parseEvent } from './parseEvent';

/**
 * Função que transforma um evento do API Gateway em um ProtectedHttpRequest,
 * ou seja, inclui a autenticação do usuário via token JWT.
 */
export function parseProtectedEvent(event: APIGatewayProxyEventV2): ProtectedHttpRequest {
  // Primeiro, transforma o evento bruto em um HttpRequest comum
  const baseEvent = parseEvent(event);

  const { authorization } = event.headers;

  if (!authorization) {
    throw new Error('Access token not provided.');
  }

  // Divide o header no formato "Bearer <token>" e pega só o token
  const [, token] = authorization.split(' ');

  // Valida o token JWT e extrai o ID do usuário
  const userId = validateAccessToken(token);

  if (!userId) {
    throw new Error('Invalid access token.');
  }

  return {
    ...baseEvent,
    userId,
  };
}