import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import KeepAwake from 'react-native-keep-awake';
import Sound from 'react-native-sound';
import {useTheme} from '../../../theme';
import {useExerciseTimer, useScreenInsets} from '../../../hooks';
import {ExerciseWithAsset} from '../../../data/types';
import AppModal from '../../../components/AppModal';

const EXERCISE_DURATION = 20;
const REST_DURATION = 10;

Sound.setCategory('Playback');

const ProgressBar = ({
  progress,
  color,
}: {
  progress: number;
  color: string;
}) => (
  <View style={styles.progressBarContainer}>
    <View
      style={[
        styles.progressBarFill,
        {width: `${Math.min(100, Math.max(0, progress * 100))}%`, backgroundColor: color},
      ]}
    />
  </View>
);

interface ExerciseGifProps {
  source: any;
  style: any;
}

const ExerciseGif = React.memo<ExerciseGifProps>(
  ({source, style}) => {
    if (!source) {
      return <View style={[style, {backgroundColor: 'rgba(255,255,255,0.1)'}]} />;
    }
    return <Image source={source} style={style} resizeMode="contain" />;
  },
  (prev, next) => prev.source === next.source,
);

const StartRoutine: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {theme} = useTheme();
  const insets = useScreenInsets();

  const {groupedExercises, routeParams} = route.params || {};

  const allExercises: ExerciseWithAsset[] = React.useMemo(() => {
    if (!groupedExercises || !Array.isArray(groupedExercises)) {
      return [];
    }
    return groupedExercises.flatMap((group: any) => group.exercises || []);
  }, [groupedExercises]);

  const {state, toggleActive, pause, start, goNext, goPrevious} =
    useExerciseTimer(allExercises.length, EXERCISE_DURATION, REST_DURATION);
  const [showExitModal, setShowExitModal] = useState(false);
  const wasActiveBeforeExitRef = useRef(false);

  const {
    totalSeconds,
    currentIndex,
    isRest,
    isActive,
    exerciseSeconds,
    restSeconds,
    finished,
  } = state;

  // Sonido beep para últimos 3 segundos
  const beepRef = useRef<Sound | null>(null);
  const lastBeepKeyRef = useRef<string>('');

  useEffect(() => {
    const sound = new Sound('bip.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.warn('No se pudo cargar bip.mp3:', error);
        return;
      }
      beepRef.current = sound;
    });
    return () => {
      sound.release();
      beepRef.current = null;
    };
  }, []);

  // Reproducir beep cuando quedan 3, 2 o 1 segundos en cualquiera de las fases.
  useEffect(() => {
    if (!isActive || finished) {
      return;
    }
    let remaining: number;
    if (isRest) {
      remaining = restSeconds;
    } else {
      remaining = EXERCISE_DURATION - exerciseSeconds;
    }
    if (remaining > 0 && remaining <= 3) {
      const key = `${currentIndex}-${isRest ? 'r' : 'e'}-${remaining}`;
      if (lastBeepKeyRef.current !== key && beepRef.current) {
        lastBeepKeyRef.current = key;
        beepRef.current.stop(() => {
          beepRef.current?.play();
        });
      }
    }
  }, [
    restSeconds,
    exerciseSeconds,
    isRest,
    isActive,
    currentIndex,
    finished,
  ]);

  // Auto-iniciar al montar
  useEffect(() => {
    if (allExercises.length > 0) {
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navegar a Congratulations cuando termina la rutina
  useEffect(() => {
    if (finished) {
      const routineNames =
        routeParams?.routines
          ?.filter((r: any) => r.selected)
          .map((r: any) => r.name) || [];

      navigation.replace('Congratulations', {
        totalSeconds,
        exercisesDone: allExercises.length,
        routineNames,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const handleExit = () => {
    wasActiveBeforeExitRef.current = isActive;
    if (isActive) {
      pause();
    }
    setShowExitModal(true);
  };

  const handleCancelExit = () => {
    if (wasActiveBeforeExitRef.current) {
      start();
    }
  };

  const handleConfirmExit = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  if (allExercises.length === 0) {
    return null;
  }

  const safeIndex = Math.min(currentIndex, allExercises.length - 1);
  const exercise = allExercises[safeIndex];

  if (!exercise) {
    return null;
  }

  const phaseColor = isRest ? theme.colors.danger : theme.colors.success;
  const phaseText = isRest ? 'DESCANSO' : 'EJERCICIO';
  const secondsRemaining = isRest
    ? restSeconds
    : EXERCISE_DURATION - exerciseSeconds;
  const progress = isRest
    ? 1 - restSeconds / REST_DURATION
    : exerciseSeconds / EXERCISE_DURATION;

  return (
    <>
      <KeepAwake />
      <LinearGradient
        colors={[
          theme.colors.gradientStart,
          theme.colors.gradientMid,
          theme.colors.gradientEnd,
        ]}
        style={[styles.container, {paddingTop: insets.top + 8, paddingBottom: insets.bottom}]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleExit}>
            <Icon name="close" size={30} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          <Text
            style={[
              styles.headerText,
              {
                fontFamily: theme.typography.fontFamily.bold,
                color: theme.colors.textPrimary,
              },
            ]}>
            {safeIndex + 1} / {allExercises.length}
          </Text>

          <View style={{width: 30}} />
        </View>

        <View style={styles.exerciseContainer}>
          <ExerciseGif source={exercise.gif} style={styles.exerciseGif} />
          <Text
            style={[
              styles.exerciseName,
              {
                fontFamily: theme.typography.fontFamily.bold,
                color: theme.colors.textPrimary,
              },
            ]}>
            {exercise.showableName}
          </Text>
        </View>

        <View style={[styles.phaseContainer, {backgroundColor: phaseColor}]}>
          <Text
            style={[
              styles.phaseText,
              {
                fontFamily: theme.typography.fontFamily.bold,
                color: theme.colors.textOnButton,
              },
            ]}>
            {phaseText}
          </Text>
        </View>

        <View style={styles.timerContainer}>
          <Text
            style={[
              styles.timerText,
              {
                fontFamily: theme.typography.fontFamily.bold,
                color: phaseColor,
              },
            ]}>
            {secondsRemaining}"
          </Text>
        </View>

        <ProgressBar progress={progress} color={phaseColor} />

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[
              styles.sideButton,
              {
                backgroundColor: 'rgba(65,189,252,0.25)',
                opacity: safeIndex === 0 ? 0.4 : 1,
              },
            ]}
            onPress={goPrevious}
            disabled={safeIndex === 0}
            activeOpacity={0.7}>
            <Icon
              name="skip-previous"
              size={28}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.pauseButton,
              {backgroundColor: theme.colors.accent},
            ]}
            onPress={toggleActive}
            activeOpacity={0.7}>
            <Icon
              name={isActive ? 'pause' : 'play'}
              size={32}
              color={theme.colors.textOnButton}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sideButton,
              {
                backgroundColor: 'rgba(65,189,252,0.25)',
                opacity:
                  safeIndex + 1 >= allExercises.length ? 0.4 : 1,
              },
            ]}
            onPress={goNext}
            disabled={safeIndex + 1 >= allExercises.length}
            activeOpacity={0.7}>
            <Icon
              name="skip-next"
              size={28}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {safeIndex + 1 < allExercises.length && (
          <View style={styles.nextExerciseContainer}>
            <Text
              style={[
                styles.nextLabel,
                {
                  fontFamily: theme.typography.fontFamily.regular,
                  color: theme.colors.textSecondary,
                },
              ]}>
              Siguiente:
            </Text>
            <Text
              style={[
                styles.nextName,
                {
                  fontFamily: theme.typography.fontFamily.bold,
                  color: theme.colors.textPrimary,
                },
              ]}>
              {allExercises[safeIndex + 1].showableName}
            </Text>
          </View>
        )}
      </LinearGradient>

      <AppModal
        visible={showExitModal}
        title="¿Salir de la rutina?"
        message="Si salís ahora se perderá el progreso de esta sesión. ¿Estás seguro?"
        cancelable={false}
        buttons={[
          {text: 'Cancelar', style: 'cancel', onPress: handleCancelExit},
          {text: 'Salir', style: 'destructive', onPress: handleConfirmExit},
        ]}
        onClose={() => setShowExitModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 18,
  },
  exerciseContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  exerciseGif: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: '90%',
    borderRadius: 15,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 20,
    textAlign: 'center',
  },
  phaseContainer: {
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 40,
    borderRadius: 10,
    marginBottom: 10,
  },
  phaseText: {
    fontSize: 16,
    letterSpacing: 2,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 60,
    lineHeight: 68,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 40,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 10,
  },
  sideButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextExerciseContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  nextLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  nextName: {
    fontSize: 15,
    textAlign: 'center',
  },
});

export default StartRoutine;
