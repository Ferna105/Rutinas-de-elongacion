import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen, Explore, Configuration} from '../../screens/app';
import {
  SelectRoutines,
  AddAccessory,
  AccessoryExercises,
} from '../../features/routine/screens';
import PlaceholderScreen from '../../screens/PlaceholderScreen';
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
        options={{title: 'Resumen de Rutina'}}>
        {() => <PlaceholderScreen title="RoutineInformation" />}
      </Stack.Screen>
      <Stack.Screen
        name="StartRoutine"
        options={{headerShown: false}}>
        {() => <PlaceholderScreen title="StartRoutine" />}
      </Stack.Screen>
      <Stack.Screen
        name="Congratulations"
        options={{headerShown: false}}>
        {() => <PlaceholderScreen title="Congratulations" />}
      </Stack.Screen>
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
