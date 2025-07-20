import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { HttpRequest } from '../types/Http';

/**
 * Função que transforma o evento do API Gateway em um objeto HttpRequest customizado
 * usado internamente na aplicação para padronizar o acesso aos dados da requisição.
 */
export function parseEvent(event: APIGatewayProxyEventV2): HttpRequest {
  // Faz o parse do corpo da requisição (caso não exista, assume objeto vazio)
  const body = JSON.parse(event.body ?? '{}');

  // Captura os parâmetros de rota, caso existam (ex: /meals/{mealId})
  const params = event.pathParameters ?? {};

  // Captura os parâmetros de query string (ex: ?page=2)
  const queryParams = event.queryStringParameters ?? {};

  return {
    body,
    params,
    queryParams,
  };
}