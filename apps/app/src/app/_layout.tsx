import {
  Baloo2_600SemiBold,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/baloo-2';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { SettingsProvider } from '@/hooks/use-settings';

SplashScreen.preventAutoHideAsync();

const AUTH_ROUTES = new Set(['sign-up', 'log-in']);

function AuthGate({ ready, children }: { ready: boolean; children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const allReady = ready && !loading;

  useEffect(() => {
    if (!allReady) return;
    SplashScreen.hideAsync();

    const onAuthRoute = AUTH_ROUTES.has(segments[0] ?? '');
    if (!session && !onAuthRoute) router.replace('/sign-up');
    else if (session && onAuthRoute) router.replace('/');
  }, [allReady, session, segments, router]);

  if (!allReady) return null;
  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
  });

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <SettingsProvider>
        <AuthProvider>
          <AuthGate ready={fontsLoaded}>
            <Stack screenOptions={{ headerShown: false }} />
          </AuthGate>
        </AuthProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
