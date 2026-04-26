import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusSelection, SportsSelection, SuccessScreen} from '../../screens/auth';
import {useTheme} from '../../theme';

const Stack = createStackNavigator();

const AuthNavigator: React.FC = () => {
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
        headerTitle: 'Completá tu perfil',
      }}>
      <Stack.Screen
        name="StatusSelection"
        component={StatusSelection}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SportsSelection"
        component={SportsSelection}
      />
      <Stack.Screen
        name="SuccessScreen"
        component={SuccessScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
