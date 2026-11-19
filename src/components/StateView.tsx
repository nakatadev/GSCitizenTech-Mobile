import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes, fontWeights, spacing } from '../theme';
import { Button } from './Button';

/** Tela de carregamento (anunciada pelo leitor de tela). */
export function LoadingState({ message = 'Carregando...' }: { message?: string }) {
  return (
    <View style={styles.container} accessible accessibilityLiveRegion="polite" accessibilityLabel={message}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

/** Tela de erro com botão para tentar de novo. */
export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.container} accessibilityLiveRegion="assertive">
      <Text style={styles.title} accessibilityRole="header">
        Não foi possível carregar
      </Text>
      <Text style={styles.text}>{message}</Text>
      <Button title="Tentar de novo" onPress={onRetry} accessibilityHint="Carrega a lista novamente" />
    </View>
  );
}

/** Lista vazia com explicação e (opcional) uma ação. */
export function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.text}>{message}</Text>
      {actionLabel && onAction ? <Button title={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.xl, alignItems: 'center', gap: spacing.md },
  title: { fontSize: fontSizes.subtitle, fontWeight: fontWeights.bold, color: colors.text, textAlign: 'center' },
  text: { fontSize: fontSizes.body, color: colors.textMuted, textAlign: 'center' },
});
