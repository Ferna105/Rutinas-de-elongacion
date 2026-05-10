import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {HomeScreen, Configuration} from '../screens/app';
import {
  SelectGeneralRoutine,
  AddAccessory,
  AccessoryExercises,
  RoutineInformation,
  StartRoutine,
  Congratulations,
} from '../features/routine/screens';
import {useTheme} from '../theme';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const {theme} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.gradientEnd,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily.bold,
          color: '#FFFFFF',
        },
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({navigation}) => ({
          title: 'Rutinas de elongación',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Configuration')}
              style={styles.headerButton}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              activeOpacity={0.7}>
              <Icon name="cog-outline" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="SelectGeneralRoutine"
        component={SelectGeneralRoutine}
        options={{title: 'Elegí tus rutinas'}}
      />
      <Stack.Screen
        name="AddAccessory"
        component={AddAccessory}
        options={{title: 'Ejercicios accesorios'}}
      />
      <Stack.Screen
        name="AccessoryExercises"
        component={AccessoryExercises}
        options={{title: 'Cadenas musculares'}}
      />
      <Stack.Screen
        name="RoutineInformation"
        component={RoutineInformation}
        options={{title: 'Resumen de rutina'}}
      />
      <Stack.Screen
        name="StartRoutine"
        component={StartRoutine}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Congratulations"
        component={Congratulations}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Configuration"
        component={Configuration}
        options={{title: 'Configuración'}}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    paddingHorizontal: 12,
  },
});

export default AppNavigator;
