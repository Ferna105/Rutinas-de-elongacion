import {colors, lightColors, darkColors} from './colors';
import {spacing} from './spacing';
import {radius} from './radius';
import {typography, textStyles} from './typography';

export type Theme = {
  colors: typeof colors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  textStyles: typeof textStyles;
  dark: boolean;
};

export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  radius,
  typography,
  textStyles,
  dark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  radius,
  typography,
  textStyles,
  dark: true,
};

// Exportar todo para fácil acceso
export {colors, lightColors, darkColors};
export {spacing};
export {radius};
export {typography, textStyles};
