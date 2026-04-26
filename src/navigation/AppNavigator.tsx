import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen, Explore, Configuration} from '../../screens/app';
import {
  SelectRoutines,
  AddAccessory,
  AccessoryExercises,
  RoutineInformation,
  StartRoutine,
  Congratulations,
} from '../../features/routine/screens';
import {useTheme} from '../../theme';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const {theme} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily.bold,
        },
      }}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Rutinas de elongación'}}
      />
      <Stack.Screen
        name="SelectRoutines"
        component={SelectRoutines}
        options={{title: 'Seleccionar Rutinas'}}
      />
      <Stack.Screen
        name="AddAccessory"
        component={AddAccessory}
        options={{title: 'Ejercicios Accesorios'}}
      />
      <Stack.Screen
        name="AccessoryExercises"
        component={AccessoryExercises}
        options={{title: 'Cadenas Musculares'}}
      />
      <Stack.Screen
        name="RoutineInformation"
        component={RoutineInformation}
        options={{title: 'Resumen de Rutina'}}
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
        name="Explore"
        component={Explore}
        options={{title: 'Explorar Ejercicios'}}
      />
      <Stack.Screen
        name="Configuration"
        component={Configuration}
        options={{title: 'Configuración'}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
