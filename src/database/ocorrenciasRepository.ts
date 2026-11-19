import { NovaOcorrencia, Ocorrencia, StatusOcorrencia, TipoOcorrencia } from '../types';
import { getDb } from './db';

interface Row {
  id: number;
  remote_id: string | null;
  dispositivo_id: string;
  tipo: TipoOcorrencia;
  latitude: number;
  longitude: number;
  intensidade_g: number;
  data_hora: string;
  status: StatusOcorrencia;
  tempo_aviso_ms: number | null;
}

const toOcorrencia = (r: Row): Ocorrencia => ({
  id: r.id,
  remoteId: r.remote_id,
  dispositivoId: r.dispositivo_id,
  tipo: r.tipo,
  latitude: r.latitude,
  longitude: r.longitude,
  intensidadeG: r.intensidade_g,
  dataHora: r.data_hora,
  status: r.status,
  tempoAvisoMs: r.tempo_aviso_ms,
});

export async function criarOcorrencia(
  dados: NovaOcorrencia,
  extra: { status: StatusOcorrencia; remoteId: string | null; tempoAvisoMs: number | null },
): Promise<number> {
  const db = await getDb();
  const r = await db.runAsync(
    `INSERT INTO ocorrencias
      (remote_id, dispositivo_id, tipo, latitude, longitude, intensidade_g, data_hora, status, tempo_aviso_ms)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    extra.remoteId,
    dados.dispositivoId,
    dados.tipo,
    dados.latitude,
    dados.longitude,
    dados.intensidadeG,
    dados.dataHora,
    extra.status,
    extra.tempoAvisoMs,
  );
  return r.lastInsertRowId;
}

export async function listarOcorrencias(): Promise<Ocorrencia[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Row>('SELECT * FROM ocorrencias ORDER BY data_hora DESC');
  return rows.map(toOcorrencia);
}

export async function buscarOcorrencia(id: number): Promise<Ocorrencia | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Row>('SELECT * FROM ocorrencias WHERE id = ?', id);
  return row ? toOcorrencia(row) : null;
}

export async function atualizarStatus(
  id: number,
  status: StatusOcorrencia,
  remoteId?: string | null,
  tempoAvisoMs?: number | null,
): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE ocorrencias SET status = ?, remote_id = COALESCE(?, remote_id), tempo_aviso_ms = COALESCE(?, tempo_aviso_ms) WHERE id = ?',
    status,
    remoteId ?? null,
    tempoAvisoMs ?? null,
    id,
  );
}
