import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { avisar, confirmar } from '../../utils/dialogs';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { DemoPanel } from '../../components/DemoPanel';
import { listarContatos } from '../../database/contatosRepository';
import { criarOcorrencia } from '../../database/ocorrenciasRepository';
import { DISPOSITIVO_PADRAO, getSetting, KEY_DISPOSITIVO } from '../../database/settingsRepository';
import { obterPosicao } from '../../services/localizacaoService';
import { enviarOcorrencia } from '../../services/ocorrenciasService';
import { colors, fontSizes, fontWeights, radius, spacing } from '../../theme';
import { NovaOcorrencia, StatusOcorrencia } from '../../types';

export default function SosScreen() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [totalContatos, setTotalContatos] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      listarContatos().then((c) => setTotalContatos(c.length));
    }, []),
  );

  const enviar = async () => {
    setSending(true);
    const t0 = Date.now();
    try {
      const pos = await obterPosicao();
      const dados: NovaOcorrencia = {
        dispositivoId: (await getSetting(KEY_DISPOSITIVO)) ?? DISPOSITIVO_PADRAO,
        tipo: 'SOS_MANUAL',
        latitude: pos.latitude,
        longitude: pos.longitude,
        intensidadeG: 0,
        dataHora: new Date().toISOString(),
      };
      let status: StatusOcorrencia = 'ENVIADA';
      let remoteId: string | null = null;
      try {
        remoteId = await enviarOcorrencia(dados);
      } catch {
        status = 'PENDENTE'; // guarda no celular mesmo sem internet
      }
      const id = await criarOcorrencia(dados, { status, remoteId, tempoAvisoMs: Date.now() - t0 });
      router.push({ pathname: '/ocorrencia/[id]', params: { id: String(id), novo: '1' } });
    } catch {
      avisar('Não foi possível registrar', 'Tente de novo. Se for grave, ligue 192 (SAMU).');
    } finally {
      setSending(false);
    }
  };

  const pedirConfirmacao = () =>
    confirmar(
      'Pedir socorro agora?',
      'Seus contatos de emergência serão avisados com a sua localização.',
      'Sim, pedir socorro',
      enviar,
      true,
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.intro}>
        Se você sofreu um acidente ou está em perigo, aperte o botão. Sua caixinha na moto também faz isso sozinha quando percebe uma queda.
      </Text>

      <Pressable
        onPress={pedirConfirmacao}
        disabled={sending}
        accessibilityRole="button"
        accessibilityLabel="Pedir socorro. SOS"
        accessibilityHint="Pede uma confirmação e avisa seus contatos de emergência"
        accessibilityState={{ disabled: sending, busy: sending }}
        style={({ pressed }) => [styles.sos, pressed && { opacity: 0.85 }, sending && { opacity: 0.6 }]}
      >
        {sending ? (
          <ActivityIndicator size="large" color={colors.white} />
        ) : (
          <>
            <Ionicons name="alert-circle" size={72} color={colors.white} />
            <Text style={styles.sosText}>SOS</Text>
          </>
        )}
      </Pressable>

      {totalContatos === 0 ? (
        <View style={styles.aviso} accessible accessibilityLiveRegion="polite">
          <Text style={styles.avisoText}>
            Você ainda não cadastrou nenhum contato de emergência. Sem contato, ninguém recebe o aviso.
          </Text>
          <Button title="Cadastrar contato" variant="secondary" onPress={() => router.push('/contatos')} />
        </View>
      ) : totalContatos !== null ? (
        <Text style={styles.info}>
          {totalContatos} {totalContatos === 1 ? 'contato será avisado' : 'contatos serão avisados'}.
        </Text>
      ) : null}

      <Text style={styles.info}>Em caso grave, ligue também para o SAMU: 192.</Text>
      <DemoPanel />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.lg, alignItems: 'stretch', paddingBottom: spacing.xl },
  intro: { fontSize: fontSizes.body, color: colors.text },
  sos: {
    alignSelf: 'center',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: colors.dangerLight,
  },
  sosText: { color: colors.white, fontSize: fontSizes.headline + 14, fontWeight: fontWeights.bold },
  aviso: { backgroundColor: colors.warningLight, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  avisoText: { fontSize: fontSizes.body, color: colors.warning, fontWeight: fontWeights.medium },
  info: { fontSize: fontSizes.body, color: colors.textMuted, textAlign: 'center' },
});
