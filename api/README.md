# API Foodiary

A API Foodiary é um backend serverless construído com Node.js, TypeScript, AWS Lambda, API Gateway, S3, SQS e PostgreSQL (Neon + Drizzle ORM). Ela fornece endpoints para autenticação de usuários, gerenciamento de refeições e cálculo automático de metas nutricionais.

## Principais Funcionalidades

* Autenticação de Usuário: Cadastro e login com autenticação baseada em JWT.
* Gerenciamento de Refeições: Criar, listar e consultar refeições, incluindo upload de arquivos (áudio/imagem) para análise.
* Metas Nutricionais: Calcula automaticamente as metas diárias com base no perfil do usuário.
* Arquitetura Serverless: Utiliza AWS Lambda, S3 para armazenamento de arquivos e SQS para fila de processamento de refeições.

## Estrutura de Pastas

- `src/clients/`: Clientes AWS SDK (S3, SQS)
- `src/controllers/`: Lógica de negócio dos endpoints
- `src/db/`: Esquema e conexão do banco de dados
- `src/functions/`: Handlers das Lambdas
- `src/lib/`: Utilitários (JWT, cálculo de metas)
- `src/queues/`: Processadores de fila (ex: análise de refeições)
- `src/types/`: Tipos TypeScript
- `src/utils/`: Funções auxiliares

## Variáveis de Ambiente

Veja o arquivo `.env.example` para os dados necessários:

- `DATABASE_URL`: String de conexão do PostgreSQL
- `JWT_SECRET`: Secret para assinatura JWT
- `OPENAI_API_KEY`: Key do OpenAI API.

## Endpoints da API

| Endpoint            | Método | Descrição                                 | Requer Autenticação |
|---------------------|--------|-------------------------------------------|---------------------|
| `/signin`           | POST   | Login do usuário                          | Não                |
| `/signup`           | POST   | Cadastro do usuário                       | Não                |
| `/me`               | GET    | Buscar perfil do usuário autenticado      | Sim                |
| `/meals`            | POST   | Criar nova refeição (gera URL de upload)  | Sim                |
| `/meals`            | GET    | Listar refeições por data                 | Sim                |
| `/meals/{mealId}`   | GET    | Buscar refeição por ID                    | Sim                |

## Upload e Processamento de Arquivos

- **Criar Refeição:** Retorna uma URL pré-assinada do S3 para upload do arquivo da refeição.
- **Evento de Upload:** Disparado quando um arquivo é enviado ao S3, enviando mensagem para a fila SQS.
- **Processar Refeição:** Lambda acionada pela SQS processa a refeição, atualizando status e resultado da análise.

## Esquema do Banco de Dados

Veja `src/db/schema.ts`:

- **usersTable:** Armazena perfil do usuário e metas nutricionais.
- **mealsTable:** Armazena refeições, status, tipo de entrada e resultados de análise.

## Desenvolvimento

### Pré-requisitos

- Node.js (recomendado: versão 22)
- npm (gerenciador de pacotes do Node)
- Conta na AWS (para variáveis e deploy)
- Criar uma conta na Neon ORM ([https://neon.com](https://neon.com)), criar um projeto com PostgreSQL e inserir a chave no .env em DATABASE_URL
- Criar uma conta na Serverless ([https://www.serverless.com](https://www.serverless.com))

### Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/ThalitaCesar/diary-food.git
   cd api
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env` e preencha com seus dados:
     ```sh
     cp .env.example .env
     ```
   - Edite o `.env` com sua URL do banco de dados e JWT_SECRET.

### Como rodar localmente (utilize Postman ou Insomnia para testar)

- Para rodar em modo desenvolvimento:
  ```sh
  npm run dev
  ```
- Para rodar o ambiente serverless offline:
  ```sh
  sls offline
  ```

O servidor estará disponível em `http://localhost:3000`.   

### Comandos Úteis

- **Remover deploy:**  
  ```sh
  serverless remove
  ```
- **Ver funções e endpoints:**  
  ```sh
  serverless info
  ```
- **Deploy apenas de uma função específica:**  
  ```sh
  serverless deploy function --function NOME_DA_FUNCAO
  ```

### Deploy

Após configurar tudo, execute:

```sh
serverless deploy
```

O endpoint será exibido no terminal após o deploy.

> Veja no arquivo de docs infraestruture.md como realizar a configuração do aws e serverless framework

---

## Referências

- `serverless.yml`: Configuração do Serverless
- `drizzle.config.ts`: Configuração do Drizzle ORM

---

### Serviços AWS utilizados

- **EC2:** Serviço de máquinas virtuais na nuvem.
- **IAM:** Gerenciamento de usuários, grupos e permissões de acesso aos recursos AWS.
- **S3:** Armazenamento de arquivos.
- **Lambda:** Execução de funções serverless, responsável por processar requisições da API e eventos.
- **Simple Queue Service (SQS):** Gerenciamento de filas para processamento assíncrono, utilizado para organizar o fluxo de análise dos arquivos enviados.

> O código deste projeto possui comentários explicativos em pontos estratégicos para facilitar o entendimento da lógica e do fluxo de execução.

