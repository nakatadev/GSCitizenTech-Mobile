/**
 * Tema centralizado: TODAS as cores, fontes e espaçamentos do app ficam aqui.
 * Contraste conferido (WCAG AA): texto #1B1B1F sobre #FFFFFF = 17:1,
 * branco sobre primary #0B5FA5 = 6,6:1.
 */
export const colors = {
  primary: '#0B5FA5',
  primaryDark: '#084478',
  primaryLight: '#E3F0FB',
  background: '#F4F6F8',
  surface: '#FFFFFF',
  text: '#1B1B1F',
  textMuted: '#4A4F57',
  border: '#C5CBD3',
  white: '#FFFFFF',
  success: '#146C2E',
  successLight: '#E1F4E6',
  warning: '#8A4B00',
  warningLight: '#FFF0D9',
  danger: '#B3261E',
  dangerLight: '#FBE4E2',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const fontSizes = {
  small: 14,
  body: 17,
  subtitle: 19,
  title: 24,
  headline: 30,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '600',
  bold: '700',
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

/** Altura mínima recomendada para áreas de toque (acessibilidade). */
export const touchTarget = 48;

export const theme = { colors, spacing, fontSizes, fontWeights, radius, touchTarget };
export type Theme = typeof theme;
