# Integração com OpenAI Whisper API (Transcrição de Áudio)

Este projeto utiliza a API da OpenAI para realizar **transcrição automática de áudios** com o modelo `whisper-1`, transformando arquivos `.m4a` em texto utilizando Node.js e TypeScript.

---

## 📘 Documentação Oficial da OpenAI

Acesse a documentação completa em:

 https://platform.openai.com/docs/overview

> A API da OpenAI é **paga por uso**. É necessário cadastrar um cartão de crédito.

---

## Etapas de Integração

### 1. Criar um Projeto na OpenAI

1. No topo da plataforma, clique em `Project Default` ou no nome da organização. (é preciso fazer login)
2. Selecione **“Create Project”** e insira o nome do projeto.

---

### 2. Gerar uma Chave de API

1. Vá em **Dashboard > API Keys**.
2. Clique em **“Create new secret key”**.
3. Escolha a opção **Service Account**, defina um nome e selecione o projeto criado.
4. Copie a chave gerada — ela será exibida **apenas uma vez**.

> Exemplo (NÃO compartilhe sua chave real):
>
> `sk-svcacct-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### 3. Configurar a Chave no Projeto

Crie ou edite o arquivo `.env` na raiz do seu backend:

```env
OPENAI_API_KEY=sk-svcacct-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 4. Instalar a Biblioteca da OpenAI

Instale o SDK oficial:

```bash
npm install openai
```

---

### 5. Criar Serviço de Transcrição

Crie a pasta `services` (caso ainda não exista) e o arquivo `ai.ts` com o seguinte conteúdo:

```ts
// services/ai.ts
import OpenAI, { toFile } from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(file: Buffer) {
  const transcription = await client.audio.transcriptions.create({
    model: 'whisper-1',
    language: 'pt',
    response_format: 'text',
    file: await toFile(file, 'audio.m4a', { type: 'audio/m4a' }),
  });

  return transcription;
}
```

---

### 6. Exemplo de Uso

```ts
import fs from 'fs';
import { transcribeAudio } from './services/ai';

async function main() {
  const audioBuffer = fs.readFileSync('./uploads/audio.m4a');
  const result = await transcribeAudio(audioBuffer);
  console.log('Transcrição:', result);
}

main();
```

---

## Boas Práticas

* Nunca exponha sua chave da OpenAI em código versionado.
* Use bibliotecas como `dotenv` para carregar as variáveis de ambiente com segurança:

```bash
npm install dotenv
```

No seu `index.ts`:

```ts
import 'dotenv/config';
```

