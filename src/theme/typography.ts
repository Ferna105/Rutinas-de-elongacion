// Sistema tipográfico basado en Raleway
export const typography = {
  // Familias
  fontFamily: {
    regular: 'Raleway-Regular',
    bold: 'Raleway-Bold',
  },
  
  // Tamaños semánticos
  fontSize: {
    caption: 12,
    body: 15,
    bodyLarge: 17,
    h3: 21,
    h2: 24,
    h1: 28,
    display: 40,
    timerLarge: 60,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Estilos de texto reutilizables
export const textStyles = {
  caption: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.caption,
    lineHeight: typography.fontSize.caption * typography.lineHeight.normal,
  },
  body: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.body,
    lineHeight: typography.fontSize.body * typography.lineHeight.normal,
  },
  bodyBold: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.body,
    lineHeight: typography.fontSize.body * typography.lineHeight.normal,
  },
  header: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.bodyLarge,
    lineHeight: typography.fontSize.bodyLarge * typography.lineHeight.tight,
  },
  h1: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.h1,
    lineHeight: typography.fontSize.h1 * typography.lineHeight.tight,
  },
  h2: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.h2,
    lineHeight: typography.fontSize.h2 * typography.lineHeight.tight,
  },
  h3: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.h3,
    lineHeight: typography.fontSize.h3 * typography.lineHeight.tight,
  },
};
