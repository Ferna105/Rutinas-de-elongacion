import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import KeepAwake from 'react-native-keep-awake';
// import Sound from 'react-native-sound'; // Descomentar cuando esté instalado
import {useTheme} from '../../../theme';
import {useExerciseTimer} from '../../../hooks';
import {ExerciseWithAsset} from '../../../data/types';

const {width: screenWidth} = Dimensions.get('window');

// Progress bar cross-platform
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
        {width: `${progress * 100}%`, backgroundColor: color},
      ]}
    />
  </View>
);

const StartRoutine: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {theme} = useTheme();

  const {groupedExercises, routeParams} = route.params;
  const allExercises: ExerciseWithAsset[] = groupedExercises.flatMap(
    (group: any) => group.exercises,
  );

  const {
    totalSeconds,
    currentExercise,
    isRest,
    isActive,
    progress,
    start,
    pause,
    resume,
  } = useExerciseTimer(allExercises);

  const [beepSound, setBeepSound] = useState<any>(null);

  useEffect(() => {
    // Cargar sonido beep
    // Sound.setCategory('Playback');
    // const sound = new Sound('bip.mp3', Sound.MAIN_BUNDLE, error => {
    //   if (error) {
    //     console.log('Error loading sound', error);
    //   }
    // });
    // setBeepSound(sound);

    start(); // Iniciar automáticamente

    return () => {
      // if (beepSound) {
      //   beepSound.release();
      // }
    };
  }, []);

  // Reproducir beep en últimos 3 segundos
  useEffect(() => {
    const secondsInPhase = isRest ? 10 : 20;
    const elapsed = Math.floor(progress * secondsInPhase);
    const remaining = secondsInPhase - elapsed;

    if (remaining <= 3 && remaining > 0) {
      // if (beepSound) {
      //   beepSound.play();
      // }
    }
  }, [progress, isRest]);

  useEffect(() => {
    // Al terminar todos los ejercicios
    if (currentExercise >= allExercises.length && !isActive) {
      const routineNames = routeParams?.routines
        ?.filter((r: any) => r.selected)
        .map((r: any) => r.name) || [];

      navigation.replace('Congratulations', {
        totalSeconds,
        exercisesDone: allExercises.length,
        routineNames,
      });
    }
  }, [currentExercise, isActive]);

  if (currentExercise >= allExercises.length) {
    return null; // Transitioning
  }

  const exercise = allExercises[currentExercise];
  const phaseColor = isRest ? theme.colors.danger : theme.colors.success;
  const phaseText = isRest ? 'DESCANSO' : 'EJERCICIO';
  const secondsInPhase = isRest ? 10 : 20;
  const secondsRemaining = Math.ceil(secondsInPhase - progress * secondsInPhase);

  return (
    <>
      <KeepAwake />
      <LinearGradient
        colors={[
          theme.colors.gradientStart,
          theme.colors.gradientMid,
          theme.colors.gradientEnd,
        ]}
        style={styles.container}>
        {/* Header con progreso */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              })
            }>
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
            {currentExercise + 1} / {allExercises.length}
          </Text>

          <View style={{width: 30}} />
        </View>

        {/* GIF del ejercicio */}
        <View style={styles.exerciseContainer}>
          <Image source={exercise.gif} style={styles.exerciseGif} />
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

        {/* Fase actual */}
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

        {/* Timer grande */}
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

        {/* Progress bar */}
        <ProgressBar progress={progress} color={phaseColor} />

        {/* Botón pausar/reanudar */}
        <TouchableOpacity
          style={[
            styles.pauseButton,
            {backgroundColor: theme.colors.accent},
          ]}
          onPress={isActive ? pause : resume}
          activeOpacity={0.7}>
          <Icon
            name={isActive ? 'pause' : 'play'}
            size={40}
            color={theme.colors.textOnButton}
          />
        </TouchableOpacity>

        {/* Siguiente ejercicio preview */}
        {currentExercise + 1 < allExercises.length && (
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
              {allExercises[currentExercise + 1].showableName}
            </Text>
          </View>
        )}
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
  },
  exerciseContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  exerciseGif: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    borderRadius: 15,
    marginBottom: 15,
  },
  exerciseName: {
    fontSize: 22,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  phaseContainer: {
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  phaseText: {
    fontSize: 18,
    letterSpacing: 2,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 80,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 40,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 30,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  pauseButton: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    fontSize: 14,
    marginBottom: 5,
  },
  nextName: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default StartRoutine;
