/** Nomes e formatos seguem o contrato da API do Guardião (00-FICHA-E-CONTRATO). */

export type NivelRisco = 'BAIXO' | 'MEDIO' | 'ALTO';

/** Resposta do GET /api/zonas-risco */
export interface ZonaRisco {
  id: number;
  nome: string;
  nivel: NivelRisco;
  score: number; // 0 a 1 (vem do modelo de ML)
}

/** QUEDA vem do sensor (ESP32). SOS_MANUAL vem do botão do app. */
export type TipoOcorrencia = 'QUEDA' | 'SOS_MANUAL';

/** PENDENTE = salvo no celular, ainda sem conseguir enviar (sem internet). */
export type StatusOcorrencia = 'ENVIADA' | 'PENDENTE' | 'CANCELADA';

/** Corpo do POST /api/ocorrencias */
export interface NovaOcorrencia {
  dispositivoId: string;
  tipo: TipoOcorrencia;
  latitude: number;
  longitude: number;
  intensidadeG: number;
  dataHora: string; // ISO 8601
}

/** Ocorrência guardada no banco local (SQLite). */
export interface Ocorrencia extends NovaOcorrencia {
  id: number;
  remoteId: string | null;
  status: StatusOcorrencia;
  /** Tempo entre acionar o SOS e o aviso ser enviado (indicador de impacto). */
  tempoAvisoMs: number | null;
}

export interface Contato {
  id: number;
  nome: string;
  telefone: string;
  parentesco: string;
}

export type NovoContato = Omit<Contato, 'id'>;
