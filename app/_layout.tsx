import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { SplashScreen } from '@/src/components/SplashScreen';
import { theme } from '@/src/constants/theme';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { ProductsProvider } from '@/src/contexts/ProductsContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <NavigationGuard />
        <StatusBar style="dark" />
      </ProductsProvider>
    </AuthProvider>
  );
}

function NavigationGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login' as never);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)' as never);
    }
  }, [isAuthenticated, isLoading, router, segments]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
});
