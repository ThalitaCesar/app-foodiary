import { SQSEvent } from 'aws-lambda';
import { ProcessMeal } from '../queues/ProcessMeal';

// Função handler principal da Lambda, que será executada quando a função for acionada por mensagens na SQS
export async function handler(event: SQSEvent) {
  // Usa Promise.all para processar todas as mensagens da fila em paralelo
  await Promise.all(event.Records.map(async record => {
    const body = JSON.parse(record.body);
    await ProcessMeal.process(body);
  }));
}