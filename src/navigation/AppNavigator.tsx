import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PlaceholderScreen from '../../screens/PlaceholderScreen';
import {useTheme} from '../../theme';

const Stack = createStackNavigator();

// AppNavigator temporal - se completará con las pantallas reales
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
        options={{title: 'Rutinas de elongación'}}>
        {() => <PlaceholderScreen title="Home" />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AppNavigator;
