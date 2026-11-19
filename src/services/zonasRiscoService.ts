import { NivelRisco, ZonaRisco } from '../types';
import { demo } from './demo';
import { API_URL, ApiError, sleep } from './http';

/**
 * Camada de serviços: risco por região e horário.
 * - Com EXPO_PUBLIC_API_URL: GET /api/zonas-risco?lat=&lng=&hora=
 * - Sem ela: dados SIMULADOS (mock) que imitam a saída do modelo de ML.
 */

// Locais públicos de São Paulo + um "risco base" inventado para a demonstração.
const ZONAS_BASE: { id: number; nome: string; base: number }[] = [
  { id: 1, nome: 'Av. Paulista x Consolação', base: 0.7 },
  { id: 2, nome: 'Marginal Tietê — Ponte do Limão', base: 0.78 },
  { id: 3, nome: 'Av. Radial Leste — Tatuapé', base: 0.62 },
  { id: 4, nome: 'Av. Brigadeiro Faria Lima x Rebouças', base: 0.55 },
  { id: 5, nome: 'Rua Augusta x Av. Paulista', base: 0.5 },
  { id: 6, nome: 'Av. Sapopemba — altura do Jd. Planalto', base: 0.66 },
  { id: 7, nome: 'Av. do Estado — Cambuci', base: 0.45 },
  { id: 8, nome: 'Rua da Consolação — Centro', base: 0.35 },
];

export const nivelDe = (score: number): NivelRisco =>
  score >= 0.66 ? 'ALTO' : score >= 0.4 ? 'MEDIO' : 'BAIXO';

function ajustePorHora(hora: number) {
  if (hora >= 22 || hora <= 5) return 0.15; // madrugada: mais risco
  if (hora >= 17) return 0.1; // fim de tarde / rush
  if (hora >= 11 && hora <= 14) return 0.03; // almoço
  return -0.08;
}

export async function buscarZonasRisco(
  lat: number,
  lng: number,
  hora: number,
): Promise<ZonaRisco[]> {
  if (API_URL) {
    let res: Response;
    try {
      res = await fetch(`${API_URL}/api/zonas-risco?lat=${lat}&lng=${lng}&hora=${hora}`);
    } catch {
      throw new ApiError('Sem conexão com o servidor.');
    }
    if (!res.ok) throw new ApiError(`Falha ao carregar (código ${res.status}).`);
    return (await res.json()) as ZonaRisco[];
  }

  await sleep(900);
  if (demo.semInternet) throw new ApiError('Sem conexão com o servidor.');
  if (demo.listaVazia) return [];

  return ZONAS_BASE.map((z) => {
    const score = Math.min(0.98, Math.max(0.05, z.base + ajustePorHora(hora)));
    return { id: z.id, nome: z.nome, score: Math.round(score * 100) / 100, nivel: nivelDe(score) };
  }).sort((a, b) => b.score - a.score);
}
