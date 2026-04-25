import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import { LogoProEstoque } from '@/src/components/LogoProEstoque';
import { theme } from '@/src/constants/theme';

export default function CadastroScreen() {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const senhasDiferentes = confirmarSenha.length > 0 && senha !== confirmarSenha;

  function handleCriarConta() {
    if (senhasDiferentes) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/(tabs)');
    }, 2000);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <LogoProEstoque size="sm" />

          <View style={styles.header}>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Preencha seus dados para começar.</Text>
          </View>

          <View style={styles.form}>
            <Input icon="person-outline" label="Nome" placeholder="João Silva" />
            <Input
              autoCapitalize="none"
              icon="mail-outline"
              keyboardType="email-address"
              label="E-mail"
              placeholder="joao@email.com"
            />
            <Input
              icon="lock-closed-outline"
              isPassword
              label="Senha"
              onChangeText={setSenha}
              placeholder="********"
              value={senha}
            />
            <Input
              error={senhasDiferentes ? 'As senhas não coincidem' : undefined}
              icon="lock-closed-outline"
              isPassword
              label="Confirmar senha"
              onChangeText={setConfirmarSenha}
              placeholder="********"
              value={confirmarSenha}
            />

            <Button fullWidth loading={loading} title="Criar Conta" onPress={handleCriarConta} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tenho conta?</Text>
            <Link href="./login" asChild>
              <Pressable>
                <Text style={styles.link}>Entrar</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  footerText: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
  },
  form: {
    gap: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  keyboard: {
    flex: 1,
  },
  link: {
    color: theme.colors.primary,
    fontSize: theme.typography.caption,
    fontWeight: '800',
  },
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
    marginTop: theme.spacing.xs,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
  },
});
