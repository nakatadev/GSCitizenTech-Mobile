import { Alert, Platform } from 'react-native';

/** Aviso simples. No celular usa o Alert nativo; na web, window.alert. */
export function avisar(titulo: string, mensagem: string) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
    return;
  }
  Alert.alert(titulo, mensagem);
}

/** Pergunta de confirmação. Executa onConfirmar se a pessoa aceitar. */
export function confirmar(
  titulo: string,
  mensagem: string,
  textoConfirmar: string,
  onConfirmar: () => void,
  destrutivo = false,
) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensagem}`)) onConfirmar();
    return;
  }
  Alert.alert(titulo, mensagem, [
    { text: 'Voltar', style: 'cancel' },
    { text: textoConfirmar, style: destrutivo ? 'destructive' : 'default', onPress: onConfirmar },
  ]);
}
