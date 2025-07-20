# Infraestrutura da API — AWS & Serverless Framework

Este documento detalha a infraestrutura do projeto Foodiary API, abordando permissões, configuração, deployment e boas práticas com **AWS** e **Serverless Framework**.


## Índice

1. [Introdução](#introdução)
2. [Permissões e Configuração AWS](#permissões-e-configuração-aws)
   - IAM
   - AWS CLI
   - S3
3. [Serverless Framework](#serverless-framework)
   - Instalação e Login
   - Estrutura de Projeto
   - Arquivo `serverless.yml`
   - Deploy
   - Boas Práticas
4. [Serviços AWS Utilizados](#serviços-aws-utilizados)
5. [Referências](#referências)

---

## Introdução

A infraestrutura utiliza arquitetura **serverless** com o **Serverless Framework** para orquestrar funções AWS Lambda e serviços gerenciados como S3, SQS e IAM, garantindo escalabilidade, baixo custo e manutenção simplificada.

---

## Permissões e Configuração AWS

### IAM (Identity and Access Management)

1. Acesse o console do IAM: [https://console.aws.amazon.com/iam](https://console.aws.amazon.com/iam)
2. Crie um novo usuário com acesso programático.
3. Crie um grupo e associe políticas ao grupo, como [AdministratorAccess](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/policies/details/arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FAdministratorAccess) (apenas para estudo).
4. Gere uma Access Key em "Security Credentials" para uso no AWS CLI.
5. Salve a chave secreta imediatamente, pois ela não será exibida novamente.

---

### AWS CLI

A CLI permite interagir com os serviços AWS via terminal.

**Instalação:**  
[Guia oficial](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

**Configuração:**

```sh
aws configure
```

Preencha:
- AWS Access Key ID
- AWS Secret Access Key
- Região padrão (ex: us-west-2)
- Formato de saída (ex: json)

**Verificação:**

```sh
aws s3 ls
```

---

### Criar um bucket S3

1. Acesse o console S3.
2. Clique em “Create bucket” e defina um nome único.
3. Verifique via terminal:
   ```sh
   aws s3 ls
   ```

---

## Serverless Framework

### Instalação e Login

**Instalação global:**
```sh
npm i -g serverless
```

**Login:**
```sh
sls login
```

**Criação de projeto:**
```sh
sls create --template aws-nodejs --path nome-do-projeto
```

---

### Estrutura de Projeto

```
.
├── handler.ts/js         # Funções Lambda
├── serverless.yml        # Configuração de infraestrutura
├── package.json
├── tsconfig.json         # Se TypeScript
└── .env                  # Variáveis de ambiente
```

---

### Exemplo de `serverless.yml`

```yaml
service: foodiary-api

frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs22.x
  region: us-west-2
  architecture: arm64
  memorySize: 128
  environment:
    BUCKET_NAME: nome-do-bucket

functions:
  getMeals:
    handler: src/functions/getMeals.handler
    events:
      - http:
          path: meals
          method: get

plugins:
  - serverless-dotenv-plugin
```

> **Nota:** Altere `BUCKET_NAME` para o nome real criado no S3.

---

### Deploy da Infraestrutura

```sh
serverless deploy
```

Esse comando:
- Empacota o código
- Cria/atualiza funções Lambda
- Configura API Gateway, S3, SQS, etc
- Exibe a URL dos endpoints no terminal

---

### Boas Práticas

- Utilize variáveis de ambiente com `.env` para segredos.
- Prefira políticas mínimas no IAM.
- Use layers para pacotes reutilizáveis.
- Separe ambientes (dev, staging, prod).
- Controle o versionamento do `serverless.yml`.

---

## Serviços AWS Utilizados

| Serviço         | Função                                          |
| --------------- | ----------------------------------------------- |
| **Lambda**      | Executa funções sem servidor, chamadas pela API |
| **S3**          | Armazenamento de arquivos (ex: uploads)         |
| **SQS**         | Gerencia filas para processamento assíncrono    |
| **IAM**         | Controla permissões dos recursos                |
| **API Gateway** | Expõe as funções Lambda como endpoints HTTP     |
| **CloudWatch**  | Coleta logs e monitora execução das funções     |

---

## Referências

- [Documentação Serverless](https://www.serverless.com/framework/docs)
- [AWS Lambda](https://docs.aws.amazon.com/lambda/)
- [AWS CLI](https://docs.aws.amazon.com/cli/)
- `serverless.yml`: Arquivo principal de orquestração
- `drizzle.config.ts`: Configuração do ORM
- `src/functions/`: Diretório de handlers lambda

---

> **Atenção:** Nunca compartilhe suas chaves de acesso AWS em repositórios públicos