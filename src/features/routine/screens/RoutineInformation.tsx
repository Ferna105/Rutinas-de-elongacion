import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../theme';
import {useRoutineBuilder} from '../../../hooks';
import {ExerciseWithAsset} from '../../../data/types';

const RoutineInformation: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {theme} = useTheme();
  const {generateGroupedRoutine, calculateTotalMinutes} = useRoutineBuilder();

  const [groupedExercises, setGroupedExercises] = useState<
    Array<{title: string; exercises: ExerciseWithAsset[]}>
  >([]);
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseWithAsset | null>(null);

  useEffect(() => {
    const grouped = generateGroupedRoutine();
    setGroupedExercises(grouped);
  }, []);

  const handleStart = () => {
    Alert.alert(
      'Recordatorio Importante',
      'Durante la elongación deberías sentir tensión moderada, NUNCA dolor. Si sentís dolor, reducí la intensidad o consultá a un profesional.',
      [
        {
          text: 'ENTENDIDO',
          onPress: () => {
            navigation.navigate('StartRoutine', {
              groupedExercises,
              routeParams: route.params,
            });
          },
        },
      ],
    );
  };

  const totalExercises = groupedExercises.reduce(
    (sum, group) => sum + group.exercises.length,
    0,
  );
  const totalMinutes = calculateTotalMinutes();

  return (
    <LinearGradient
      colors={[
        theme.colors.gradientStart,
        theme.colors.gradientMid,
        theme.colors.gradientEnd,
      ]}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Resumen superior */}
        <View
          style={[
            styles.summaryCard,
            {backgroundColor: theme.colors.accent},
          ]}>
          <View style={styles.summaryItem}>
            <Icon name="timer" size={30} color={theme.colors.textOnButton} />
            <Text
              style={[
                styles.summaryValue,
                {
                  fontFamily: theme.typography.fontFamily.bold,
                  color: theme.colors.textOnButton,
                },
              ]}>
              {totalMinutes} min
            </Text>
            <Text
              style={[
                styles.summaryLabel,
                {
                  fontFamily: theme.typography.fontFamily.regular,
                  color: theme.colors.textOnButton,
                },
              ]}>
              Duración
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Icon name="run" size={30} color={theme.colors.textOnButton} />
            <Text
              style={[
                styles.summaryValue,
                {
                  fontFamily: theme.typography.fontFamily.bold,
                  color: theme.colors.textOnButton,
                },
              ]}>
              {totalExercises}
            </Text>
            <Text
              style={[
                styles.summaryLabel,
                {
                  fontFamily: theme.typography.fontFamily.regular,
                  color: theme.colors.textOnButton,
                },
              ]}>
              Ejercicios
            </Text>
          </View>
        </View>

        {/* Lista de ejercicios agrupados */}
        {groupedExercises.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.groupContainer}>
            <Text
              style={[
                styles.groupTitle,
                {
                  fontFamily: theme.typography.fontFamily.bold,
                  color: theme.colors.accent,
                },
              ]}>
              {group.title}
            </Text>

            {group.exercises.map((exercise, exerciseIndex) => (
              <TouchableOpacity
                key={exerciseIndex}
                style={[
                  styles.exerciseCard,
                  {backgroundColor: 'rgba(255,255,255,0.05)'},
                ]}
                onPress={() => setSelectedExercise(exercise)}
                activeOpacity={0.7}>
                <Image source={exercise.gif} style={styles.exerciseThumbnail} />
                <View style={styles.exerciseInfo}>
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
                  <Text
                    style={[
                      styles.exerciseTime,
                      {
                        fontFamily: theme.typography.fontFamily.regular,
                        color: theme.colors.textSecondary,
                      },
                    ]}>
                    20" ejercicio • 10" descanso
                  </Text>
                </View>
                <Icon
                  name="information"
                  size={24}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Botón de inicio */}
      <TouchableOpacity
        style={[styles.startButton, {backgroundColor: theme.colors.accent}]}
        onPress={handleStart}
        activeOpacity={0.7}>
        <Icon name="play" size={30} color={theme.colors.textOnButton} />
        <Text
          style={[
            styles.startButtonText,
            {
              fontFamily: theme.typography.fontFamily.bold,
              color: theme.colors.textOnButton,
            },
          ]}>
          INICIAR RUTINA
        </Text>
      </TouchableOpacity>

      {/* Modal de detalle de ejercicio */}
      <Modal
        visible={selectedExercise !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedExercise(null)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: theme.colors.surface},
            ]}>
            <ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedExercise(null)}>
                <Icon name="close" size={30} color={theme.colors.textPrimary} />
              </TouchableOpacity>

              {selectedExercise && (
                <>
                  <Image
                    source={selectedExercise.gif}
                    style={styles.modalGif}
                  />
                  <Text
                    style={[
                      styles.modalTitle,
                      {
                        fontFamily: theme.typography.fontFamily.bold,
                        color: theme.colors.textPrimary,
                      },
                    ]}>
                    {selectedExercise.showableName}
                  </Text>
                  <Text
                    style={[
                      styles.modalDescription,
                      {
                        fontFamily: theme.typography.fontFamily.regular,
                        color: theme.colors.textSecondary,
                      },
                    ]}>
                    {selectedExercise.description}
                  </Text>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  summaryCard: {
    flexDirection: 'row',
    padding: 25,
    borderRadius: 15,
    marginBottom: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 28,
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 15,
  },
  groupContainer: {
    marginBottom: 25,
  },
  groupTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  exerciseCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  exerciseThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    marginBottom: 4,
  },
  exerciseTime: {
    fontSize: 13,
  },
  startButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    fontSize: 18,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalGif: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default RoutineInformation;
