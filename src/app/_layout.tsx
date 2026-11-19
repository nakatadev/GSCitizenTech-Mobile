import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, fontSizes, fontWeights } from '../theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { fontSize: fontSizes.subtitle, fontWeight: fontWeights.bold },
          contentStyle: { backgroundColor: colors.background },
          headerBackTitle: 'Voltar',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="ocorrencia/[id]" options={{ title: 'Detalhe da ocorrência' }} />
      </Stack>
    </>
  );
}
