import { GetObjectCommand } from '@aws-sdk/client-s3';
import { eq } from 'drizzle-orm';
import { Readable } from 'node:stream';
import { s3Client } from '../clients/s3Client';
import { db } from '../db';
import { mealsTable } from '../db/schema';
import { transcribeAudio } from '../services/ai';

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
        if (meal.inputType === 'audio') {
        const command = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: meal.inputFileKey,
        });

        const { Body } = await s3Client.send(command);

        if (!Body || !(Body instanceof Readable)) {
          throw new Error('Cannot load the audio file.');
        }

        const chunks = [];
        for await (const chunk of Body) {
          chunks.push(chunk);
        }

        const audioFileBuffer = Buffer.concat(chunks);

        const transcription = await transcribeAudio(audioFileBuffer);

        console.log({ transcription });
      }

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