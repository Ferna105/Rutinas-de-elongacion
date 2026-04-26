import React, {useEffect, useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../../../theme';
import {getChains} from '../../../data/queries';
import {useRoutineBuilder, useScreenInsets} from '../../../hooks';

const AccessoryExercises: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {theme} = useTheme();
  const insets = useScreenInsets();
  const {chains, setChains, toggleChainSelection, setChainLevel} = useRoutineBuilder();

  const allChains = useMemo(() => getChains(), []);

  const chainStateById = useMemo(
    () => new Map(chains.map(c => [c.cid, c])),
    [chains],
  );

  useEffect(() => {
    setChains(
      allChains.map(c => ({
        cid: c.cid,
        name: c.name,
        imageKey: c.cid,
        selected: false,
        level: 1,
      })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChainPress = (cid: string, name: string) => {
    const chain = chainStateById.get(cid);
    
    if (chain?.selected) {
      // Deseleccionar
      toggleChainSelection(cid);
    } else {
      // Mostrar selector de nivel
      Alert.alert(
        name,
        '¿Qué nivel querés entrenar?',
        [
          {
            text: 'Nivel 1',
            onPress: () => {
              setChainLevel(cid, 1);
              toggleChainSelection(cid);
            },
          },
          {
            text: 'Nivel 2',
            onPress: () => {
              setChainLevel(cid, 2);
              toggleChainSelection(cid);
            },
          },
          {
            text: 'Nivel 3',
            onPress: () => {
              setChainLevel(cid, 3);
              toggleChainSelection(cid);
            },
          },
          {text: 'Cancelar', style: 'cancel'},
        ],
      );
    }
  };

  const handleNext = () => {
    navigation.navigate('RoutineInformation', {
      ...route.params,
      chains,
    });
  };

  const selectedCount = chains.filter(c => c.selected).length;

  return (
    <LinearGradient
      colors={[
        theme.colors.gradientStart,
        theme.colors.gradientMid,
        theme.colors.gradientEnd,
      ]}
      style={styles.container}>
      <ScrollView contentContainerStyle={{
        ...styles.scrollContent,
        paddingBottom: 100 + insets.bottom,
      }}>
        <Text
          style={[
            styles.title,
            {
              fontFamily: theme.typography.fontFamily.bold,
              color: theme.colors.textPrimary,
            },
          ]}>
          Cadenas Musculares
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              fontFamily: theme.typography.fontFamily.regular,
              color: theme.colors.textSecondary,
            },
          ]}>
          Tocá una cadena para seleccionar el nivel
        </Text>

        <View style={styles.grid}>
          {allChains.map(chain => {
            const chainState = chainStateById.get(chain.cid);
            const isSelected = chainState?.selected || false;
            const level = chainState?.level || 1;

            return (
              <TouchableOpacity
                key={chain.cid}
                style={[
                  styles.chainCard,
                  {
                    backgroundColor: isSelected
                      ? 'rgba(65,189,252,0.3)'
                      : 'rgba(255,255,255,0.05)',
                    borderColor: isSelected
                      ? theme.colors.accent
                      : 'transparent',
                  },
                ]}
                onPress={() => handleChainPress(chain.cid, chain.name)}
                activeOpacity={0.7}>
                <Image source={chain.image} style={styles.chainImage} />
                <Text
                  style={[
                    styles.chainName,
                    {
                      fontFamily: theme.typography.fontFamily.bold,
                      color: isSelected
                        ? theme.colors.textPrimary
                        : theme.colors.textSecondary,
                    },
                  ]}>
                  {chain.name}
                </Text>
                {isSelected && (
                  <View
                    style={[
                      styles.levelBadge,
                      {backgroundColor: theme.colors.accent},
                    ]}>
                    <Text
                      style={[
                        styles.levelText,
                        {
                          fontFamily: theme.typography.fontFamily.bold,
                          color: theme.colors.textOnButton,
                        },
                      ]}>
                      Nivel {level}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.nextButton,
          {backgroundColor: theme.colors.accent, bottom: 20},
        ]}
        onPress={handleNext}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.nextButtonText,
            {
              fontFamily: theme.typography.fontFamily.bold,
              color: theme.colors.textOnButton,
            },
          ]}>
          {selectedCount > 0 ? `SIGUIENTE (${selectedCount})` : 'CONTINUAR SIN ACCESORIOS'}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chainCard: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    alignItems: 'center',
  },
  chainImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  chainName: {
    fontSize: 14,
    textAlign: 'center',
  },
  levelBadge: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
  },
  nextButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextButtonText: {
    fontSize: 16,
  },
});

export default AccessoryExercises;
