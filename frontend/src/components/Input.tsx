import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { theme } from '@/src/constants/theme';

type InputProps = TextInputProps & {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  isPassword?: boolean;
};

export function Input({ label, icon, error, isPassword = false, style, ...props }: InputProps) {
  const [secure, setSecure] = useState(isPassword);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
        {icon ? <Ionicons name={icon} size={20} color={theme.colors.muted} /> : null}
        <TextInput
          placeholderTextColor={theme.colors.muted}
          secureTextEntry={secure}
          style={[styles.input, style]}
          {...props}
        />
        {isPassword ? (
          <Pressable
            accessibilityLabel={secure ? 'Mostrar senha' : 'Ocultar senha'}
            hitSlop={10}
            onPress={() => setSecure((current) => !current)}>
            <Ionicons
              name={secure ? 'eye-outline' : 'eye-off-outline'}
              size={21}
              color={theme.colors.muted}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.typography.small,
    fontWeight: '600',
  },
  input: {
    color: theme.colors.text,
    flex: 1,
    fontSize: theme.typography.body,
    paddingVertical: 0,
  },
  inputWrapper: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    minHeight: 54,
    paddingHorizontal: theme.spacing.md,
  },
  inputWrapperError: {
    borderColor: theme.colors.error,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.typography.caption,
    fontWeight: '700',
  },
});
