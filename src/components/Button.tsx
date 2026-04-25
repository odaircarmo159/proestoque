import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { theme } from '@/src/constants/theme';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'outline';
  style?: ViewStyle;
};

export function Button({
  title,
  onPress,
  loading = false,
  fullWidth = false,
  variant = 'primary',
  style,
}: ButtonProps) {
  const isOutline = variant === 'outline';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        fullWidth && styles.fullWidth,
        isOutline && styles.outline,
        pressed && styles.pressed,
        loading && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={isOutline ? theme.colors.primary : theme.colors.white} />
      ) : (
        <Text style={[styles.title, isOutline && styles.outlineTitle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: theme.spacing.lg,
  },
  disabled: {
    opacity: 0.75,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  outlineTitle: {
    color: theme.colors.primary,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  title: {
    color: theme.colors.white,
    fontSize: theme.typography.body,
    fontWeight: '700',
  },
});
