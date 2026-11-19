import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { confirmar } from '../../utils/dialogs';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Field } from '../../components/Field';
import { EmptyState, ErrorState, LoadingState } from '../../components/StateView';
import { Section } from '../../components/Section';
import { formatTelefone } from '../../data/labels';
import { criarContato, listarContatos, removerContato } from '../../database/contatosRepository';
import { DISPOSITIVO_PADRAO, getSetting, KEY_DISPOSITIVO, KEY_NOME, setSetting } from '../../database/settingsRepository';
import { useAsync } from '../../hooks/useAsync';
import { colors, fontSizes, fontWeights, spacing } from '../../theme';

export default function ContatosScreen() {
  const { status, data, error, reload } = useAsync(listarContatos);

  const [nome, setNome] = useState('');
  const [dispositivo, setDispositivo] = useState(DISPOSITIVO_PADRAO);
  const [perfilSalvo, setPerfilSalvo] = useState(false);

  const [cNome, setCNome] = useState('');
  const [cTel, setCTel] = useState('');
  const [cParent, setCParent] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});

  useFocusEffect(
    useCallback(() => {
      reload();
      getSetting(KEY_NOME).then((v) => v && setNome(v));
      getSetting(KEY_DISPOSITIVO).then((v) => v && setDispositivo(v));
    }, [reload]),
  );

  const salvarPerfil = async () => {
    await setSetting(KEY_NOME, nome.trim());
    await setSetting(KEY_DISPOSITIVO, dispositivo.trim() || DISPOSITIVO_PADRAO);
    setPerfilSalvo(true);
  };

  const adicionar = async () => {
    const digitos = cTel.replace(/\D/g, '');
    const e: Record<string, string> = {};
    if (cNome.trim().length < 2) e.nome = 'Escreva o nome do contato.';
    if (digitos.length < 10 || digitos.length > 11) e.tel = 'Escreva o telefone com DDD. Ex.: 11 91234-5678';
    if (cParent.trim().length < 2) e.parent = 'Diga quem é essa pessoa. Ex.: mãe, esposa, amigo.';
    setErros(e);
    if (Object.keys(e).length) return;
    await criarContato({ nome: cNome.trim(), telefone: digitos, parentesco: cParent.trim() });
    setCNome('');
    setCTel('');
    setCParent('');
    reload();
  };

  const apagar = (id: number, nomeContato: string) =>
    confirmar('Remover contato?', `${nomeContato} não receberá mais os avisos.`, 'Remover', async () => {
      await removerContato(id);
      reload();
    }, true);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Section title="Meu perfil">
          <Field label="Meu nome" value={nome} onChangeText={(t) => { setNome(t); setPerfilSalvo(false); }} placeholder="Ex.: João (fictício)" />
          <Field label="Código da caixinha na moto" value={dispositivo} onChangeText={(t) => { setDispositivo(t); setPerfilSalvo(false); }} autoCapitalize="characters" />
          <Button title="Salvar perfil" variant="secondary" onPress={salvarPerfil} />
          {perfilSalvo ? (
            <Text style={styles.ok} accessibilityLiveRegion="polite">
              Perfil salvo no celular.
            </Text>
          ) : null}
        </Section>

        <Section title="Contatos de emergência">
          {status === 'loading' ? <LoadingState message="Carregando contatos..." /> : null}
          {status === 'error' ? <ErrorState message={error} onRetry={reload} /> : null}
          {status === 'success' && (data ?? []).length === 0 ? (
            <EmptyState title="Nenhum contato" message="Cadastre quem deve ser avisado se você sofrer um acidente." />
          ) : null}
          {(data ?? []).map((c) => (
            <Card key={c.id}>
              <Text style={styles.cNome}>{c.nome}</Text>
              <Text style={styles.cInfo}>
                {c.parentesco} · {formatTelefone(c.telefone)}
              </Text>
              <Button title="Remover" variant="danger" onPress={() => apagar(c.id, c.nome)} accessibilityHint={`Remove ${c.nome} dos contatos`} />
            </Card>
          ))}
        </Section>

        <Section title="Adicionar contato">
          <Text style={styles.cInfo}>Use apenas nomes e telefones de quem você autorizou a avisar.</Text>
          <Field label="Nome" value={cNome} onChangeText={setCNome} error={erros.nome} />
          <Field label="Telefone com DDD" value={cTel} onChangeText={setCTel} keyboardType="phone-pad" placeholder="11 91234-5678" error={erros.tel} />
          <Field label="Quem é" value={cParent} onChangeText={setCParent} placeholder="Ex.: mãe" error={erros.parent} />
          <Button title="Adicionar contato" onPress={adicionar} />
        </Section>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.lg, paddingBottom: spacing.xl },
  ok: { color: colors.success, fontSize: fontSizes.body, fontWeight: fontWeights.bold },
  cNome: { fontSize: fontSizes.subtitle, fontWeight: fontWeights.bold, color: colors.text },
  cInfo: { fontSize: fontSizes.body, color: colors.textMuted },
});
