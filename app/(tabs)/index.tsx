import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/src/constants/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Olá, Usuário</Text>
        <Text style={styles.subtitle}>Visão geral do seu estoque</Text>

        <View style={styles.highlightCard}>
          <Text style={styles.highlightLabel}>Total em produtos</Text>
          <Text style={styles.highlightValue}>247</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.infoCard}>
            <Text style={styles.cardLabel}>Categorias</Text>
            <Text style={styles.cardValue}>12</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.cardLabel}>Alertas</Text>
            <Text style={[styles.cardValue, styles.alertValue]}>5</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  alertValue: {
    color: theme.colors.error,
  },
  cardLabel: {
    color: theme.colors.muted,
    fontSize: theme.typography.small,
    fontWeight: '600',
  },
  cardValue: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: '800',
    marginTop: theme.spacing.sm,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  highlightCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    marginTop: theme.spacing.xl,
    padding: theme.spacing.lg,
  },
  highlightLabel: {
    color: theme.colors.primaryLight,
    fontSize: theme.typography.caption,
    fontWeight: '600',
  },
  highlightValue: {
    color: theme.colors.white,
    fontSize: 44,
    fontWeight: '800',
    marginTop: theme.spacing.xs,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flex: 1,
    minHeight: 110,
    padding: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.body,
    marginTop: theme.spacing.xs,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
  },
});
