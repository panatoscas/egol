/**
 * Paleta de cores da Seleção Brasileira — Copa do Mundo 2026
 */
export const COLORS = {
  // Cores oficiais da Seleção
  green: '#009C3B',       // Verde bandeira
  gold: '#FFD700',        // Amarelo canário
  navy: '#002776',        // Azul marinho
  white: '#FFFFFF',

  // Variações
  greenDark: '#007A2E',
  greenLight: '#00C94A',
  goldDark: '#D4AF00',
  goldLight: '#FFE552',
  navyLight: '#003DA6',

  // Backgrounds
  background: '#001A57',  // Azul escuro profundo
  surface: '#002D8A',     // Azul médio (cards)
  surfaceLight: '#003EB5',

  // Texto
  textPrimary: '#FFFFFF',
  textSecondary: '#FFD700',
  textMuted: '#FFFFFF99',

  // Status
  goalRed: '#FF3B30',
  success: '#34C759',
  warning: '#FFD700',

  // Gradientes prontos pra usar
  gradientBR: ['#002776', '#009C3B'] as const,
  gradientGold: ['#FFD700', '#D4AF00'] as const,
  gradientDark: ['#001133', '#002776'] as const,
} as const;

export type ColorKey = keyof typeof COLORS;
