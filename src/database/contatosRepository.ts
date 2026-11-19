import { Contato, NovoContato } from '../types';
import { getDb } from './db';

export async function criarContato(c: NovoContato): Promise<number> {
  const db = await getDb();
  const r = await db.runAsync(
    'INSERT INTO contatos (nome, telefone, parentesco) VALUES (?, ?, ?)',
    c.nome,
    c.telefone,
    c.parentesco,
  );
  return r.lastInsertRowId;
}

export async function listarContatos(): Promise<Contato[]> {
  const db = await getDb();
  return db.getAllAsync<Contato>('SELECT id, nome, telefone, parentesco FROM contatos ORDER BY nome');
}

export async function removerContato(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM contatos WHERE id = ?', id);
}
