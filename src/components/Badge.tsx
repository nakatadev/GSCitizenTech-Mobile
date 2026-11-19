import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes, fontWeights, radius, spacing } from '../theme';

type Tone = 'neutral' | 'success' | 'warning' | 'danger';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: colors.primaryLight, fg: colors.primaryDark },
  success: { bg: colors.successLight, fg: colors.success },
  warning: { bg: colors.warningLight, fg: colors.warning },
  danger: { bg: colors.dangerLight, fg: colors.danger },
};

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  return (
    <View style={[styles.badge, { backgroundColor: TONES[tone].bg }]} accessible accessibilityLabel={label}>
      <Text style={[styles.text, { color: TONES[tone].fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  text: { fontSize: fontSizes.small, fontWeight: fontWeights.bold },
});
