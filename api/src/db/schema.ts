import {
  date,
  integer,
  json,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core';

// Tabela de usuários com dados pessoais e metas nutricionais
export const usersTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(), // UUID gerado automaticamente
  name: varchar({ length: 255 }).notNull(), // nome obrigatório
  email: varchar({ length: 255 }).notNull().unique(), // e-mail único e obrigatório
  password: varchar({ length: 255 }).notNull(), // senha criptografada

  // dados do perfil nutricional
  goal: varchar({ length: 8 }).notNull(), // objetivo: lose, maintain ou gain
  gender: varchar({ length: 6 }).notNull(), // male ou female
  birthDate: date('birth_date').notNull(),
  height: integer().notNull(), // altura em cm
  weight: integer().notNull(), // peso em kg
  activityLevel: integer('activity_level').notNull(), // nível de atividade física (1 a 5)

  // campos calculados com base no perfil
  calories: integer().notNull(),
  proteins: integer().notNull(),
  carbohydrates: integer().notNull(),
  fats: integer().notNull(),
});

// Enum para status de processamento da refeição
// usado no campo status da tabela `meals`
export const mealStatus = pgEnum('meal_status', [
  'uploading',   // arquivo sendo enviado
  'processing',  // IA está processando
  'success',     // análise concluída com sucesso
  'failed'       // houve erro no processamento
]);

// Enum para o tipo de input da refeição que pode ser foto ou áudio
export const mealInputType = pgEnum('meal_input_type', [
  'audio', 'picture'
]);

// Tabela de refeições do usuário
export const mealsTable = pgTable('meals', {
  id: uuid().primaryKey().defaultRandom(),

  // referência para o usuário dono da refeição
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
    // se o usuário for deletado, todas as refeições dele também serão apagadas

  status: mealStatus().notNull(),               // status da análise (enum)
  inputType: mealInputType('input_type').notNull(), // tipo do input: foto ou áudio
  inputFileKey: varchar('input_file_key', { length: 255 }).notNull(), // chave do S3 (arquivo enviado)
  name: varchar({ length: 255 }).notNull(),     // nome da refeição (ex: "almoço", "café da manhã")
  icon: varchar({ length: 100 }).notNull(),     // emoji ou ícone associado
  foods: json(),                                // resultado da análise da IA com os alimentos detectados
  createdAt: timestamp('created_at')            // data de criação
    .notNull()
    .defaultNow(),                              // valor padrão: timestamp atual
});
