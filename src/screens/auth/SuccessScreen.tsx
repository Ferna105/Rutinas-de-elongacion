import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../../theme';
import {useAuth} from '../../components/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SuccessScreen: React.FC = () => {
  const route = useRoute<any>();
  const {theme} = useTheme();
  const {signIn} = useAuth();

  const handleStart = async () => {
    const profile = {
      status: route.params?.status || false,
      sports: route.params?.sports || [],
    };
    
    await signIn(profile);
    // La navegación a AppStack se maneja automáticamente por el estado de profile en App.tsx
  };

  const hasSports = route.params?.sports && route.params.sports.length > 0;

  return (
    <LinearGradient
      colors={[
        theme.colors.gradientStart,
        theme.colors.gradientMid,
        theme.colors.gradientEnd,
      ]}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Icon
          name="check-circle"
          size={100}
          color={theme.colors.success}
          style={styles.icon}
        />

        <Text
          style={[
            styles.title,
            {
              fontFamily: theme.typography.fontFamily.bold,
              color: theme.colors.textPrimary,
            },
          ]}>
          ¡Perfil completado!
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              fontFamily: theme.typography.fontFamily.regular,
              color: theme.colors.textSecondary,
            },
          ]}>
          {hasSports
            ? `Has seleccionado ${route.params.sports.length} deporte${
                route.params.sports.length > 1 ? 's' : ''
              }`
            : 'No practicás ningún deporte por ahora'}
        </Text>

        {hasSports && (
          <View style={styles.sportsList}>
            {route.params.sports.map((sport: any) => (
              <View
                key={sport.sid}
                style={[
                  styles.sportItem,
                  {backgroundColor: 'rgba(65,189,252,0.2)'},
                ]}>
                <Icon
                  name="check"
                  size={20}
                  color={theme.colors.accent}
                />
                <Text
                  style={[
                    styles.sportText,
                    {
                      fontFamily: theme.typography.fontFamily.regular,
                      color: theme.colors.textSecondary,
                    },
                  ]}>
                  {sport.name}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Text
          style={[
            styles.message,
            {
              fontFamily: theme.typography.fontFamily.regular,
              color: theme.colors.textSecondary,
            },
          ]}>
          Podés modificar tu perfil en cualquier momento desde la configuración.
        </Text>
      </ScrollView>

      <TouchableOpacity
        style={[styles.startButton, {backgroundColor: theme.colors.accent}]}
        onPress={handleStart}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.startText,
            {
              fontFamily: theme.typography.fontFamily.bold,
              color: theme.colors.textOnButton,
            },
          ]}>
          COMENZAR
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
  icon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 30,
  },
  sportsList: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 30,
  },
  sportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  sportText: {
    fontSize: 16,
    marginLeft: 10,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    opacity: 0.8,
  },
  startButton: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startText: {
    fontSize: 18,
  },
});

export default SuccessScreen;
