# Foodiary — Documentação Geral do Projeto

Foodiary é uma solução completa para registro e acompanhamento alimentar, composta por um aplicativo mobile (React Native + Expo) e uma API backend serverless (Node.js + AWS). Este documento reúne as principais informações técnicas, instruções de uso, arquitetura e links úteis do projeto.

## Fluxo: 
É possível ver na página inicial a opção de login e cadastro. No cadastro o usuário responde uma série de perguntas para definir seu perfil, como objetivo, sedentarismo, idade, peso, altura.
Ao acessar o aplicativo, o usuário visualiza a lista de refeições do dia, podendo navegar por outros dias e consultar o histórico alimentar. Ao criar uma refeição, o sistema calcula automaticamente as calorias e nutrientes com base nas informações fornecidas. Na página inicial, é exibido um painel com o total de calorias consumidas e as refeições registradas no dia.
As refeições são inseridas por IA, por meio de aúdio e imagem, a IA transcreve para texto e envia para a API.

> **Atenção:** O projeto não está funcionando em produção, apenas foi testado em ambiente de desenvolvimento. Isso ocorre porque tanto a AWS quanto a OpenAI são serviços pagos, e as chaves foram retiradas por segurança e para não ultrapassar o limite de requisições gratuítas. Porém, dentro do pasta api tem uma pasta docs com toda a explicação necessária.

---

## Design

- Link do Figma: [Foodiary - Figma](https://www.figma.com/files/team/987071646749630939/recents-and-sharing?fuid=987071641292420561)

---

## Visão Geral

O projeto é dividido em dois principais módulos:

- **Mobile:** Aplicativo React Native com navegação protegida, formulários dinâmicos, captura de mídia e estilização com Tailwind.
- **API:** Backend serverless em Node.js, com autenticação JWT, gerenciamento de refeições, integração com AWS (Lambda, S3, SQS) e banco PostgreSQL (Neon).

---

## Tecnologias Utilizadas

### Mobile

- **Framework:** React Native + Expo
- **Navegação:** expo-router (rotas públicas/privadas)
- **Formulários:** React Hook Form + Zod
- **Estilização:** NativeWind (Tailwind CSS para RN)
- **Ícones:** Lucide React Native
- **Mídia:** expo-camera, expo-audio
- **Fontes:** Host Grotesk

### Backend/API

- **Node.js** + **TypeScript**
- **Serverless Framework**
- **AWS Lambda, S3, SQS, API Gateway**
- **Banco:** PostgreSQL (Neon) + Drizzle ORM
- **Autenticação:** JWT

---

## Estrutura de Pastas

### Mobile

- `src/app/` — Páginas e grupos de rotas
- `src/components/` — Componentes reutilizáveis
- `src/contexts/` — Contextos (ex: AuthContext)
- `src/hooks/` — Hooks customizados
- `src/styles/` — Estilos globais e cores
- `src/utils/` — Funções utilitárias (ex: cn para classes)

### API

- `src/clients/` — Clientes AWS SDK
- `src/controllers/` — Lógica dos endpoints
- `src/db/` — Esquema e conexão do banco
- `src/functions/` — Handlers das Lambdas
- `src/lib/` — Utilitários (JWT, cálculo de metas)
- `src/queues/` — Processadores de fila
- `src/types/` — Tipos TypeScript
- `src/utils/` — Funções auxiliares

---

## Principais Funcionalidades

- Cadastro e login de usuários (JWT)
- Registro, listagem e consulta de refeições
- Upload de arquivos (áudio/imagem) para análise
- Cálculo automático de metas nutricionais
- Processamento assíncrono de refeições via SQS
- Transcrição de áudio com OpenAI Whisper (na API)

---

## Endpoints da API

| Endpoint            | Método | Descrição                                 | Autenticação |
|---------------------|--------|-------------------------------------------|--------------|
| `/signin`           | POST   | Login do usuário                          | Não          |
| `/signup`           | POST   | Cadastro do usuário                       | Não          |
| `/me`               | GET    | Buscar perfil do usuário autenticado      | Sim          |
| `/meals`            | POST   | Criar nova refeição (gera URL de upload)  | Sim          |
| `/meals`            | GET    | Listar refeições por data                 | Sim          |
| `/meals/{mealId}`   | GET    | Buscar refeição por ID                    | Sim          |

---

## Comandos Úteis

### Mobile

```bash
npm start        # Iniciar servidor de desenvolvimento
npm run android  # Executar no Android
npm run ios      # Executar no iOS
npm run web      # Executar no navegador
```

### API

```bash
npm run dev      # Rodar localmente
sls offline      # Rodar serverless offline
serverless deploy # Deploy na AWS
serverless remove # Remover deploy
serverless info   # Ver funções e endpoints
serverless deploy function --function NOME_DA_FUNCAO # Deploy de função específica
```

---

## Configuração e Deploy

- Configure variáveis de ambiente conforme `.env.example` (mobile e api)
- Para deploy da API, configure AWS CLI e Serverless Framework
- Altere o nome do bucket S3 no `serverless.yml` para um nome único
- Consulte o arquivo `docs/infrastructure/infraestructure.md` para detalhes de infraestrutura

---

## Serviços AWS Utilizados

- **EC2:** Máquinas virtuais (opcional)
- **IAM:** Gerenciamento de usuários e permissões
- **S3:** Armazenamento de arquivos
- **Lambda:** Funções serverless
- **SQS:** Filas para processamento assíncrono
- **API Gateway:** Endpoints HTTP
- **CloudWatch:** Logs e monitoramento

---

## Notas de Configuração

- TypeScript com modo estrito habilitado
- Nova arquitetura do Expo ativada
- Sem configuração de testes ou linting por padrão

---

## Referências

- [Figma - Design](https://www.figma.com/files/team/987071646749630939/recents-and-sharing?fuid=987071641292420561)
- [Serverless Framework](https://www.serverless.com/framework/docs)
- [AWS Lambda](https://docs.aws.amazon.com/lambda/)
- [AWS CLI](https://docs.aws.amazon.com/cli/)
- `serverless.yml` e `drizzle.config.ts` (API)
- `signUpSchema.ts` (Mobile)

---

> O código possui comentários explicativos para facilitar o entendimento da lógica e do funcionamento de cada parte do sistema. É recomendado revisar os arquivos de configuração (`serverless.yml`, `drizzle.config.ts`, `.env.example`) e os esquemas de banco de dados (migrations) para um melhor entendimento da estrutura e funcionamento do projeto.