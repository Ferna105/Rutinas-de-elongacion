import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../theme';
import {useAuth} from '../../../components/AuthContext';
import {useScreenInsets} from '../../../hooks';
import {
  getRoutineBySid,
  minutesForLevel,
  calculateTotalMinutes,
} from '../../../data/queries';
import {RoutineSelection} from '../../../data/types';
import RoutineProgress from '../../../components/RoutineProgress';

const SelectSportRoutines: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {theme} = useTheme();
  const {profile} = useAuth();
  const insets = useScreenInsets();

  const previousRoutines: RoutineSelection[] = useMemo(
    () => route.params?.routines || [],
    [route.params?.routines],
  );

  const sportRoutines: RoutineSelection[] = useMemo(() => {
    if (!profile?.status || !profile.sports) {
      return [];
    }
    return profile.sports
      .map(sport => {
        const r = getRoutineBySid(sport.sid);
        if (!r) return null;
        return {
          rid: r.rid,
          name: r.name,
          type: r.type,
          sid: r.sid,
          selected: false,
          level: 1,
          exercisesLength: r.exercisesLength,
        } as RoutineSelection;
      })
      .filter((r): r is RoutineSelection => r !== null);
  }, [profile]);

  const [selections, setSelections] =
    useState<RoutineSelection[]>(sportRoutines);

  useEffect(() => {
    setSelections(sportRoutines);
  }, [sportRoutines]);

  const toggleSelected = (rid: string) => {
    setSelections(prev =>
      prev.map(r => (r.rid === rid ? {...r, selected: !r.selected} : r)),
    );
  };

  const setLevel = (rid: string, level: 1 | 2 | 3) => {
    setSelections(prev =>
      prev.map(r => (r.rid === rid ? {...r, level, selected: true} : r)),
    );
  };

  const allRoutines: RoutineSelection[] = useMemo(
    () => [...previousRoutines, ...selections.filter(s => s.selected)],
    [previousRoutines, selections],
  );

  const totalMinutes = useMemo(
    () => calculateTotalMinutes(allRoutines),
    [allRoutines],
  );

  const handleNext = () => {
    navigation.navigate('AddAccessory', {routines: allRoutines});
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
          Rutinas por deporte
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              fontFamily: theme.typography.fontFamily.regular,
              color: theme.colors.textSecondary,
            },
          ]}>
          Sumá rutinas específicas para tus deportes y elegí los minutos.
        </Text>

        <RoutineProgress totalMinutes={totalMinutes} />

        {selections.length === 0 && (
          <View
            style={[
              styles.emptyCard,
              {backgroundColor: 'rgba(255,255,255,0.06)'},
            ]}>
            <Icon
              name="information"
              size={22}
              color={theme.colors.accent}
            />
            <Text
              style={[
                styles.emptyText,
                {
                  fontFamily: theme.typography.fontFamily.regular,
                  color: theme.colors.textSecondary,
                },
              ]}>
              No tenés deportes configurados. Podés tocar SIGUIENTE para
              continuar.
            </Text>
          </View>
        )}

        {selections.map(routine => {
          const length = routine.exercisesLength || 0;
          const options: Array<{level: 1 | 2 | 3; minutes: number}> = [
            {level: 1, minutes: minutesForLevel(length, 1)},
            {level: 2, minutes: minutesForLevel(length, 2)},
            {level: 3, minutes: minutesForLevel(length, 3)},
          ];
          return (
            <View
              key={routine.rid}
              style={[
                styles.routineCard,
                {
                  backgroundColor: routine.selected
                    ? 'rgba(65,189,252,0.15)'
                    : 'rgba(255,255,255,0.06)',
                  borderColor: routine.selected
                    ? theme.colors.accent
                    : 'rgba(255,255,255,0.12)',
                },
              ]}>
              <TouchableOpacity
                style={styles.routineHeader}
                onPress={() => toggleSelected(routine.rid)}
                activeOpacity={0.7}>
                <Icon
                  name={
                    routine.selected
                      ? 'checkbox-marked'
                      : 'checkbox-blank-outline'
                  }
                  size={26}
                  color={
                    routine.selected
                      ? theme.colors.accent
                      : theme.colors.textPrimary
                  }
                />
                <Text
                  style={[
                    styles.routineName,
                    {
                      fontFamily: theme.typography.fontFamily.bold,
                      color: theme.colors.textPrimary,
                    },
                  ]}>
                  {routine.name}
                </Text>
              </TouchableOpacity>

              {routine.selected && (
                <>
                  <Text
                    style={[
                      styles.exerciseHint,
                      {
                        fontFamily: theme.typography.fontFamily.regular,
                        color: theme.colors.textSecondary,
                      },
                    ]}>
                    {length} ejercicios disponibles
                  </Text>
                  <View style={styles.optionsRow}>
                    {options.map(opt => {
                      const isSel = routine.level === opt.level;
                      return (
                        <TouchableOpacity
                          key={opt.level}
                          style={[
                            styles.optionButton,
                            {
                              backgroundColor: isSel
                                ? theme.colors.accent
                                : 'rgba(255,255,255,0.08)',
                              borderColor: isSel
                                ? theme.colors.accent
                                : 'rgba(255,255,255,0.15)',
                            },
                          ]}
                          onPress={() => setLevel(routine.rid, opt.level)}
                          activeOpacity={0.7}>
                          <Text
                            style={[
                              styles.optionMinutes,
                              {
                                fontFamily: theme.typography.fontFamily.bold,
                                color: isSel
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
                                fontFamily:
                                  theme.typography.fontFamily.regular,
                                color: isSel
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
                </>
              )}
            </View>
          );
        })}
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
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    flex: 1,
  },
  routineCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routineName: {
    fontSize: 17,
    flex: 1,
  },
  exerciseHint: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  optionMinutes: {
    fontSize: 22,
  },
  optionLabel: {
    fontSize: 11,
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

export default SelectSportRoutines;
