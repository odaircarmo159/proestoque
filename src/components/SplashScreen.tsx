import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { LogoProEstoque } from '@/src/components/LogoProEstoque';
import { theme } from '@/src/constants/theme';

export function SplashScreen() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0.2,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [progress]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['20%', '100%'],
  });

  return (
    <View style={styles.container}>
      <LogoProEstoque size="lg" />
      <Text style={styles.subtitle}>Preparando seu estoque com segurança</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.bar, { width }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: theme.colors.info,
    borderRadius: theme.radius.pill,
    height: '100%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.body,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  track: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.pill,
    height: 10,
    marginTop: theme.spacing.xl,
    overflow: 'hidden',
    width: 180,
  },
});
