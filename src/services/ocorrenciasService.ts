import { NovaOcorrencia } from '../types';
import { demo } from './demo';
import { API_URL, ApiError, sleep } from './http';

/**
 * Envio de ocorrências para a API.
 * - POST  /api/ocorrencias               → registra queda ou SOS
 * - PATCH /api/ocorrencias/{id}/cancelar → cancela alarme falso
 * Sem EXPO_PUBLIC_API_URL, o envio é simulado (mock) com atraso de rede.
 */

/** Retorna o id da ocorrência no servidor. */
export async function enviarOcorrencia(dados: NovaOcorrencia): Promise<string> {
  if (API_URL) {
    let res: Response;
    try {
      res = await fetch(`${API_URL}/api/ocorrencias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
    } catch {
      throw new ApiError('Sem conexão com o servidor.');
    }
    if (!res.ok) throw new ApiError(`O servidor recusou o aviso (código ${res.status}).`);
    const body = await res.json().catch(() => ({}));
    return String(body.id ?? '');
  }

  await sleep(700);
  if (demo.semInternet) throw new ApiError('Sem conexão com o servidor.');
  return `mock-${Date.now()}`;
}

export async function cancelarOcorrenciaRemota(remoteId: string): Promise<void> {
  if (API_URL) {
    let res: Response;
    try {
      res = await fetch(`${API_URL}/api/ocorrencias/${remoteId}/cancelar`, { method: 'PATCH' });
    } catch {
      throw new ApiError('Sem conexão com o servidor.');
    }
    if (!res.ok) throw new ApiError(`Não foi possível cancelar (código ${res.status}).`);
    return;
  }
  await sleep(500);
  if (demo.semInternet) throw new ApiError('Sem conexão com o servidor.');
}
