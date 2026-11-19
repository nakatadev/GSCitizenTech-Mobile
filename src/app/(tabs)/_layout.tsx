import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors, fontSizes, fontWeights } from '../../theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const tab = (title: string, icon: IconName, iconOff: IconName) => ({
  title,
  tabBarAccessibilityLabel: `Aba ${title}`,
  tabBarIcon: ({ color, focused, size }: { color: unknown; focused: boolean; size: number }) => (
    <Ionicons name={focused ? icon : iconOff} size={size + 2} color={color as string} />
  ),
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontSize: fontSizes.subtitle, fontWeight: fontWeights.bold },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: fontSizes.small, fontWeight: fontWeights.bold },
        tabBarStyle: { height: 76, paddingBottom: 12, paddingTop: 8, backgroundColor: colors.surface },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ ...tab('Risco', 'shield-checkmark', 'shield-checkmark-outline'), headerTitle: 'Guardião' }} />
      <Tabs.Screen name="sos" options={{ ...tab('SOS', 'alert-circle', 'alert-circle-outline'), headerTitle: 'Pedir socorro' }} />
      <Tabs.Screen name="historico" options={{ ...tab('Histórico', 'time', 'time-outline'), headerTitle: 'Minhas ocorrências' }} />
      <Tabs.Screen name="contatos" options={{ ...tab('Contatos', 'people', 'people-outline'), headerTitle: 'Contatos e perfil' }} />
    </Tabs>
  );
}
