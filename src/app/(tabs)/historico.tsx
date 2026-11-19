import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { EmptyState, ErrorState, LoadingState } from '../../components/StateView';
import { formatDataHora, STATUS_LABEL, STATUS_TOM, TIPO_LABEL } from '../../data/labels';
import { listarOcorrencias } from '../../database/ocorrenciasRepository';
import { useAsync } from '../../hooks/useAsync';
import { colors, fontSizes, fontWeights, spacing } from '../../theme';

export default function HistoricoScreen() {
  const router = useRouter();
  const { status, data, error, reload } = useAsync(listarOcorrencias);

  // Atualiza a lista sempre que a aba é aberta.
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  if (status === 'loading' && !data) return <LoadingState message="Carregando seu histórico..." />;
  if (status === 'error') return <ErrorState message={error} onRetry={reload} />;

  return (
    <FlatList
      data={data ?? []}
      keyExtractor={(o) => String(o.id)}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <EmptyState
          title="Nenhuma ocorrência ainda"
          message="Quando você pedir socorro ou a caixinha detectar uma queda, o registro aparece aqui."
          actionLabel="Ir para o SOS"
          onAction={() => router.push('/sos')}
        />
      }
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      renderItem={({ item }) => (
        <Card
          onPress={() => router.push({ pathname: '/ocorrencia/[id]', params: { id: String(item.id) } })}
          accessibilityLabel={`${TIPO_LABEL[item.tipo]}. ${formatDataHora(item.dataHora)}. ${STATUS_LABEL[item.status]}.`}
          accessibilityHint="Abre os detalhes"
        >
          <Text style={styles.titulo}>{TIPO_LABEL[item.tipo]}</Text>
          <Text style={styles.data}>{formatDataHora(item.dataHora)}</Text>
          <Badge label={STATUS_LABEL[item.status]} tone={STATUS_TOM[item.status]} />
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, paddingBottom: spacing.xl },
  titulo: { fontSize: fontSizes.subtitle, fontWeight: fontWeights.bold, color: colors.text },
  data: { fontSize: fontSizes.body, color: colors.textMuted },
});
