import { and, eq, gte, lte } from 'drizzle-orm';
import z from 'zod';
import { db } from '../db';
import { mealsTable } from '../db/schema';
import { HttpResponse, ProtectedHttpRequest } from '../types/Http';
import { badRequest, ok } from '../utils/http';

// Define e valida o schema dos parâmetros de consulta (queryParams)
// Espera um campo `date` no formato ISO (ex: "2025-07-20")
// Transforma a string recebida em um objeto Date após a validação
const schema = z.object({
  date: z.iso.date().transform(dateStr => new Date(dateStr)),
});

export class ListMealsController {
  static async handle({ userId, queryParams }: ProtectedHttpRequest): Promise<HttpResponse> {
    // Valida os parâmetros de query usando Zod, esperando um campo `date` no formato ISO
    const { success, error, data } = schema.safeParse(queryParams);
    
    if (!success) {
      // Retorna erro 400 se a validação falhar
      return badRequest({ errors: error.issues });
    }

    // Ajusta a data de fim para o último milissegundo do dia informado
    const endDate = new Date(data.date);
    endDate.setUTCHours(23, 59, 59, 59);

    // Busca refeições do usuário para a data informada, com status "success"
    const meals = await db.query.mealsTable.findMany({
      columns: {
        id: true,
        foods: true,
        createdAt: true,
        icon: true,
        name: true,
      },
      where: and(
        eq(mealsTable.userId, userId),                    // do usuário atual
        eq(mealsTable.status, 'success'),                 // com status "success"
        gte(mealsTable.createdAt, data.date),             // a partir da meia-noite da data
        lte(mealsTable.createdAt, endDate),               // até 23:59:59.999 da mesma data
      ),
    });

    // Retorna as refeições encontradas
    return ok({ meals });
  }
}
