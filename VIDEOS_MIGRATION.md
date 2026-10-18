# Migración de GIFs a videos de ejercicios

Los GIFs de ejercicios se reemplazaron por videos `.mp4` (carpeta original `~/Desktop/videos app`, 55 archivos). Cada archivo original se llamaba `<Nombre nuevo> <CLAVE_VIEJA>.mp4`, y la clave vieja coincide con el `.gif` que reemplaza. El mapeo se verificó además comparando visualmente cada GIF con su video.

## Cómo quedó implementado

- **Reproductor:** `react-native-video` (componente compartido `src/components/ExerciseVideo.tsx`): loop, sin sonido y sin tomar el foco de audio (no corta la música del usuario).
- **Assets:** `src/assets/Ejercicios/videos/<VIDEO_KEY>.mp4` y posters `src/assets/Ejercicios/posters/<VIDEO_KEY>.jpg` (frame del medio, 240×240, para thumbnails en listas). `npm run generate-posters` los regenera desde los videos.
- **Compresión:** los originales (1440×1080, ~12 Mbps, 625 MB en total) tenían el ejercicio en un cuadrado central con barras negras a los costados. Se recortaron a 1080×1080, se escalaron a 720×720, se reencodearon en H.264 (CRF 28, `+faststart`) y se les quitó el audio (era silencio). Resultado: 51 videos, ~11 MB en total (los GIFs ocupaban ~115 MB).
- **Datos:** el campo `gifKey` pasó a ser `videoKey`; `ExerciseWithAsset.gif` pasó a ser `video`. En `database.ts` se renombraron `showableName` y `name` conservando los sufijos `(Bilateral)` / `(Izquierda)` / `(Derecha)`.

Comando usado para cada video:

```bash
ffmpeg -i "<original>.mp4" -vf "crop=1080:1080:180:0,scale=720:720:flags=lanczos" \
  -c:v libx264 -preset slow -crf 28 -profile:v high -level 4.0 -pix_fmt yuv420p \
  -movflags +faststart -an "src/assets/Ejercicios/videos/<VIDEO_KEY>.mp4"
```

## Mapeo final (55 ejercicios → 51 videos)

| # | Clave vieja (GIF) | Nombre nuevo | Video |
|---|---|---|---|
| 1 | `ABRAZARSE` | Abrazarse | `ABRAZARSE.mp4` |
| 2 | `ALACRAN` | Cruz boca abajo | `CRUZ_BOCA_ABAJO.mp4` |
| 3 | `ARAÑA` | Arco progresivo | `ARCO_PROGRESIVO.mp4` |
| 4 | `BICEPS_PERO_CON_PUÑO` | Biceps | `BICEPS.mp4` |
| 5 | `BOLITA` | Bolita | `BOLITA.mp4` |
| 6 | `CANASTITA_ACOSTADO` | Canastita acostado | `CANASTITA_ACOSTADO.mp4` |
| 7 | `CRUZ` | Cruz boca arriba | `CRUZ_BOCA_ARRIBA.mp4` |
| 8 | `CRUZAR_MANOS_ATRAS` | Cadena anterior | `CADENA_ANTERIOR.mp4` |
| 9 | `CRUZAR_UN_PALO` | Cruzar un palo | `CRUZAR_UN_PALO.mp4` |
| 10 | `CRUZ_EN_L` | Cruz en L | `CRUZ_EN_L.mp4` |
| 11 | `CUADRICEPS_LEVANTADO_EL_TALON` | Cuadriceps levantando el talón | `CUADRICEPS_LEVANTANDO_EL_TALON.mp4` |
| 12 | `CUADRICEPS_PARADO` | Cuadriceps parado | `CUADRICEPS_PARADO.mp4` |
| 13 | `DEDOS_AL_MEDIO` | Extensión de dedos | `EXTENSION_DE_DEDOS.mp4` |
| 14 | `DORSALES_SENTADO` | Dorsales | `DORSALES.mp4` |
| 15 | `DORSALES_Y_BASTON` | Y | `Y.mp4` |
| 16 | `EL_4` | Glúteos en el piso | `GLUTEOS_EN_EL_PISO.mp4` |
| 17 | `ENROLLARSE_COMO_UNA_BOLITA` | Enrollarse | `ENROLLARSE.mp4` |
| 18 | `ENTRECRUZAR_PULGARES` | Entrecruzar pulgares | `ENTRECRUZAR_PULGARES.mp4` |
| 19 | `FLEXOR_DE_CADERA` | Flexor de cadera con rotación | `FLEXOR_DE_CADERA_CON_ROTACION.mp4` |
| 20 | `GEMELOS_CON_SOGA` | Gemelo con soga | `GEMELO_CON_SOGA.mp4` |
| 21 | `GEMELOS_PARADO` | Gemelo parado | `GEMELO_PARADO.mp4` |
| 22 | `GLUTEO_ABRAZAR_LA_RODILLA` | Glúteos | `GLUTEOS.mp4` |
| 23 | `HOMBROS_CARA_ANTERIOR` | Cara anterior del hombro en el piso | `CARA_ANTERIOR_DEL_HOMBRO_EN_EL_PISO.mp4` |
| 24 | `HOMBROS_CARA_POSTERIOR` | Araña | `ARANA.mp4` |
| 25 | `ISQUIO_ADAPTADO` | Isquio con déficit | `ISQUIO_CON_DEFICIT.mp4` |
| 26 | `ISQUIO_CON_SOGA_SENTADO` | Isquio con soga sentado | `ISQUIO_CON_SOGA_SENTADO.mp4` |
| 27 | `ISQUIO_PARADO` | Isquio parado | `ISQUIO_PARADO.mp4` |
| 28 | `ISQUIO_TIRAR_DEL_PIE` | Isquio tirar del pie | `ISQUIO_TIRAR_DEL_PIE.mp4` |
| 29 | `JUNTAR_PLANTAS` | Aductores | `ADUCTORES.mp4` |
| 30 | `MANO_A_LA_AXILA` | Codo a la garganta | `CODO_A_LA_GARGANTA.mp4` |
| 31 | `MANO_EN_EL_CUELLO` | Cruzar dedos en el cuello | `CRUZAR_DEDOS_EN_EL_CUELLO.mp4` |
| 32 | `MANSALVA` | Mansalva | `MANSALVA.mp4` |
| 33 | `MASTIL` | Mástil | `MASTIL.mp4` |
| 34 | `MONJE` | Monje | `MONJE.mp4` |
| 35 | `PECTORAL_A_120` | Pectoral | `PECTORAL.mp4` |
| 36 | `PECTORAL_CON_BASTON` | Pectoral con bastón | `PECTORAL_CON_BASTON.mp4` |
| 37 | `PECTORAL_EN_LA_PARED` | Pectoral | `PECTORAL.mp4` |
| 38 | `PLANTARES` | Tirar de los dedos del pie | `TIRAR_DE_LOS_DEDOS_DEL_PIE.mp4` |
| 39 | `PRONACION_MAXIMA` | Dorso de la mano en la pared | `DORSO_DE_LA_MANO_EN_LA_PARED.mp4` |
| 40 | `PUÑOS_AL_PISO` | Flexión de muñeca | `FLEXION_DE_MUNECA.mp4` |
| 41 | `REZAR` | Girar la mano | `GIRAR_LA_MANO.mp4` |
| 42 | `RODILLA_AFUERA` | Rodilla afuera | `RODILLA_AFUERA.mp4` |
| 43 | `ROTADORES` | Torsión de tronco | `TORSION_DE_TRONCO.mp4` |
| 44 | `SALUDO_AL_SOL` | Cadena anterior | `CADENA_ANTERIOR.mp4` |
| 45 | `SALUDO_AL_SOL_PARADO` | Saludo al sol parado | `SALUDO_AL_SOL_PARADO.mp4` |
| 46 | `SENTARSE_EN_EL_TALON` | Cuadriceps apoyando mano, codo o espalda | `CUADRICEPS_APOYANDO_MANO_CODO_O_ESPALDA.mp4` |
| 47 | `SOLEO` | Sóleo | `SOLEO.mp4` |
| 48 | `TFL_EMPUJANDO_LA_RODILLA` | Cadena lateral | `CADENA_LATERAL.mp4` |
| 49 | `TFL_PARADO` | Cadena lateral | `CADENA_LATERAL.mp4` |
| 50 | `TIRARSE_DEDOS_PARA_ATRAS` | Tirarse dedos para atrás | `TIRARSE_DEDOS_PARA_ATRAS.mp4` |
| 51 | `TRAPECIO_SENTADO` | Trapecio sentado | `TRAPECIO_SENTADO.mp4` |
| 52 | `TRIANGULO_DE_CADERA` | Cadena posterior inferior | `CADENA_POSTERIOR_INFERIOR.mp4` |
| 53 | `TRICEPS` | Triceps | `TRICEPS.mp4` |
| 54 | `Y` | Y | `Y.mp4` |
| 55 | `ZAPO` | Apertura de cadera hacia atrás | `APERTURA_DE_CADERA_HACIA_ATRAS.mp4` |

Correcciones sobre el nombre del archivo: se agregaron tildes (Glúteos, Sóleo, Mástil, Torsión, Flexión, Extensión, déficit, bastón, atrás, talón, rotación), se capitalizó "Canastita acostado" y "Cuadriceps apollando mano o codo o espalda" quedó como "Cuadriceps apoyando mano, codo o espalda".

## Decisiones tomadas

1. **Ejercicios duplicados.** Cuatro pares de ejercicios viejos recibieron el mismo video (archivos idénticos) y el mismo nombre nuevo, así que hoy aparecen dos veces en Explorar:
   - `CRUZAR_MANOS_ATRAS` (eid 10/11) y `SALUDO_AL_SOL` (eid 68) → "Cadena anterior" (el video es el de saludo al sol boca abajo).
   - `TFL_EMPUJANDO_LA_RODILLA` (eid 74/75) y `TFL_PARADO` (eid 76/77) → "Cadena lateral".
   - `PECTORAL_A_120` (eid 52/53) y `PECTORAL_EN_LA_PARED` (eid 55/56) → "Pectoral".
   - `DORSALES_Y_BASTON` (eid 20/21) y `Y` (eid 88/89) → "Y".

   **Resuelto:** se dejan como están (dos registros por par, cada uno con su descripción y sus rutinas).
2. **Descripciones (resuelto).** Se reescribieron las descripciones de los 8 ejercicios cuyo video nuevo mostraba otra variante: "Cadena anterior" (ex Cruzar manos atrás; ahora usa la misma descripción que el otro "Cadena anterior"), "Biceps", "Dorsales", "Araña", "Isquio con déficit", "Glúteos en el piso", "Girar la mano" y "Cadena posterior inferior". El resto conserva su descripción original.
3. **"Araña" / "Arco progresivo" (resuelto).** Los nombres son correctos: la "Araña" nueva (ex Hombros cara posterior) es un ejercicio distinto de la "Araña" vieja (hoy "Arco progresivo").
4. **"Girar la mano" pasa a ser bilateral (resuelto).** eid 40 es la Izquierda (visible, "Girar la mano (Bilateral)") y se agregó eid 91 como Derecha. En la rutina de Tenis (rid 11) se agregó erid 153 en la posición 5 y se corrieron las posiciones siguientes.
5. **`PLANTARES` / "Tirar de los dedos del pie" (resuelto).** Sigue siendo bilateral (eid 59/60); se descarta lo que decían las notas manuscritas.
6. **Dejan de ser bilaterales (resuelto).** En los videos nuevos se elongan los dos lados a la vez, así que pasan a ser un único registro: "Biceps" (eid 5; se eliminó eid 6 y se sacó de la rutina de Judo, corriendo las posiciones), "Cadena anterior" ex Cruzar manos atrás (eid 10; se eliminó eid 11) y "Cadena posterior inferior" (eid 84; se eliminó eid 85).
7. **Descripción de "Girar la mano".** Queda genérica, sin especificar el sentido del giro (decisión del usuario).
