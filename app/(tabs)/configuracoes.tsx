import { Ionicons } from '@expo/vector-icons';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/src/constants/theme';
import { useAuth } from '@/src/contexts/AuthContext';

export default function ConfiguracoesScreen() {
  const { user, logout } = useAuth();
  const initial = user?.nome?.trim().charAt(0).toUpperCase() ?? 'U';

  function handleLogout() {
    Alert.alert('Sair da conta', 'Tem certeza que deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Configurações</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>

          <View>
            <Text style={styles.profileName}>{user?.nome ?? 'Usuário'}</Text>
            <Text style={styles.profileEmail}>{user?.email ?? 'sem-email@proestoque.app'}</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          <MenuItem icon="notifications-outline" label="Notificações" />
          <MenuItem icon="help-circle-outline" label="Ajuda" />
        </View>

        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color={theme.colors.white} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={20} color={theme.colors.info} />
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
  },
  container: {
    flex: 1,
    gap: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    justifyContent: 'center',
    marginTop: 'auto',
    minHeight: 54,
  },
  logoutText: {
    color: theme.colors.white,
    fontSize: theme.typography.body,
    fontWeight: '800',
  },
  menuCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    alignItems: 'center',
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  menuLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: '600',
  },
  menuLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  profileEmail: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
    marginTop: theme.spacing.xs,
  },
  profileName: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: '800',
  },
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
  },
});
