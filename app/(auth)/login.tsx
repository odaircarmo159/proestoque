import { Link } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import { LogoProEstoque } from '@/src/components/LogoProEstoque';
import { theme } from '@/src/constants/theme';
import { useAuth } from '@/src/contexts/AuthContext';

export default function LoginScreen() {
  const { isLoading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}>
        <View style={styles.container}>
          <LogoProEstoque size="md" />

          <View style={styles.form}>
            <Input
              autoCapitalize="none"
              autoComplete="email"
              icon="mail-outline"
              keyboardType="email-address"
              label="E-mail"
              onChangeText={setEmail}
              placeholder="joao@email.com"
              value={email}
            />
            <Input
              autoCapitalize="none"
              icon="lock-closed-outline"
              isPassword
              label="Senha"
              onChangeText={setSenha}
              placeholder="********"
              value={senha}
            />

            <Link href="./recuperar-senha" asChild>
              <Pressable style={styles.forgotButton}>
                <Text style={styles.link}>Esqueci minha senha</Text>
              </Pressable>
            </Link>

            <Button
              fullWidth
              loading={isLoading}
              title="Entrar"
              onPress={() => login(email.trim(), senha)}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem conta?</Text>
            <Link href="./cadastro" asChild>
              <Pressable>
                <Text style={[styles.link, styles.footerLink]}>Criar conta</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  footerLink: {
    fontWeight: '800',
  },
  footerText: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
  },
  forgotButton: {
    alignSelf: 'center',
    paddingVertical: theme.spacing.sm,
  },
  form: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  keyboard: {
    flex: 1,
  },
  link: {
    color: theme.colors.primary,
    fontSize: theme.typography.caption,
    fontWeight: '700',
  },
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
});
