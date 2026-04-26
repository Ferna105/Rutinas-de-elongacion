import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import {useTheme} from '../../theme';
import {sliderImages} from '../../data/assets';
import {loadSessions} from '../../storage';
import {CompletedSession} from '../../data/types';

const {width: screenWidth} = Dimensions.get('window');

// Tips que aparecen en el carousel (basados en el original)
const tips = [
  {id: 0, text: 'Bienvenido a Rutinas de Elongación', highlight: true},
  {id: 1, text: 'La elongación miofascial ayuda a liberar tensiones'},
  {id: 2, text: 'Realiza estos ejercicios de forma suave y progresiva'},
  {id: 3, text: 'Mantén cada posición entre 20 y 30 segundos'},
  {id: 4, text: 'Respira profundamente durante cada ejercicio'},
  {id: 5, text: 'No debe haber dolor, solo tensión moderada'},
  {id: 6, text: 'La constancia es clave para ver resultados'},
  {id: 7, text: 'Hidrátate bien antes y después de elongar'},
  {id: 8, text: 'Estos ejercicios complementan tu entrenamiento'},
  {id: 9, text: 'Escucha a tu cuerpo y respeta sus límites'},
  {id: 10, text: 'Puedes hacer estas rutinas en cualquier momento'},
  {id: 11, text: 'Materiales necesarios: silla, soga, bastón, libro'},
  {id: 12, text: 'La elongación mejora tu rendimiento deportivo'},
  {id: 13, text: 'Previene lesiones y acelera la recuperación'},
  {id: 14, text: 'Dedica 10-20 minutos diarios a elongar'},
  {id: 15, text: 'Explora la biblioteca de ejercicios para aprender más'},
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {theme} = useTheme();
  const [sessions, setSessions] = useState<CompletedSession[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    loadSessionHistory();
  }, []);

  const loadSessionHistory = async () => {
    const history = await loadSessions();
    setSessions(history.slice(0, 3)); // Últimas 3 sesiones
  };

  const renderCarouselItem = ({index}: {index: number}) => {
    const tip = tips[index];
    const image = sliderImages[index];

    return (
      <View style={styles.carouselItem}>
        <Image
          source={image}
          style={styles.carouselImage}
          resizeMode="contain"
        />
        <View
          style={[
            styles.tipContainer,
            {backgroundColor: 'rgba(7,4,33,0.65)'},
          ]}>
          <Text
            style={[
              styles.tipText,
              {
                fontFamily: tip.highlight
                  ? theme.typography.fontFamily.bold
                  : theme.typography.fontFamily.regular,
                color: theme.colors.textPrimary,
              },
            ]}>
            {tip.text}
          </Text>
        </View>
      </View>
    );
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) {
      return 'Hoy';
    } else if (diffHours < 48) {
      return 'Ayer';
    } else {
      const days = Math.floor(diffHours / 24);
      return `Hace ${days} días`;
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient
      colors={[
        theme.colors.gradientStart,
        theme.colors.gradientMid,
        theme.colors.gradientEnd,
      ]}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Carousel */}
        <View style={styles.carouselContainer}>
          <Carousel
            width={screenWidth - 40}
            height={200}
            data={tips}
            renderItem={renderCarouselItem}
            onSnapToItem={setActiveSlide}
            loop
            autoPlay
            autoPlayInterval={4000}
          />
          <View style={styles.pagination}>
            {tips.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor:
                      activeSlide === index
                        ? theme.colors.accent
                        : 'rgba(255,255,255,0.3)',
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Historial de sesiones */}
        {sessions.length > 0 && (
          <View style={styles.historyContainer}>
            <Text
              style={[
                styles.historyTitle,
                {
                  fontFamily: theme.typography.fontFamily.bold,
                  color: theme.colors.textPrimary,
                },
              ]}>
              Últimas Sesiones
            </Text>
            {sessions.map(session => (
              <View
                key={session.id}
                style={[
                  styles.sessionCard,
                  {backgroundColor: 'rgba(65,189,252,0.1)'},
                ]}>
                <View style={styles.sessionHeader}>
                  <Text
                    style={[
                      styles.sessionDate,
                      {
                        fontFamily: theme.typography.fontFamily.bold,
                        color: theme.colors.accent,
                      },
                    ]}>
                    {formatDate(session.date)}
                  </Text>
                  <Text
                    style={[
                      styles.sessionDuration,
                      {
                        fontFamily: theme.typography.fontFamily.regular,
                        color: theme.colors.textSecondary,
                      },
                    ]}>
                    {formatDuration(session.totalSeconds)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.sessionDetails,
                    {
                      fontFamily: theme.typography.fontFamily.regular,
                      color: theme.colors.textSecondary,
                    },
                  ]}>
                  {session.exercisesDone} ejercicios • {session.routineNames.join(', ')}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Botones principales */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.mainButton,
              {backgroundColor: theme.colors.accent},
            ]}
            onPress={() => navigation.navigate('SelectRoutines')}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.mainButtonText,
                {
                  fontFamily: theme.typography.fontFamily.bold,
                  color: theme.colors.textOnButton,
                },
              ]}>
              COMENZAR RUTINA
            </Text>
          </TouchableOpacity>

          <View style={styles.secondaryButtons}>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                {backgroundColor: 'rgba(65,189,252,0.3)'},
              ]}
              onPress={() => navigation.navigate('Explore')}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.secondaryButtonText,
                  {
                    fontFamily: theme.typography.fontFamily.bold,
                    color: theme.colors.textPrimary,
                  },
                ]}>
                EXPLORAR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                {backgroundColor: 'rgba(65,189,252,0.3)'},
              ]}
              onPress={() => navigation.navigate('Configuration')}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.secondaryButtonText,
                  {
                    fontFamily: theme.typography.fontFamily.bold,
                    color: theme.colors.textPrimary,
                  },
                ]}>
                CONFIGURACIÓN
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
    paddingBottom: 20,
  },
  carouselContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  carouselItem: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  tipContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  tipText: {
    fontSize: 16,
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  historyContainer: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  historyTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  sessionCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  sessionDate: {
    fontSize: 16,
  },
  sessionDuration: {
    fontSize: 14,
  },
  sessionDetails: {
    fontSize: 14,
  },
  buttonsContainer: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  mainButton: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mainButtonText: {
    fontSize: 18,
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  secondaryButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  secondaryButtonText: {
    fontSize: 14,
  },
});

export default HomeScreen;
