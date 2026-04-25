export const theme = {
  colors: {
    primary: '#0F172A',
    primaryDark: '#020617',
    primaryLight: '#DBEAFE',
    background: '#F8FBFF',
    surface: '#FFFFFF',
    text: '#0F172A',
    muted: '#64748B',
    border: '#D6E4F0',
    error: '#EF4444',
    success: '#16A34A',
    successLight: '#ECFDF5',
    white: '#FFFFFF',
    tabInactive: '#94A3B8',
  },
  typography: {
    title: 28,
    subtitle: 20,
    body: 16,
    caption: 13,
    small: 12,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 18,
    pill: 999,
  },
};

export type Theme = typeof theme;
