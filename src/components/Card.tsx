import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

interface Props {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function Card({ children, onPress, accessibilityLabel, accessibilityHint }: Props) {
  if (!onPress) {
    return <View style={styles.card}>{children}</View>;
  }
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { backgroundColor: colors.primaryLight },
});
