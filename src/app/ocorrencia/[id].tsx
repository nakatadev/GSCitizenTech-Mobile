import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { avisar, confirmar } from '../../utils/dialogs';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { EmptyState, ErrorState, LoadingState } from '../../components/StateView';
import { formatDataHora, STATUS_LABEL, STATUS_TOM, TIPO_LABEL } from '../../data/labels';
import { listarContatos } from '../../database/contatosRepository';
import { atualizarStatus, buscarOcorrencia } from '../../database/ocorrenciasRepository';
import { useAsync } from '../../hooks/useAsync';
import { cancelarOcorrenciaRemota, enviarOcorrencia } from '../../services/ocorrenciasService';
import { colors, fontSizes, fontWeights, radius, spacing } from '../../theme';

export default function OcorrenciaDetalhe() {
  const { id, novo } = useLocalSearchParams<{ id: string; novo?: string }>();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const { status, data, error, reload } = useAsync(async () => {
    const o = await buscarOcorrencia(Number(id));
    const contatos = await listarContatos();
    return { o, contatos };
  }, [id]);

  if (status === 'loading') return <LoadingState message="Carregando ocorrência..." />;
  if (status === 'error') return <ErrorState message={error} onRetry={reload} />;
  const o = data?.o;
  if (!o)
    return <EmptyState title="Ocorrência não encontrada" message="Ela pode ter sido removida." actionLabel="Ver histórico" onAction={() => router.replace('/historico')} />;

  const segundos = o.tempoAvisoMs != null ? (o.tempoAvisoMs / 1000).toFixed(1).replace('.', ',') : null;

  const cancelar = () =>
    confirmar(
      'Cancelar alarme?',
      'Use apenas se foi engano. Seus contatos serão avisados que está tudo bem.',
      'Sim, foi engano',
      async () => {
        setBusy(true);
        try {
          if (o.remoteId) await cancelarOcorrenciaRemota(o.remoteId);
          await atualizarStatus(o.id, 'CANCELADA');
          reload();
        } catch (e) {
          avisar('Não foi possível cancelar', e instanceof Error ? e.message : 'Tente de novo.');
        } finally {
          setBusy(false);
        }
      },
    );

  const reenviar = async () => {
    setBusy(true);
    const t0 = Date.now();
    try {
      const remoteId = await enviarOcorrencia({
        dispositivoId: o.dispositivoId,
        tipo: o.tipo,
        latitude: o.latitude,
        longitude: o.longitude,
        intensidadeG: o.intensidadeG,
        dataHora: o.dataHora,
      });
      await atualizarStatus(o.id, 'ENVIADA', remoteId, Date.now() - t0);
      reload();
    } catch (e) {
      avisar('Ainda sem conexão',e instanceof Error ? e.message : 'Tente de novo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {novo && o.status === 'ENVIADA' ? (
        <View style={[styles.faixa, { backgroundColor: colors.successLight }]} accessible accessibilityLiveRegion="polite">
          <Ionicons name="checkmark-circle" size={28} color={colors.success} />
          <Text style={[styles.faixaTexto, { color: colors.success }]}>
            Pedido enviado{segundos ? ` em ${segundos} s` : ''}. Seus contatos estão sendo avisados.
          </Text>
        </View>
      ) : null}
      {novo && o.status === 'PENDENTE' ? (
        <View style={[styles.faixa, { backgroundColor: colors.dangerLight }]} accessible accessibilityLiveRegion="assertive">
          <Ionicons name="cloud-offline" size={28} color={colors.danger} />
          <Text style={[styles.faixaTexto, { color: colors.danger }]}>
            Sem internet: o pedido foi salvo no celular, mas ainda NÃO foi enviado. Ligue 192 (SAMU) se for grave.
          </Text>
        </View>
      ) : null}

      <Text style={styles.titulo} accessibilityRole="header">
        {TIPO_LABEL[o.tipo]}
      </Text>
      <Badge label={STATUS_LABEL[o.status]} tone={STATUS_TOM[o.status]} />

      <Text style={styles.label}>Quando</Text>
      <Text style={styles.texto}>{formatDataHora(o.dataHora)}</Text>

      <Text style={styles.label}>Onde</Text>
      <Text style={styles.texto}>
        {o.latitude.toFixed(4)}, {o.longitude.toFixed(4)}
      </Text>

      <Text style={styles.label}>Tempo até o aviso</Text>
      <Text style={styles.texto}>
        {segundos ? `${segundos} segundos (meta: menos de 30 s)` : 'Ainda não enviado'}
      </Text>

      <Text style={styles.label}>Quem é avisado</Text>
      <Text style={styles.texto}>
        {data!.contatos.length === 0
          ? 'Nenhum contato cadastrado.'
          : data!.contatos.map((c) => `${c.nome} (${c.parentesco})`).join(', ')}
      </Text>

      <View style={{ height: spacing.md }} />
      {o.status === 'ENVIADA' ? (
        <Button title="Foi engano — cancelar alarme" variant="secondary" onPress={cancelar} disabled={busy} accessibilityHint="Avisa seus contatos que está tudo bem" />
      ) : null}
      {o.status === 'PENDENTE' ? (
        <Button title="Tentar enviar de novo" onPress={reenviar} disabled={busy} />
      ) : null}
      <Button title="Ver histórico" variant="secondary" onPress={() => router.replace('/historico')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xl },
  faixa: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md },
  faixaTexto: { flex: 1, fontSize: fontSizes.body, fontWeight: fontWeights.bold },
  titulo: { fontSize: fontSizes.title, fontWeight: fontWeights.bold, color: colors.text },
  label: { marginTop: spacing.md, fontSize: fontSizes.small, fontWeight: fontWeights.bold, color: colors.textMuted, textTransform: 'uppercase' },
  texto: { fontSize: fontSizes.body, color: colors.text },
});
