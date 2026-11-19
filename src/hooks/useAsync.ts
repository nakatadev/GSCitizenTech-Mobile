import { useCallback, useEffect, useRef, useState } from 'react';

export type AsyncStatus = 'loading' | 'error' | 'success';

/** Executa uma função assíncrona e expõe loading / erro / dados + reload. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [status, setStatus] = useState<AsyncStatus>('loading');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string>('');
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(async () => {
    setStatus('loading');
    try {
      setData(await fnRef.current());
      setStatus('success');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Algo deu errado.');
      setStatus('error');
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    run();
  }, deps);

  return { status, data, error, reload: run };
}
