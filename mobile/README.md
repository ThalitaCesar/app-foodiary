# CLAUDE.md

Este arquivo fornece orientações para o Claude Code (claude.ai/code) ao trabalhar com o código deste repositório.

## Visão Geral do Projeto

Foodiary é um aplicativo de diário alimentar feito em React Native com Expo. Utiliza o expo-router para navegação com grupos de rotas para autenticação (rotas públicas/privadas), React Hook Form para manipulação de formulários, Zod para validação e NativeWind (Tailwind CSS) para estilização.

## Tecnologias Principais

- **Framework**: React Native com Expo (~53.0.20)
- **Navegação**: expo-router com rotas protegidas usando Stack.Protected
- **Estilização**: NativeWind (Tailwind CSS para React Native)
- **Formulários**: React Hook Form com validação Zod (@hookform/resolvers)
- **Fontes**: Família Host Grotesk com múltiplos pesos
- **Ícones**: Lucide React Native
- **Mídia**: expo-camera e expo-audio para captura de refeições

## Comandos de Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm start

# Executar em plataformas específicas
npm run android
npm run ios  
npm run web
```

## Arquitetura

### Fluxo de Autenticação
- As rotas são protegidas usando o componente `Stack.Protected` do expo-router
- `AuthContext` fornece o estado de autenticação (atualmente fixado como deslogado)
- Rotas privadas em `src/app/(private)/` exigem autenticação
- Rotas públicas em `src/app/(public)/` para login/cadastro

### Estrutura de Pastas
- `src/app/` - Páginas do expo-router com grupos de rotas
- `src/components/` - Componentes de UI reutilizáveis
- `src/contexts/` - Contextos React (AuthContext)
- `src/hooks/` - Hooks customizados (useAuth)
- `src/styles/` - Estilos globais e definições de cores
- `src/utils/` - Funções utilitárias (cn para mesclagem de classes)

### Componentes Principais
- **SignUpSteps/**: Fluxo de cadastro em múltiplas etapas com validação de formulário
- **AuthLayout**: Wrapper de layout para telas de autenticação
- **Componentes de Modal**: AudioModal, CameraModal para captura de mídia
- **Componentes de Refeição**: MealCard, MealsList, CreateMealBottomBar

### Manipulação de Formulários
Os formulários usam React Hook Form com schemas Zod para validação. O fluxo de cadastro demonstra esse padrão com o arquivo `signUpSchema.ts` definindo a estrutura do formulário.

### Sistema de Estilização
- Utiliza NativeWind com configuração customizada do Tailwind
- Famílias de fontes customizadas definidas em tailwind.config.js
- Sistema de cores em `src/styles/colors.ts`
- Função utilitária `cn()` para mesclagem condicional de classes

## Notas de Configuração

- TypeScript com modo estrito habilitado
- Nova arquitetura do Expo ativada
- Sem configuração de testes atualmente (sem scripts de teste no package.json)
- Sem configuração de linting na raiz do projeto