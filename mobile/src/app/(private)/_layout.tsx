import { Stack } from 'expo-router';
// esse componente é usado para definir a estrutura de navegação da aplicação
// a função headerShow desabilita o cabeçalho padrão do Expo Router
export default function Layout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
