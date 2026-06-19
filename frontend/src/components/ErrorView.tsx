import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/src/constants/theme';

type ErrorViewProps = {
  mensagem: string;
  onRetry?: () => void;
};

export function ErrorView({ mensagem, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <Ionicons name="cloud-offline-outline" color={theme.colors.error} size={28} />
      </View>
      <Text style={styles.title}>Algo deu errado</Text>
      <Text style={styles.message}>{mensagem}</Text>

      {onRetry ? (
        <Pressable onPress={onRetry} style={styles.button}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.caption,
    fontWeight: '800',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: theme.colors.errorLight,
    borderRadius: theme.radius.pill,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  message: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    marginTop: theme.spacing.md,
  },
});
