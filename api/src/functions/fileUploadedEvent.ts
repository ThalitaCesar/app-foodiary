import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { S3Event } from 'aws-lambda';
import { sqsClient } from '../clients/sqsClient';

// Função Lambda handler que será acionada sempre que um novo arquivo for enviado ao bucket S3
export async function handler(event: S3Event) {
  // Processa todos os registros do evento S3 em paralelo
  await Promise.all(
    event.Records.map(async record => {
      // Cria um comando para enviar uma nova mensagem à fila SQS
      // A mensagem contém a chave do arquivo que foi salvo no S3
      const command = new SendMessageCommand({
        QueueUrl: process.env.MEALS_QUEUE_URL, // URL da fila SQS obtida via variável de ambiente
        MessageBody: JSON.stringify({ fileKey: record.s3.object.key }), // Corpo da mensagem enviado para a fila
      });

      // Envia a mensagem para a fila usando o cliente da SQS
      await sqsClient.send(command);
    }),
  );
}