/** Base da API (opcional). Sem ela, os serviços usam dados simulados. */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');

export class ApiError extends Error {}

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
