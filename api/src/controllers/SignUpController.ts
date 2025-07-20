import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import z from 'zod';
import { db } from '../db';
import { usersTable } from '../db/schema';
import { calculateGoals } from '../lib/calculateGoals';
import { signAccessTokenFor } from '../lib/jwt';
import { HttpRequest, HttpResponse } from '../types/Http';
import { badRequest, conflict, created } from '../utils/http';


// Schema de validação com o Zod
// Garante que os dados do signup estão no formato esperado antes de ir pro banco
// Ajuda a evitar erros, falhas de segurança e ataques maliciosos (ex: SQL injection)
const schema = z.object({
  goal: z.enum(['lose', 'maintain', 'gain']),
  gender: z.enum(['male', 'female']),
  birthDate: z.iso.date(), // ISO = formato de data como "YYYY-MM-DD"
  height: z.number(),
  weight: z.number(),
  activityLevel: z.number().min(1).max(5), // nível de atividade física de 1 a 5
  account: z.object({
    name: z.string().min(1),
    email: z.email(), // valida formato do email
    password: z.string().min(8), // força senha com no mínimo 8 caracteres
  }),
});

// Controller responsável pelo cadastro do usuário (padrão REST)
// Pode ser usado como handler direto em uma função AWS Lambda
export class SignUpController {
  // método assíncrono que trata a requisição de signup
  static async handle({ body }: HttpRequest): Promise<HttpResponse> {
    // faz o parse dos dados recebidos com o schema zod
    const { success, error, data } = schema.safeParse(body);

    // se houver erro de validação, retorna 400 (Bad Request) com os detalhes
    if (!success) {
      return badRequest({ errors: error.issues });
    }

    // verifica se já existe um usuário com o mesmo e-mail cadastrado
    const userAlreadyExists = await db.query.usersTable.findFirst({
      columns: {
        email: true,
      },
      where: eq(usersTable.email, data.account.email),
    });

    // se o email já estiver em uso, retorna 409 (Conflict)
    if (userAlreadyExists) {
      return conflict({ error: 'This email is already in use.' });
    }

    // separa os dados da conta dos demais dados de perfil
    const { account, ...rest } = data;

    // calcula as metas calóricas com base nas informações do perfil
    const goals = calculateGoals({
      activityLevel: rest.activityLevel,
      birthDate: new Date(rest.birthDate),
      gender: rest.gender,
      goal: rest.goal,
      height: rest.height,
      weight: rest.weight,
    });

    // criptografa a senha do usuário com 8 rounds de salt
    const hashedPassword = await hash(account.password, 8);

    // insere os dados no banco de forma segura (ORM previne SQL injection)
    // .returning() permite obter imediatamente o ID do novo usuário criado
    const [user] = await db
      .insert(usersTable)
      .values({
        ...account,
        ...rest,
        ...goals,
        password: hashedPassword,
      })
      .returning({
        id: usersTable.id,
      });

    // gera um token de acesso JWT assinado com o ID do novo usuário
    const accessToken = signAccessTokenFor(user.id);

    // retorna 201 (Created) com o token de acesso
    return created({ accessToken });
  }
}
