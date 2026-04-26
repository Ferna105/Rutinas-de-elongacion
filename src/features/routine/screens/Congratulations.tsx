import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../theme';
import {addSession} from '../../../storage';

const Congratulations: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {theme} = useTheme();

  const {totalSeconds, exercisesDone, routineNames} = route.params || {
    totalSeconds: 0,
    exercisesDone: 0,
    routineNames: [],
  };

  useEffect(() => {
    // Guardar sesión en historial
    saveSession();
  }, []);

  const saveSession = async () => {
    try {
      await addSession({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        totalSeconds,
        exercisesDone,
        routineNames,
      });
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  return (
    <LinearGradient
      colors={[
        theme.colors.gradientStart,
        theme.colors.gradientMid,
        theme.colors.gradientEnd,
      ]}
      style={styles.container}>
      <View style={styles.content}>
        {/* Ícono de éxito */}
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: theme.colors.success},
          ]}>
          <Icon name="check" size={80} color={theme.colors.textOnButton} />
        </View>

        {/* Título */}
        <Text
          style={[
            styles.title,
            {
              fontFamily: theme.typography.fontFamily.bold,
              color: theme.colors.textPrimary,
            },
          ]}>
          ¡FELICITACIONES!
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              fontFamily: theme.typography.fontFamily.regular,
              color: theme.colors.textSecondary,
            },
          ]}>
          Completaste tu rutina de elongación
        </Text>

        {/* Métricas */}
        <View style={styles.metricsContainer}>
          <View
            style={[
              styles.metricCard,
              {backgroundColor: 'rgba(65,189,252,0.1)'},
            ]}>
            <Icon name="timer" size={40} color={theme.colors.accent} />
            <Text
              style={[
                styles.metricValue,
                {
                  fontFamily: theme.typography.fontFamily.bold,
                  color: theme.colors.textPrimary,
                },
              ]}>
              {formatTime(totalSeconds)}
            </Text>
            <Text
              style={[
                styles.metricLabel,
                {
                  fontFamily: theme.typography.fontFamily.regular,
                  color: theme.colors.textSecondary,
                },
              ]}>
              Duración
            </Text>
          </View>

          <View
            style={[
              styles.metricCard,
              {backgroundColor: 'rgba(65,189,252,0.1)'},
            ]}>
            <Icon name="run" size={40} color={theme.colors.accent} />
            <Text
              style={[
                styles.metricValue,
                {
                  fontFamily: theme.typography.fontFamily.bold,
                  color: theme.colors.textPrimary,
                },
              ]}>
              {exercisesDone}
            </Text>
            <Text
              style={[
                styles.metricLabel,
                {
                  fontFamily: theme.typography.fontFamily.regular,
                  color: theme.colors.textSecondary,
                },
              ]}>
              Ejercicios
            </Text>
          </View>
        </View>

        {/* Rutinas completadas */}
        {routineNames.length > 0 && (
          <View style={styles.routinesContainer}>
            <Text
              style={[
                styles.routinesTitle,
                {
                  fontFamily: theme.typography.fontFamily.bold,
                  color: theme.colors.textPrimary,
                },
              ]}>
              Rutinas completadas:
            </Text>
            {routineNames.map((name: string, index: number) => (
              <Text
                key={index}
                style={[
                  styles.routineName,
                  {
                    fontFamily: theme.typography.fontFamily.regular,
                    color: theme.colors.textSecondary,
                  },
                ]}>
                • {name}
              </Text>
            ))}
          </View>
        )}

        {/* Mensaje motivacional */}
        <View
          style={[
            styles.motivationCard,
            {backgroundColor: 'rgba(65,189,252,0.15)'},
          ]}>
          <Icon
            name="heart"
            size={24}
            color={theme.colors.danger}
            style={styles.heartIcon}
          />
          <Text
            style={[
              styles.motivationText,
              {
                fontFamily: theme.typography.fontFamily.regular,
                color: theme.colors.textSecondary,
              },
            ]}>
            La constancia es clave. Seguí elongando regularmente para mejorar tu
            flexibilidad y prevenir lesiones.
          </Text>
        </View>

        {/* Botón volver */}
        <TouchableOpacity
          style={[
            styles.homeButton,
            {backgroundColor: theme.colors.accent},
          ]}
          onPress={handleGoHome}
          activeOpacity={0.7}>
          <Icon name="home" size={24} color={theme.colors.textOnButton} />
          <Text
            style={[
              styles.homeButtonText,
              {
                fontFamily: theme.typography.fontFamily.bold,
                color: theme.colors.textOnButton,
              },
            ]}>
            VOLVER AL INICIO
          </Text>
        </TouchableOpacity>
      </View>
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
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  metricCard: {
    flex: 1,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  metricValue: {
    fontSize: 28,
    marginTop: 10,
  },
  metricLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  routinesContainer: {
    width: '100%',
    marginBottom: 25,
  },
  routinesTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  routineName: {
    fontSize: 15,
    marginVertical: 3,
  },
  motivationCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  heartIcon: {
    marginRight: 10,
  },
  motivationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  homeButton: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  homeButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Congratulations;
