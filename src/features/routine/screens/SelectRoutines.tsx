import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../theme';
import {useAuth} from '../../../components/AuthContext';
import {getUserRoutines} from '../../../data/queries';
import {useRoutineBuilder} from '../../../hooks';

const SelectRoutines: React.FC = () => {
  const navigation = useNavigation<any>();
  const {theme} = useTheme();
  const {profile} = useAuth();
  const {
    routines,
    setRoutines,
    toggleRoutineSelection,
    setRoutineLevel,
    calculateTotalMinutes,
  } = useRoutineBuilder();

  useEffect(() => {
    if (profile) {
      const userRoutines = getUserRoutines(profile);
      setRoutines(userRoutines);
    }
  }, [profile]);

  const handleNext = () => {
    const hasSelection = routines.some(r => r.selected);
    if (!hasSelection) {
      return; // Opcional: mostrar alerta
    }
    navigation.navigate('AddAccessory', {routines});
  };

  const selectedCount = routines.filter(r => r.selected).length;
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
        <Text
          style={[
            styles.title,
            {
              fontFamily: theme.typography.fontFamily.bold,
              color: theme.colors.textPrimary,
            },
          ]}>
          Seleccioná tus rutinas
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              fontFamily: theme.typography.fontFamily.regular,
              color: theme.colors.textSecondary,
            },
          ]}>
          Elegí el nivel de intensidad para cada una
        </Text>

        {/* Materiales necesarios */}
        <View style={[styles.materialsCard, {backgroundColor: 'rgba(65,189,252,0.1)'}]}>
          <Icon name="information" size={24} color={theme.colors.accent} />
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

        {/* Lista de rutinas */}
        {routines.map(routine => (
          <View
            key={routine.rid}
            style={[
              styles.routineCard,
              {
                backgroundColor: routine.selected
                  ? 'rgba(65,189,252,0.2)'
                  : 'rgba(255,255,255,0.12)',
                borderColor: routine.selected
                  ? theme.colors.accent
                  : 'transparent',
              },
            ]}>
            <View style={styles.routineHeader}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => toggleRoutineSelection(routine.rid)}
                activeOpacity={0.7}>
                <Icon
                  name={
                    routine.selected
                      ? 'checkbox-marked'
                      : 'checkbox-blank-outline'
                  }
                  size={28}
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
            </View>

            {routine.selected && (
              <View style={styles.levelContainer}>
                <Text
                  style={[
                    styles.levelLabel,
                    {
                      fontFamily: theme.typography.fontFamily.regular,
                      color: theme.colors.textPrimary,
                    },
                  ]}>
                  Nivel:
                </Text>
                <View
                  style={[
                    styles.pickerContainer,
                    {backgroundColor: 'rgba(0,0,0,0.35)'},
                  ]}>
                  <Picker
                    selectedValue={routine.level.toString()}
                    onValueChange={value =>
                      setRoutineLevel(routine.rid, parseInt(value) as 1 | 2 | 3)
                    }
                    style={styles.picker}
                    dropdownIconColor="#FFFFFF"
                    mode="dropdown">
                    <Picker.Item label="1" value="1" color="#000000" />
                    <Picker.Item label="2" value="2" color="#000000" />
                    <Picker.Item label="3" value="3" color="#000000" />
                  </Picker>
                </View>
                <Text
                  style={[
                    styles.exerciseCount,
                    {
                      fontFamily: theme.typography.fontFamily.regular,
                      color: theme.colors.textPrimary,
                    },
                  ]}>
                  {routine.exercisesLength || 0} ejercicios
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Tiempo total */}
        {selectedCount > 0 && (
          <View
            style={[
              styles.totalCard,
              {backgroundColor: theme.colors.accent},
            ]}>
            <Text
              style={[
                styles.totalLabel,
                {
                  fontFamily: theme.typography.fontFamily.regular,
                  color: theme.colors.textOnButton,
                },
              ]}>
              Tiempo estimado:
            </Text>
            <Text
              style={[
                styles.totalTime,
                {
                  fontFamily: theme.typography.fontFamily.bold,
                  color: theme.colors.textOnButton,
                },
              ]}>
              {totalMinutes} minutos
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.nextButton,
          {
            backgroundColor:
              selectedCount > 0
                ? theme.colors.accent
                : 'rgba(255,255,255,0.2)',
          },
        ]}
        onPress={handleNext}
        disabled={selectedCount === 0}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.nextButtonText,
            {
              fontFamily: theme.typography.fontFamily.bold,
              color:
                selectedCount > 0
                  ? theme.colors.textOnButton
                  : theme.colors.textSecondary,
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
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  materialsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  materialsText: {
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  routineCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routineName: {
    fontSize: 17,
    marginLeft: 10,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  levelLabel: {
    fontSize: 15,
    marginRight: 10,
  },
  pickerContainer: {
    borderRadius: 5,
    marginRight: 15,
    minWidth: 110,
    height: 50,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    width: 110,
    height: 50,
    color: '#fff',
  },
  exerciseCount: {
    fontSize: 14,
  },
  totalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalTime: {
    fontSize: 24,
  },
  nextButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextButtonText: {
    fontSize: 18,
  },
});

export default SelectRoutines;
