import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../theme';
import {useAuth} from '../../../components/AuthContext';
import {useScreenInsets} from '../../../hooks';
import {
  getRoutinesByType,
  minutesForLevel,
  calculateTotalMinutes,
} from '../../../data/queries';
import {RoutineSelection} from '../../../data/types';
import RoutineProgress from '../../../components/RoutineProgress';

const SelectGeneralRoutine: React.FC = () => {
  const navigation = useNavigation<any>();
  const {theme} = useTheme();
  const {profile} = useAuth();
  const insets = useScreenInsets();

  const generalRoutine = useMemo(() => getRoutinesByType('general'), []);
  const [level, setLevel] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (!generalRoutine) {
      // Si no hay rutina general configurada en la base, no podemos avanzar.
      return;
    }
  }, [generalRoutine]);

  if (!generalRoutine) {
    return (
      <LinearGradient
        colors={[
          theme.colors.gradientStart,
          theme.colors.gradientMid,
          theme.colors.gradientEnd,
        ]}
        style={styles.container}>
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: theme.typography.fontFamily.bold,
                color: theme.colors.textPrimary,
              },
            ]}>
            No hay una rutina general disponible.
          </Text>
        </View>
      </LinearGradient>
    );
  }

  const exercisesLength = generalRoutine.exercisesLength || 0;
  const options: Array<{level: 1 | 2 | 3; minutes: number}> = useMemo(
    () => [
      {level: 1, minutes: minutesForLevel(exercisesLength, 1)},
      {level: 2, minutes: minutesForLevel(exercisesLength, 2)},
      {level: 3, minutes: minutesForLevel(exercisesLength, 3)},
    ],
    [exercisesLength],
  );

  const selectedRoutine: RoutineSelection = {
    rid: generalRoutine.rid,
    name: generalRoutine.name,
    type: generalRoutine.type,
    sid: generalRoutine.sid,
    selected: true,
    level,
    exercisesLength,
  };

  const totalMinutes = calculateTotalMinutes([selectedRoutine]);

  const hasSports = !!(
    profile?.status &&
    profile.sports &&
    profile.sports.length > 0
  );

  const handleNext = () => {
    const routines: RoutineSelection[] = [selectedRoutine];
    if (hasSports) {
      navigation.navigate('SelectSportRoutines', {routines});
    } else {
      navigation.navigate('AddAccessory', {routines});
    }
  };

  return (
    <LinearGradient
      colors={[
        theme.colors.gradientStart,
        theme.colors.gradientMid,
        theme.colors.gradientEnd,
      ]}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          ...styles.scrollContent,
          paddingBottom: 100 + insets.bottom,
        }}>
        <Text
          style={[
            styles.title,
            {
              fontFamily: theme.typography.fontFamily.bold,
              color: theme.colors.textPrimary,
            },
          ]}>
          Rutina general
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              fontFamily: theme.typography.fontFamily.regular,
              color: theme.colors.textSecondary,
            },
          ]}>
          Elegí cuántos minutos de trabajo querés hacer.
        </Text>

        <RoutineProgress totalMinutes={totalMinutes} />

        <View
          style={[
            styles.materialsCard,
            {backgroundColor: 'rgba(65,189,252,0.1)'},
          ]}>
          <Icon
            name="information"
            size={22}
            color={theme.colors.accent}
          />
          <Text
            style={[
              styles.materialsText,
              {
                fontFamily: theme.typography.fontFamily.regular,
                color: theme.colors.textSecondary,
              },
            ]}>
            Materiales: silla, soga, bastón, libro grueso
          </Text>
        </View>

        <View
          style={[
            styles.routineCard,
            {
              backgroundColor: 'rgba(65,189,252,0.15)',
              borderColor: theme.colors.accent,
            },
          ]}>
          <Text
            style={[
              styles.routineName,
              {
                fontFamily: theme.typography.fontFamily.bold,
                color: theme.colors.textPrimary,
              },
            ]}>
            {generalRoutine.name}
          </Text>
          <Text
            style={[
              styles.exerciseHint,
              {
                fontFamily: theme.typography.fontFamily.regular,
                color: theme.colors.textSecondary,
              },
            ]}>
            {exercisesLength} ejercicios disponibles
          </Text>

          <View style={styles.optionsRow}>
            {options.map(opt => {
              const isSelected = level === opt.level;
              return (
                <TouchableOpacity
                  key={opt.level}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.accent
                        : 'rgba(255,255,255,0.08)',
                      borderColor: isSelected
                        ? theme.colors.accent
                        : 'rgba(255,255,255,0.15)',
                    },
                  ]}
                  onPress={() => setLevel(opt.level)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.optionMinutes,
                      {
                        fontFamily: theme.typography.fontFamily.bold,
                        color: isSelected
                          ? theme.colors.textOnButton
                          : theme.colors.textPrimary,
                      },
                    ]}>
                    {opt.minutes}
                  </Text>
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        fontFamily: theme.typography.fontFamily.regular,
                        color: isSelected
                          ? theme.colors.textOnButton
                          : theme.colors.textSecondary,
                      },
                    ]}>
                    min
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.nextButton,
          {
            bottom: 20 + insets.bottom,
            backgroundColor: theme.colors.accent,
          },
        ]}
        onPress={handleNext}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.nextButtonText,
            {
              fontFamily: theme.typography.fontFamily.bold,
              color: theme.colors.textOnButton,
            },
          ]}>
          SIGUIENTE
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 20,
  },
  materialsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    gap: 10,
  },
  materialsText: {
    fontSize: 13,
    flex: 1,
  },
  routineCard: {
    padding: 18,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  routineName: {
    fontSize: 18,
    marginBottom: 4,
  },
  exerciseHint: {
    fontSize: 13,
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  optionMinutes: {
    fontSize: 26,
  },
  optionLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  nextButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextButtonText: {
    fontSize: 17,
  },
});

export default SelectGeneralRoutine;
