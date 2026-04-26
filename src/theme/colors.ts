// Paleta de colores basada en el análisis del proyecto original
export const colors = {
  // Colores principales
  primary: '#0f4c81',
  accent: '#41BDFC',
  accentAlt: '#0058BA',
  
  // Fondos gradient
  gradientStart: '#2318BC',
  gradientMid: '#2117A4',
  gradientEnd: '#070421',
  gradientBorder: '#05026D',
  
  // Estados
  success: '#00C800',
  danger: '#C80000',
  successBright: '#00FF00',
  dangerBright: '#FF0000',
  
  // Textos
  textPrimary: '#FFFFFF',
  textSecondary: '#e5dfdf',
  textOnButton: '#FFFFFF',
  
  // Fondos
  surface: '#070421',
  background: '#000000',
  
  // Splash/Alternos
  splashBackground: '#FFFFFF',
  
  // Switch/Toggle (iOS)
  switchTrackActive: 'rgba(255,255,255,0.7)',
  switchTrackInactive: '#3e3e3e',
};

// Tema claro: usa un gradient azul (claro -> oscuro) y mantiene texto blanco
// para asegurar buen contraste sobre el fondo azul.
export const lightColors = {
  ...colors,
  textPrimary: '#FFFFFF',
  textSecondary: '#e5dfdf',
  surface: '#0f4c81',
  background: '#0f4c81',
  gradientStart: '#41BDFC',
  gradientMid: '#0058BA',
  gradientEnd: '#0f4c81',
};

// Tema oscuro (mantiene la identidad visual original)
export const darkColors = colors;
