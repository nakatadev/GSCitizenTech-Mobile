import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes, fontWeights, spacing } from '../theme';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm },
  title: { fontSize: fontSizes.body, fontWeight: fontWeights.bold, color: colors.text },
});
