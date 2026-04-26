import React from 'react';
import {StatusBar, ActivityIndicator, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ThemeProvider, useTheme} from './src/theme';
import {AuthProvider, useAuth} from './src/components/AuthContext';
import {AuthNavigator, AppNavigator} from './src/navigation';

// Componente interno que usa los hooks de contexto
const AppContent: React.FC = () => {
  const {theme, isDark} = useTheme();
  const {profile, isLoading} = useAuth();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, {backgroundColor: theme.colors.background}]}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.primary}
      />
      <NavigationContainer>
        {profile ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </>
  );
};

// Componente raíz con providers
function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
