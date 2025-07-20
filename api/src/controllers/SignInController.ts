import { compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { usersTable } from '../db/schema';

// Função responsável por gerar o token JWT de acesso
import { signAccessTokenFor } from '../lib/jwt';

// Tipagens utilizadas para requisição e resposta HTTP
import { HttpRequest, HttpResponse } from '../types/Http';

// Helpers para retornar respostas HTTP padronizadas
import { badRequest, ok, unauthorized } from '../utils/http';

// Schema de validação dos dados recebidos na requisição
// Valida que o email é válido e que a senha tem no mínimo 8 caracteres
const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

// Controller responsável por autenticar o usuário
export class SignInController {
  // Método handle executa o fluxo de login
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    // Valida os dados recebidos com o schema do Zod
    const { success, error, data } = schema.safeParse(body);

    // Se os dados forem inválidos, retorna 400 com os erros
    if (!success) {
      return badRequest({ errors: error.issues });
    }

    // Busca no banco de dados o usuário com o email informado
    const user = await db.query.usersTable.findFirst({
      columns: {
        id: true,
        email: true,
        password: true,
      },
      where: eq(usersTable.email, data.email),
    });

    // Se não encontrar o usuário, retorna 401 (credenciais inválidas)
    if (!user) {
      return unauthorized({ error: 'Invalid credentials.' });
    }

    // Compara a senha recebida com a senha criptografada no banco
    const isPasswordValid = await compare(data.password, user.password);

    // Se a senha estiver incorreta, retorna 401
    if (!isPasswordValid) {
      return unauthorized({ error: 'Invalid credentials.' });
    }

    // Gera o token JWT com o ID do usuário
    const accessToken = signAccessTokenFor(user.id);

    // Retorna 200 OK com o token de acesso
    return ok({ accessToken });
  }
}
