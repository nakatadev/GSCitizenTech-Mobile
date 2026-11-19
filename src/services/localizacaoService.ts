import * as Location from 'expo-location';

/** Av. Paulista, São Paulo — usada se o GPS estiver negado ou indisponível. */
export const POSICAO_PADRAO = { latitude: -23.5614, longitude: -46.6559, aproximada: true };

export async function obterPosicao(): Promise<{ latitude: number; longitude: number; aproximada: boolean }> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return POSICAO_PADRAO;
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude, aproximada: false };
  } catch {
    return POSICAO_PADRAO;
  }
}
