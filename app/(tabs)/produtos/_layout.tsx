import { Stack } from 'expo-router';

import { theme } from '@/src/constants/theme';

export default function ProdutosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTitleStyle: {
          color: theme.colors.text,
          fontWeight: '800',
        },
        headerTintColor: theme.colors.primary,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}>
      <Stack.Screen name="index" options={{ title: 'Produtos' }} />
      <Stack.Screen name="novo" options={{ title: 'Novo Produto' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar Produto' }} />
    </Stack>
  );
}
