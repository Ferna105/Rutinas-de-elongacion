import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../theme';
import {useScreenInsets} from '../../../hooks';
import {
  getGeneratedRoutine,
  getGeneratedRoutineShowableExercises,
} from '../../../data/queries';
import {
  ExerciseWithAsset,
  RoutineSelection,
  ChainSelection,
} from '../../../data/types';
import AppModal from '../../../components/AppModal';

type ListItem =
  | {type: 'header'; title: string; groupIndex: number}
  | {type: 'exercise'; exercise: ExerciseWithAsset; groupIndex: number; exerciseIndex: number};

interface ExerciseRowProps {
  exercise: ExerciseWithAsset;
  onPress: (exercise: ExerciseWithAsset) => void;
  theme: any;
}

const ExerciseRow = React.memo<ExerciseRowProps>(
  ({exercise, onPress, theme}) => (
    <TouchableOpacity
      style={[
        styles.exerciseCard,
        {backgroundColor: 'rgba(255,255,255,0.05)'},
      ]}
      onPress={() => onPress(exercise)}
      activeOpacity={0.7}>
      {exercise.poster ? (
        <Image
          source={exercise.poster}
          style={styles.exerciseThumbnail}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.exerciseThumbnail,
            {backgroundColor: 'rgba(255,255,255,0.1)'},
          ]}
        />
      )}
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
  ),
  (prev, next) => prev.exercise.eid === next.exercise.eid && prev.theme === next.theme,
);

const RoutineInformation: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {theme} = useTheme();
  const insets = useScreenInsets();

  // Estabilizamos las referencias para que useMemo/useEffect no se disparen en cada render.
  const routinesParam = route.params?.routines;
  const chainsParam = route.params?.chains;
  const routines: RoutineSelection[] = useMemo(
    () => routinesParam || [],
    [routinesParam],
  );
  const chains: ChainSelection[] = useMemo(
    () => chainsParam || [],
    [chainsParam],
  );

  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseWithAsset | null>(null);
  const [showStartReminder, setShowStartReminder] = useState(false);

  const totalMinutes = useMemo(() => {
    const exercises = getGeneratedRoutine({routines, chains});
    const totalSeconds = exercises.length * (20 + 10);
    return Math.ceil(totalSeconds / 60);
  }, [routines, chains]);

  // Calculamos los grupos directamente en useMemo para evitar setStates en useEffect
  // que provoquen "Maximum update depth exceeded".
  const groupedExercises = useMemo<
    Array<{title: string; exercises: ExerciseWithAsset[]}>
  >(() => {
    const grouped = getGeneratedRoutineShowableExercises({routines, chains});
    return Object.entries(grouped).map(([title, exercises]) => ({
      title,
      exercises,
    }));
  }, [routines, chains]);

  const totalExercises = useMemo(
    () =>
      groupedExercises.reduce((sum, group) => sum + group.exercises.length, 0),
    [groupedExercises],
  );

  // Aplanamos los grupos en una lista de items para FlashList
  const flatListData = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];
    groupedExercises.forEach((group, groupIndex) => {
      items.push({type: 'header', title: group.title, groupIndex});
      group.exercises.forEach((exercise, exerciseIndex) => {
        items.push({type: 'exercise', exercise, groupIndex, exerciseIndex});
      });
    });
    return items;
  }, [groupedExercises]);

  const handleStart = useCallback(() => {
    setShowStartReminder(true);
  }, []);

  const handleConfirmStart = useCallback(() => {
    navigation.navigate('StartRoutine', {
      groupedExercises,
      routeParams: route.params,
    });
  }, [navigation, groupedExercises, route.params]);

  const handleSelectExercise = useCallback((exercise: ExerciseWithAsset) => {
    setSelectedExercise(exercise);
  }, []);

  const renderItem = useCallback(
    ({item}: {item: ListItem}) => {
      if (item.type === 'header') {
        return (
          <Text
            style={[
              styles.groupTitle,
              {
                fontFamily: theme.typography.fontFamily.bold,
                color: theme.colors.accent,
              },
            ]}>
            {item.title}
          </Text>
        );
      }
      return <ExerciseRow exercise={item.exercise} onPress={handleSelectExercise} theme={theme} />;
    },
    [theme, handleSelectExercise],
  );

  const getItemType = useCallback((item: ListItem) => {
    return item.type;
  }, []);

  const keyExtractor = useCallback((item: ListItem, index: number) => {
    if (item.type === 'header') {
      return `header-${item.groupIndex}`;
    }
    return `ex-${item.exercise.eid}-${item.groupIndex}-${item.exerciseIndex}`;
  }, []);

  return (
    <LinearGradient
      colors={[
        theme.colors.gradientStart,
        theme.colors.gradientMid,
        theme.colors.gradientEnd,
      ]}
      style={styles.container}>
      <FlashList
        data={flatListData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        estimatedItemSize={76}
        ListHeaderComponent={() => (
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
        )}
        contentContainerStyle={{
          ...styles.listContent,
          paddingBottom: 100 + insets.bottom,
        }}
      />

      <TouchableOpacity
        style={[
          styles.startButton,
          {backgroundColor: theme.colors.accent, bottom: 20},
        ]}
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

      <AppModal
        visible={showStartReminder}
        title="Recordatorio importante"
        message="Durante la elongación deberías sentir tensión moderada, NUNCA dolor. Si sentís dolor, reducí la intensidad o consultá a un profesional."
        buttons={[{text: 'ENTENDIDO', onPress: handleConfirmStart}]}
        onClose={() => setShowStartReminder(false)}
      />

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
                  {selectedExercise.gif ? (
                    <Image
                      source={selectedExercise.gif}
                      style={styles.modalGif}
                      resizeMode="contain"
                    />
                  ) : (
                    <View
                      style={[
                        styles.modalGif,
                        {backgroundColor: 'rgba(255,255,255,0.1)'},
                      ]}
                    />
                  )}
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
  listContent: {
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
