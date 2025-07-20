import { SQSClient } from '@aws-sdk/client-sqs';

// Cria uma instância do cliente SQS com a região configurada
export const sqsClient = new SQSClient();