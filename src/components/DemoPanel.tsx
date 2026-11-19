import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { demo } from '../services/demo';
import { colors, fontSizes, fontWeights, spacing } from '../theme';

/** Modo demonstração: simula falhas para mostrar os estados do app no vídeo. */
export function DemoPanel({ onChange }: { onChange?: () => void }) {
  const [semInternet, setSemInternet] = useState(demo.semInternet);
  const [listaVazia, setListaVazia] = useState(demo.listaVazia);

  return (
    <View style={styles.box}>
      <Text style={styles.title} accessibilityRole="header">
        Modo demonstração
      </Text>
      <View style={styles.row}>
        <Text style={styles.text}>Simular falta de internet</Text>
        <Switch
          value={semInternet}
          accessibilityLabel="Simular falta de internet"
          trackColor={{ true: colors.primary, false: colors.border }}
          onValueChange={(v) => {
            demo.semInternet = v;
            setSemInternet(v);
            onChange?.();
          }}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Simular lista de risco vazia</Text>
        <Switch
          value={listaVazia}
          accessibilityLabel="Simular lista de risco vazia"
          trackColor={{ true: colors.primary, false: colors.border }}
          onValueChange={(v) => {
            demo.listaVazia = v;
            setListaVazia(v);
            onChange?.();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { marginTop: spacing.xl, paddingTop: spacing.md, gap: spacing.sm, borderTopWidth: 1, borderColor: colors.border },
  title: { fontSize: fontSizes.body, fontWeight: fontWeights.bold, color: colors.text },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48 },
  text: { flex: 1, fontSize: fontSizes.body, color: colors.text },
});
