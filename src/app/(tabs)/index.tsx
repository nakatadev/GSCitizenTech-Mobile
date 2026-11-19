import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { DemoPanel } from '../../components/DemoPanel';
import { EmptyState, ErrorState, LoadingState } from '../../components/StateView';
import { HORARIOS, NIVEL_LABEL, NIVEL_TOM } from '../../data/labels';
import { useAsync } from '../../hooks/useAsync';
import { POSICAO_PADRAO } from '../../services/localizacaoService';
import { buscarZonasRisco } from '../../services/zonasRiscoService';
import { colors, fontSizes, fontWeights, spacing } from '../../theme';

export default function RiscoScreen() {
  const [horario, setHorario] = useState<number | 'agora'>('agora');
  const [tick, setTick] = useState(0);
  const hora = horario === 'agora' ? new Date().getHours() : horario;

  const { status, data, error, reload } = useAsync(
    () => buscarZonasRisco(POSICAO_PADRAO.latitude, POSICAO_PADRAO.longitude, hora),
    [hora, tick],
  );

  const header = (
    <View style={styles.header}>
      <Text style={styles.intro}>
        Veja onde o risco é maior em São Paulo antes de sair para a entrega.
      </Text>
      <Text style={styles.label} accessibilityRole="header">
        Em qual horário você vai rodar?
      </Text>
      <View style={styles.chips} accessibilityRole="radiogroup">
        {HORARIOS.map((h) => (
          <Chip key={h.label} label={h.label} selected={h.hora === horario} onPress={() => setHorario(h.hora)} />
        ))}
      </View>
    </View>
  );

  const demo = <DemoPanel onChange={() => setTick((t) => t + 1)} />;

  if (status === 'loading') return <LoadingState message="Calculando o risco das regiões..." />;
  if (status === 'error')
    return (
      <View style={{ padding: spacing.md }}>
        <ErrorState message={error} onRetry={reload} />
        {demo}
      </View>
    );

  return (
    <FlatList
      data={data ?? []}
      keyExtractor={(z) => String(z.id)}
      contentContainerStyle={styles.list}
      refreshing={false}
      onRefresh={reload}
      ListHeaderComponent={header}
      ListFooterComponent={demo}
      ListEmptyComponent={
        <EmptyState
          title="Sem dados de risco agora"
          message="Não encontramos regiões para esse horário. Tente outro horário."
        />
      }
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      renderItem={({ item }) => {
        const pct = Math.round(item.score * 100);
        return (
          <Card>
            <View accessible accessibilityLabel={`${item.nome}. ${NIVEL_LABEL[item.nivel]}, ${pct} por cento.`}>
              <Text style={styles.nome}>{item.nome}</Text>
              <View style={styles.row}>
                <Badge label={NIVEL_LABEL[item.nivel]} tone={NIVEL_TOM[item.nivel]} />
                <Text style={styles.score}>{pct}% de risco</Text>
              </View>
              <View style={styles.barra}>
                <View style={[styles.barraFill, { width: `${pct}%` }]} />
              </View>
            </View>
          </Card>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  header: { gap: spacing.sm, marginBottom: spacing.md },
  intro: { fontSize: fontSizes.body, color: colors.text },
  label: { fontSize: fontSizes.body, fontWeight: fontWeights.bold, color: colors.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  nome: { fontSize: fontSizes.subtitle, fontWeight: fontWeights.bold, color: colors.text, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  score: { fontSize: fontSizes.body, color: colors.textMuted, fontWeight: fontWeights.medium },
  barra: { height: 10, borderRadius: 5, backgroundColor: colors.border, marginTop: spacing.sm, overflow: 'hidden' },
  barraFill: { height: 10, backgroundColor: colors.primary },
});
