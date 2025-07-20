import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';
// O banco de dados é postegreSQL por meio do neon, evitar criação de excesso de lambdas do aws (e recursos)
// gerencia conexões dentro dele (neon) e só chama o banco de dados na requisição http. 
// Evita o erro comum de "too many connections" no PostgreSQL, já que não mantém conexões abertas entre execuções.
// a conexão com o neon é feita por meio da lib drizzle (Um ORM moderno, seguro e com tipagem nativa )
// a exclamação serve para dizer que sempre tem um valor ai dentro. 
export const db = drizzle(process.env.DATABASE_URL!, { schema });