import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import z from 'zod';
import { s3Client } from '../clients/s3Client';
import { db } from '../db';
import { mealsTable } from '../db/schema';
import { HttpResponse, ProtectedHttpRequest } from '../types/Http';
import { badRequest, created } from '../utils/http';

// Valida o corpo da requisição, permitindo apenas os tipos de arquivo 'audio/m4a' ou 'image/jpeg'
const schema = z.object({
  fileType: z.enum(['audio/m4a', 'image/jpeg']),
});

export class CreateMealController {
  static async handle({ userId, body }: ProtectedHttpRequest): Promise<HttpResponse> {
    // Validação do corpo da requisição
    const { success, error, data } = schema.safeParse(body);

    if (!success) {
      return badRequest({ errors: error.issues });
    }

    // Gera um identificador único para o arquivo
    const fileId = randomUUID();

    // Define a extensão do arquivo com base no tipo informado
    const ext = data.fileType === 'audio/m4a' ? '.m4a' : '.jpg';

    // Define o nome completo do arquivo (chave no S3)
    const fileKey = `${fileId}${ext}`;

    // Cria o comando que será usado para gerar a URL assinada para upload no S3
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME, // Nome do bucket onde o arquivo será salvo
      Key: fileKey, // Caminho/chave do arquivo no bucket
    });

    // Gera uma URL assinada com validade de 10 minutos (600 segundos)
    const presignedURL = await getSignedUrl(s3Client, command, { expiresIn: 600 });

    // Cria um novo registro de refeição no banco de dados, com status "uploading"
    const [meal] = await db
      .insert(mealsTable)
      .values({
        userId,
        inputFileKey: fileKey, // Nome do arquivo que será enviado
        inputType: data.fileType === 'audio/m4a' ? 'audio' : 'picture',
        status: 'uploading',   // Status inicial da refeição
        icon: '',              // Pode ser preenchido mais tarde
        name: '',              // Pode ser preenchido mais tarde
        foods: [],             // Lista de alimentos, vazia inicialmente
      })
      .returning({ id: mealsTable.id }); // Retorna o ID da refeição criada

    // Retorna a resposta com o ID da refeição e a URL para upload
    return created({
      mealId: meal.id,
      uploadURL: presignedURL,
    });
  }
}
