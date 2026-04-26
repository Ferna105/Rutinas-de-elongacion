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

// Tema claro (nuevo, no existía en la app original)
export const lightColors = {
  ...colors,
  textPrimary: '#000000',
  textSecondary: '#4a4a4a',
  surface: '#FFFFFF',
  background: '#F5F5F5',
  gradientStart: '#41BDFC',
  gradientMid: '#0f4c81',
  gradientEnd: '#FFFFFF',
};

// Tema oscuro (mantiene la identidad visual original)
export const darkColors = colors;
