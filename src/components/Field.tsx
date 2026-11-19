import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, fontSizes, fontWeights, radius, spacing, touchTarget } from '../theme';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

/** Campo de texto com rótulo visível, mensagem de erro e acessibilidade. */
export function Field({ label, error, style, ...rest }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...rest}
        accessibilityLabel={label}
        accessibilityHint={error}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, !!error && styles.inputError, style]}
      />
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { fontSize: fontSizes.body, fontWeight: fontWeights.bold, color: colors.text },
  input: {
    minHeight: touchTarget,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSizes.body,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: fontSizes.small, fontWeight: fontWeights.medium },
});
