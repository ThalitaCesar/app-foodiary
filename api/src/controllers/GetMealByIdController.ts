import { and, eq } from 'drizzle-orm';
import z from 'zod';
import { db } from '../db';
import { mealsTable } from '../db/schema';
import { HttpResponse, ProtectedHttpRequest } from '../types/Http';
import { badRequest, ok } from '../utils/http';

// Define o schema de validação para os parâmetros da rota.
// Espera que o parâmetro `mealId` seja uma string no formato UUID.
const schema = z.object({
  mealId: z.uuid(),
});

export class GetMealByIdController {
  // Método principal que trata a requisição para buscar uma refeição pelo ID
  static async handle({ userId, params }: ProtectedHttpRequest): Promise<HttpResponse> {
    // Valida os parâmetros da requisição usando o schema definido acima
    const { success, error, data } = schema.safeParse(params);
    
    // Se a validação falhar, retorna um erro 400 com os detalhes
    if (!success) {
      return badRequest({ errors: error.issues });
    }

    // Busca a refeição no banco de dados com base no ID e no ID do usuário autenticado
    const meal = await db.query.mealsTable.findFirst({
      columns: {
        id: true,
        foods: true,
        createdAt: true,
        icon: true,
        name: true,
        status: true,
      },
      where: and(
        eq(mealsTable.id, data.mealId),      // Filtra pelo ID da refeição
        eq(mealsTable.userId, userId),       // Garante que pertence ao usuário autenticado
      ),
    });

    // Retorna a refeição encontrada (ou null, se não existir)
    return ok({ meal });
  }
}
