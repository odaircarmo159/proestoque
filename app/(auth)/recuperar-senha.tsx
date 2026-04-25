import { Ionicons } from '@expo/vector-icons';
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

export default function RecuperarSenhaScreen() {
  const [enviado, setEnviado] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}>
        <View style={styles.container}>
          <LogoProEstoque size="sm" />

          <View style={styles.header}>
            <Text style={styles.title}>Recuperar senha</Text>
            <Text style={styles.description}>
              Informe seu e-mail e enviaremos um link de recuperação
            </Text>
          </View>

          {enviado ? (
            <View style={styles.successBox}>
              <Ionicons name="mail-open-outline" size={44} color={theme.colors.success} />
              <Text style={styles.successTitle}>E-mail enviado!</Text>
              <Text style={styles.successText}>Verifique sua caixa de entrada.</Text>
            </View>
          ) : (
            <View style={styles.form}>
              <Input
                autoCapitalize="none"
                icon="mail-outline"
                keyboardType="email-address"
                label="E-mail"
                placeholder="joao@email.com"
              />
              <Button fullWidth title="Enviar" onPress={() => setEnviado(true)} />
            </View>
          )}

          <Link href="./login" asChild>
            <Pressable style={styles.backButton}>
              <Text style={styles.backText}>Voltar ao Login</Text>
            </Pressable>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    minHeight: 54,
  },
  backText: {
    color: theme.colors.primary,
    fontSize: theme.typography.body,
    fontWeight: '800',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  description: {
    color: theme.colors.muted,
    fontSize: theme.typography.body,
    lineHeight: 22,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
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
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  successBox: {
    alignItems: 'center',
    backgroundColor: theme.colors.successLight,
    borderColor: '#BBF7D0',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    padding: theme.spacing.xl,
  },
  successText: {
    color: theme.colors.success,
    fontSize: theme.typography.caption,
    marginTop: theme.spacing.xs,
  },
  successTitle: {
    color: theme.colors.success,
    fontSize: theme.typography.body,
    fontWeight: '800',
    marginTop: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
  },
});
