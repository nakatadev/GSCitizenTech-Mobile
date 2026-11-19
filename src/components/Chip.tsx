import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSizes, fontWeights, radius, spacing, touchTarget } from '../theme';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

/** Botão de opção (seleção única), usado em categoria e urgência. */
export function Chip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected, checked: selected }}
      style={[styles.chip, selected && styles.selected]}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: touchTarget,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { fontSize: fontSizes.body, color: colors.text, fontWeight: fontWeights.medium },
  textSelected: { color: colors.white, fontWeight: fontWeights.bold },
});
