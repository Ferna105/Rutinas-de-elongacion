import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../../../theme';
import {
  getChains,
  getExerciseByCid,
  minutesForLevel,
  calculateTotalMinutes,
} from '../../../data/queries';
import {useRoutineBuilder, useScreenInsets} from '../../../hooks';
import {RoutineSelection} from '../../../data/types';
import RoutineProgress from '../../../components/RoutineProgress';
import AppModal, {ModalButton} from '../../../components/AppModal';

const AccessoryExercises: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {theme} = useTheme();
  const insets = useScreenInsets();
  const {chains, setChains, toggleChainSelection, setChainLevel} =
    useRoutineBuilder();

  const allChains = useMemo(() => getChains(), []);

  const chainStateById = useMemo(
    () => new Map(chains.map(c => [c.cid, c])),
    [chains],
  );

  const previousRoutines: RoutineSelection[] = useMemo(
    () => route.params?.routines || [],
    [route.params?.routines],
  );

  // Pre-calcula longitudes por cadena (cantidad de ejercicios)
  const chainLengthById = useMemo(() => {
    const map = new Map<string, number>();
    allChains.forEach(c => {
      map.set(c.cid, getExerciseByCid(c.cid).length);
    });
    return map;
  }, [allChains]);

  const totalMinutes = useMemo(
    () => calculateTotalMinutes(previousRoutines, chains),
    [previousRoutines, chains],
  );

  const [pickerChain, setPickerChain] = useState<{
    cid: string;
    name: string;
  } | null>(null);

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
      toggleChainSelection(cid);
    } else {
      setPickerChain({cid, name});
    }
  };

  const handleNext = () => {
    navigation.navigate('RoutineInformation', {
      ...route.params,
      chains,
    });
  };

  const selectedCount = chains.filter(c => c.selected).length;

  const pickerOptions: ModalButton[] = useMemo(() => {
    if (!pickerChain) {
      return [];
    }
    const length = chainLengthById.get(pickerChain.cid) || 0;
    return [
      ...([1, 2, 3] as const).map(level => ({
        text: `${minutesForLevel(length, level)} min`,
        onPress: () => {
          setChainLevel(pickerChain.cid, level);
          toggleChainSelection(pickerChain.cid);
        },
      })),
      {text: 'Cancelar', style: 'cancel' as const},
    ];
  }, [pickerChain, chainLengthById, setChainLevel, toggleChainSelection]);

  return (
    <LinearGradient
      colors={[
        theme.colors.gradientStart,
        theme.colors.gradientMid,
        theme.colors.gradientEnd,
      ]}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={{
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
          Cadenas musculares
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              fontFamily: theme.typography.fontFamily.regular,
              color: theme.colors.textSecondary,
            },
          ]}>
          Tocá una cadena para sumarla y elegir cuántos minutos.
        </Text>

        <RoutineProgress totalMinutes={totalMinutes} />

        <View style={styles.grid}>
          {allChains.map(chain => {
            const chainState = chainStateById.get(chain.cid);
            const isSelected = chainState?.selected || false;
            const level = chainState?.level || 1;
            const minutes = isSelected
              ? minutesForLevel(chainLengthById.get(chain.cid) || 0, level)
              : 0;

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
                      styles.minutesBadge,
                      {backgroundColor: theme.colors.accent},
                    ]}>
                    <Text
                      style={[
                        styles.minutesText,
                        {
                          fontFamily: theme.typography.fontFamily.bold,
                          color: theme.colors.textOnButton,
                        },
                      ]}>
                      {minutes} min
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
          {backgroundColor: theme.colors.accent, bottom: 20 + insets.bottom},
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
          {selectedCount > 0
            ? `SIGUIENTE (${selectedCount})`
            : 'CONTINUAR SIN ACCESORIOS'}
        </Text>
      </TouchableOpacity>

      <AppModal
        visible={pickerChain !== null}
        title={pickerChain?.name || ''}
        message="¿Cuántos minutos querés agregar?"
        buttons={pickerOptions}
        onClose={() => setPickerChain(null)}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chainCard: {
    width: '48%',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 2,
    alignItems: 'center',
  },
  chainImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  chainName: {
    fontSize: 14,
    textAlign: 'center',
  },
  minutesBadge: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  minutesText: {
    fontSize: 12,
  },
  nextButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    padding: 18,
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
