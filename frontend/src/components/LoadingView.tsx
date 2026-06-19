import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/src/constants/theme';

export function LoadingView({ mensagem = 'Carregando...' }: { mensagem?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.colors.primary} size="large" />
      <Text style={styles.text}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  text: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
    marginTop: theme.spacing.md,
  },
});
