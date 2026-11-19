import { NivelRisco, StatusOcorrencia, TipoOcorrencia } from '../types';

export const NIVEL_LABEL: Record<NivelRisco, string> = {
  ALTO: 'Risco alto',
  MEDIO: 'Risco médio',
  BAIXO: 'Risco baixo',
};

export const NIVEL_TOM: Record<NivelRisco, 'danger' | 'warning' | 'success'> = {
  ALTO: 'danger',
  MEDIO: 'warning',
  BAIXO: 'success',
};

export const TIPO_LABEL: Record<TipoOcorrencia, string> = {
  QUEDA: 'Queda detectada pela caixinha',
  SOS_MANUAL: 'Pedido de socorro (SOS)',
};

export const STATUS_LABEL: Record<StatusOcorrencia, string> = {
  ENVIADA: 'Aviso enviado',
  PENDENTE: 'Não enviado (sem internet)',
  CANCELADA: 'Cancelada (alarme falso)',
};

export const STATUS_TOM: Record<StatusOcorrencia, 'success' | 'danger' | 'neutral'> = {
  ENVIADA: 'success',
  PENDENTE: 'danger',
  CANCELADA: 'neutral',
};

export const HORARIOS: { label: string; hora: number | 'agora' }[] = [
  { label: 'Agora', hora: 'agora' },
  { label: 'Madrugada', hora: 2 },
  { label: 'Manhã', hora: 8 },
  { label: 'Tarde', hora: 15 },
  { label: 'Noite', hora: 20 },
];

export const formatDataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatTelefone = (digits: string) =>
  digits.length === 11
    ? `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    : digits.length === 10
      ? `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
      : digits;
