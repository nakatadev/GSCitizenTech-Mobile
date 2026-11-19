import * as SQLite from 'expo-sqlite';

/**
 * Abre o banco SQLite local (guardiao.db no aparelho) e cria as tabelas na
 * primeira execução. Gratuito, funciona offline e não exige chaves.
 */
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('guardiao.db');
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS ocorrencias (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          remote_id TEXT,
          dispositivo_id TEXT NOT NULL,
          tipo TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          intensidade_g REAL NOT NULL,
          data_hora TEXT NOT NULL,
          status TEXT NOT NULL,
          tempo_aviso_ms INTEGER
        );
        CREATE TABLE IF NOT EXISTS contatos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          telefone TEXT NOT NULL,
          parentesco TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        );
      `);
      return db;
    })();
  }
  return dbPromise;
}
