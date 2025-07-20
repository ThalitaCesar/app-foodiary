import { eq } from 'drizzle-orm';
import { db } from '../db';
import { mealsTable } from '../db/schema';

// Classe responsável por processar uma refeição a partir de um arquivo
export class ProcessMeal {
  // Método estático que recebe o identificador do arquivo a ser processado
  static async process({ fileKey }: { fileKey: string }) {
    // Busca a refeição no banco que tenha o inputFileKey igual ao informado
    const meal = await db.query.mealsTable.findFirst({
      where: eq(mealsTable.inputFileKey, fileKey),
    });

    // Se não encontrar a refeição, lança um erro
    if (!meal) {
      throw new Error('Meal not found.');
    }

    // Se a refeição já tiver sido processada com sucesso ou falha, interrompe
    if (meal.status === 'failed' || meal.status === 'success') {
      return;
    }

    // Atualiza o status da refeição para "processing"
    await db
      .update(mealsTable)
      .set({ status: 'processing' })
      .where(eq(mealsTable.id, meal.id));

    try {
      // CHAMAR A IA...

      await db
        .update(mealsTable)
        .set({
          status: 'success',
          name: 'Café da manhã',
          icon: '🍞',
          foods: [
            {
              name: 'Pão',
              quantity: '2 fatias',
              calories: 100,
              proteins: 200,
              carbohydrates: 300,
              fasts: 400,
            },
          ],
        })
        .where(eq(mealsTable.id, meal.id));
    } catch {
      await db
        .update(mealsTable)
        .set({ status: 'failed' })
        .where(eq(mealsTable.id, meal.id));
    }
  }
}