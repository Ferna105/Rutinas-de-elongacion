# Rutinas de Elongación

Aplicación móvil de React Native CLI + TypeScript para rutinas de elongación miofascial.

## Estado del Proyecto

### ✅ Completado

#### 1. Infraestructura Base
- ✅ Proyecto React Native CLI 0.85 con TypeScript
- ✅ Git repository independiente inicializado
- ✅ Configuración de display name "Rutinas de elongación"
- ✅ Estructura de carpetas organizada por features

#### 2. Sistema de Tema
- ✅ Paleta de colores completa (primarios, acentos, gradientes, estados)
- ✅ Sistema tipográfico con Raleway (Regular, Bold)
- ✅ Tokens de espaciado y border radius
- ✅ Soporte light/dark mode con `useColorScheme`
- ✅ Persistencia de preferencia de tema en AsyncStorage
- ✅ `ThemeProvider` y hook `useTheme`
- **Ubicación**: `src/theme/`

#### 3. Capa de Datos
- ✅ Tipos TypeScript completos para todas las entidades
- ✅ Database loader con 7 cadenas, 12 deportes, 13 rutinas
- ✅ Assets mapper para GIFs, imágenes y sonidos
- ✅ Queries tipadas sin mutaciones (corrige bugs del original)
- ✅ Helpers para generación de rutinas personalizadas
- **Ubicación**: `src/data/`

**Bugs Corregidos**:
- ❌ Variable global implícita en `getExerciseByCid` → ✅ Scope correcto
- ❌ Mutaciones en queries → ✅ Inmutabilidad
- ❌ `JSON.parse('')` al hacer logout → ✅ `removeItem()` + validaciones
- ❌ Sin defensas en `getGeneratedRoutine` → ✅ Validaciones añadidas

#### 4. Storage
- ✅ Wrapper tipado para AsyncStorage
- ✅ Gestión de perfil de usuario
- ✅ Gestión de historial de sesiones
- ✅ Manejo de errores robusto
- **Ubicación**: `src/storage/`

#### 5. Autenticación
- ✅ `AuthContext` y `AuthProvider`
- ✅ Hook `useAuth` con signIn/signOut/updateProfile
- ✅ Carga automática de perfil al iniciar
- ✅ Navegación condicional según estado de auth
- **Ubicación**: `src/components/AuthContext.tsx`

#### 6. Navegación
- ✅ `AuthNavigator` con 3 pantallas de onboarding
- ✅ `AppNavigator` (estructura lista para pantallas)
- ✅ Integración con React Navigation v6
- **Ubicación**: `src/navigation/`

#### 7. Pantallas de Onboarding (AuthStack)
- ✅ **StatusSelection**: ¿Practica deporte? (Sí/No)
- ✅ **SportsSelection**: Selección de deportes con checkboxes
- ✅ **SuccessScreen**: Confirmación y guardar perfil
- **Ubicación**: `src/screens/auth/`

#### 8. Hooks Custom
- ✅ `useRoutineBuilder`: Gestión de estado de rutina personalizada
- ✅ `useExerciseTimer`: Timer con deps correctas, pausa, beep
- **Ubicación**: `src/hooks/`

#### 9. Assets
- ✅ 7 imágenes de cadenas musculares (PNG)
- ✅ 90 GIFs de ejercicios
- ✅ 16 imágenes de slider para carousel
- ✅ Sonido `bip.mp3` para timer
- ✅ Fuentes Raleway vinculadas con `react-native-asset`
- ✅ Soporte GIF animado en Android (Fresco configurado)
- **Ubicación**: `src/assets/`

#### 10. Dependencias
- ✅ React Navigation (native, stack, bottom-tabs)
- ✅ AsyncStorage
- ✅ Linear Gradient
- ✅ Vector Icons
- ✅ Sound
- ✅ Keep Awake
- ✅ Picker
- ✅ Reanimated v3
- ✅ Gesture Handler
- ✅ Reanimated Carousel

---

### 🚧 Pendiente de Implementar

#### 11. HomeScreen
**Ubicación**: `src/screens/app/HomeScreen.tsx`

- [ ] Carousel con tips de elongación (16 sliders)
- [ ] Botón "Comenzar" → navegación a SelectRoutines
- [ ] Botón "Explorar" → navegación a Explore
- [ ] Botón "Configuración" → navegación a Configuration
- [ ] (Opcional) Panel de historial de sesiones recientes

**Patrón a seguir**:
```typescript
// Usar react-native-reanimated-carousel
// Ver sliderImages en src/data/assets.ts
// LinearGradient como fondo
```

#### 12. Flujo CreateRoutine

**12.1 SelectRoutines**
**Ubicación**: `src/features/routine/screens/SelectRoutines.tsx`

- [ ] Cargar rutinas con `getUserRoutines(profile)`
- [ ] Lista con checkbox y Picker de nivel (1/2/3)
- [ ] Calcular tiempo estimado: `level * (n * 30) segundos`
- [ ] Pre-seleccionar rutina "General"
- [ ] Botón "Siguiente" → AddAccessory

**12.2 AddAccessory**
**Ubicación**: `src/features/routine/screens/AddAccessory.tsx`

- [ ] Pregunta "¿Añadir ejercicios accesorios?"
- [ ] Botón "Sí" → AccessoryExercises
- [ ] Botón "No" → RoutineInformation

**12.3 AccessoryExercises**
**Ubicación**: `src/features/routine/screens/AccessoryExercises.tsx`

- [ ] Grid 2 columnas con `getChains()`
- [ ] Tap en cadena → Alert con 3 niveles
- [ ] Mostrar tiempo estimado por nivel
- [ ] Botón "Siguiente" → RoutineInformation

**12.4 RoutineInformation**
**Ubicación**: `src/features/routine/screens/RoutineInformation.tsx`

- [ ] Generar con `getGeneratedRoutineShowableExercises()`
- [ ] Lista agrupada por nombre de rutina/accesorios
- [ ] Modal de detalle con GIF al hacer tap
- [ ] Mostrar tiempo total
- [ ] Alert pre-inicio (tensión vs dolor, 20s/10s)
- [ ] Botón "INICIAR" → StartRoutine

#### 13. StartRoutine
**Ubicación**: `src/features/routine/screens/StartRoutine.tsx`

- [ ] Usar hook `useExerciseTimer`
- [ ] Mostrar GIF del ejercicio actual
- [ ] Timer grande: rojo (descanso) / verde (ejercicio)
- [ ] Barra de progreso cross-platform (`react-native-progress`)
- [ ] Botón Pausar/Reanudar
- [ ] Reproducir `bip.mp3` en últimos 3s con `react-native-sound`
- [ ] `react-native-keep-awake` activo durante sesión
- [ ] Confirmación al salir (beforeRemove)
- [ ] Al terminar → Congratulations

**Componentes sugeridos**:
```typescript
import {useExerciseTimer} from '../../../hooks';
import KeepAwake from 'react-native-keep-awake';
import Sound from 'react-native-sound';
import * as Progress from 'react-native-progress';
```

#### 14. Congratulations
**Ubicación**: `src/features/routine/screens/Congratulations.tsx`

- [ ] Recibir props: `{totalSeconds, exercisesDone, routineNames}`
- [ ] Icono de éxito
- [ ] Mostrar métricas de sesión
- [ ] Guardar en historial con `addSession()`
- [ ] Botón "VOLVER AL INICIO" → Home

#### 15. Explore
**Ubicación**: `src/screens/app/Explore.tsx`

- [ ] Lista de `getShowableExercises()`
- [ ] Tap → Modal con nombre, GIF, descripción
- [ ] Botón cerrar modal
- [ ] Botón "VOLVER" → goBack()

#### 16. Configuration
**Ubicación**: `src/screens/app/Configuration.tsx`

- [ ] Cargar perfil actual
- [ ] Switch "Practico deporte"
- [ ] Checkboxes de deportes (si switch = true)
- [ ] Selector de tema (Auto/Light/Dark) con `setThemeMode`
- [ ] (Opcional) Inputs para tiempos 20s/10s personalizados
- [ ] Botón "Guardar" → `updateProfile()`
- [ ] Botón "Cerrar sesión" → `signOut()`

---

## Estructura del Proyecto

```
src/
├── assets/              # Assets estáticos
│   ├── Cadenas/        # 7 PNGs de cadenas musculares
│   ├── Ejercicios/     # 90 GIFs de ejercicios
│   ├── slider/         # 16 imágenes para carousel
│   ├── sounds/         # bip.mp3
│   ├── fonts/          # Raleway (Regular, Bold, etc.)
│   └── images/         # logo, icon, splash
├── components/         # Componentes compartidos
│   └── AuthContext.tsx # Context de autenticación
├── data/              # Capa de datos
│   ├── types.ts       # Tipos TypeScript
│   ├── database.ts    # Datos hardcodeados
│   ├── assets.ts      # Mapper de require()
│   ├── queries.ts     # Queries tipadas
│   └── index.ts
├── features/          # Features organizadas
│   └── routine/       # Feature de rutinas
│       ├── screens/   # Pantallas del flujo
│       └── hooks/     # Hooks específicos
├── hooks/             # Hooks globales
│   ├── useRoutineBuilder.ts
│   ├── useExerciseTimer.ts
│   └── index.ts
├── navigation/        # Navegación
│   ├── AuthNavigator.tsx
│   ├── AppNavigator.tsx
│   └── index.ts
├── screens/           # Pantallas
│   ├── auth/         # Onboarding
│   └── app/          # App principal
├── storage/          # Storage wrapper
│   └── profile.ts
└── theme/            # Sistema de diseño
    ├── colors.ts
    ├── typography.ts
    ├── spacing.ts
    ├── radius.ts
    ├── theme.ts
    ├── ThemeProvider.tsx
    └── index.ts
```

---

## Configuración de Desarrollo

### Requisitos
- Node.js >= 20
- React Native CLI
- Xcode (para iOS)
- Android Studio (para Android)

### Instalación
```bash
cd rutinas-de-elongacion
npm install

# iOS
cd ios && bundle install && bundle exec pod install && cd ..

# Android (GIFs ya configurados con Fresco en build.gradle)
```

### Ejecutar
```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

---

## Notas de Implementación

### Database
Por ahora, los datos están hardcodeados en `src/data/database.ts`. Para simplificar, solo se incluyen muestras de ejercicios y vínculos. En producción:
1. Completar los 90 ejercicios en el array
2. Completar los 152 vínculos exercises_routines
3. O migrar a `database.json` y cargarlo dinámicamente

### Patrones de Código

**Componentes de pantalla**:
```typescript
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../theme';

const MyScreen: React.FC = () => {
  const {theme} = useTheme();
  
  return (
    <LinearGradient
      colors={[
        theme.colors.gradientStart,
        theme.colors.gradientMid,
        theme.colors.gradientEnd,
      ]}
      style={styles.container}>
      {/* content */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
});

export default MyScreen;
```

**Botones**:
```typescript
<TouchableOpacity
  style={[styles.button, {backgroundColor: theme.colors.accent}]}
  onPress={handlePress}
  activeOpacity={0.7}>
  <Text style={[styles.text, {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.textOnButton,
  }]}>
    TEXTO
  </Text>
</TouchableOpacity>
```

### iOS Pods
Si tienes problemas con CocoaPods, ejecuta:
```bash
cd ios
export LANG=en_US.UTF-8
pod install
```

---

## Bugs Corregidos vs Original

| Bug Original | Solución |
|--------------|----------|
| Variable global `chain_exercises` | Scope con `const` |
| Mutación de objetos en queries | Inmutabilidad con spread |
| `JSON.parse('')` en logout | `removeItem()` + validación |
| Sin defensas en `getGeneratedRoutine` | Validaciones de `sports` vacío |
| Timer sin array de deps | `useEffect` con deps explícitas |
| `secondsRest` inicia en 5 | Inicializa en `restDuration` (10) |
| `ProgressBarAndroid` solo Android | Usar `react-native-progress` |

---

## Siguientes Pasos

1. **Completar pantallas pendientes** (HomeScreen, CreateRoutine, etc.)
2. **Integrar navigation** en AppNavigator con todas las rutas
3. **Testing** en iOS y Android reales
4. **Completar database** con los 90 ejercicios y 152 vínculos
5. **Assets de app** (icon, splash screen nativos)
6. **Optimizaciones** (memo, lazy loading de GIFs)

---

## Referencias

- Análisis completo en `.cursor/plans/analisis_y_blueprint_lm_*.plan.md`
- Proyecto original en `../LiberacionesMiofasciales/`
- React Navigation: https://reactnavigation.org/
- React Native Reanimated: https://docs.swmansion.com/react-native-reanimated/

---

**Autor**: Implementación basada en análisis exhaustivo del proyecto original  
**Fecha**: Abril 2026  
**Stack**: React Native CLI 0.85 + TypeScript
