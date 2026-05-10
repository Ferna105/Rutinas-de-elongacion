import React, {useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../theme';
import {useScreenInsets} from '../../../hooks';
import {calculateTotalMinutes} from '../../../data/queries';
import {RoutineSelection} from '../../../data/types';
import RoutineProgress from '../../../components/RoutineProgress';

const AddAccessory: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {theme} = useTheme();
  const insets = useScreenInsets();

  const routines: RoutineSelection[] = useMemo(
    () => route.params?.routines || [],
    [route.params?.routines],
  );

  const totalMinutes = useMemo(
    () => calculateTotalMinutes(routines),
    [routines],
  );

  const handleYes = () => {
    navigation.navigate('AccessoryExercises', route.params);
  };

  const handleNo = () => {
    navigation.navigate('RoutineInformation', route.params);
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
          paddingBottom: 20 + insets.bottom,
        }}>
        <RoutineProgress totalMinutes={totalMinutes} />

        <View style={styles.content}>
          <Icon name="plus-circle" size={70} color={theme.colors.accent} />

          <Text
            style={[
              styles.title,
              {
                fontFamily: theme.typography.fontFamily.bold,
                color: theme.colors.textPrimary,
              },
            ]}>
            ¿Querés agregar ejercicios accesorios?
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                fontFamily: theme.typography.fontFamily.regular,
                color: theme.colors.textSecondary,
              },
            ]}>
            Podés complementar tu rutina con ejercicios específicos por cadena
            muscular.
          </Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: theme.colors.accent}]}
              onPress={handleYes}
              activeOpacity={0.7}>
              <Icon
                name="check"
                size={36}
                color={theme.colors.textOnButton}
              />
              <Text
                style={[
                  styles.buttonText,
                  {
                    fontFamily: theme.typography.fontFamily.bold,
                    color: theme.colors.textOnButton,
                  },
                ]}>
                SÍ
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, {backgroundColor: theme.colors.accent}]}
              onPress={handleNo}
              activeOpacity={0.7}>
              <Icon
                name="close"
                size={36}
                color={theme.colors.textOnButton}
              />
              <Text
                style={[
                  styles.buttonText,
                  {
                    fontFamily: theme.typography.fontFamily.bold,
                    color: theme.colors.textOnButton,
                  },
                ]}>
                NO
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 22,
    marginTop: 8,
  },
});

export default AddAccessory;
