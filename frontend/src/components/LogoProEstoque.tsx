import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/src/constants/theme';

type LogoProEstoqueProps = {
  size?: 'sm' | 'md' | 'lg';
};

const sizes = {
  sm: { box: 42, icon: 22, title: 22, subtitle: 11 },
  md: { box: 54, icon: 28, title: 26, subtitle: 13 },
  lg: { box: 68, icon: 36, title: 32, subtitle: 15 },
};

export function LogoProEstoque({ size = 'md' }: LogoProEstoqueProps) {
  const current = sizes[size];

  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { height: current.box, width: current.box }]}>
        <Ionicons name="cube-outline" size={current.icon} color={theme.colors.white} />
      </View>
      <Text style={[styles.title, { fontSize: current.title }]}>ProEstoque</Text>
      <Text style={[styles.subtitle, { fontSize: current.subtitle }]}>
        Controle simples para seu estoque
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
  },
  subtitle: {
    color: theme.colors.muted,
    fontWeight: '500',
    marginTop: theme.spacing.xs,
  },
  title: {
    color: theme.colors.text,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
});
