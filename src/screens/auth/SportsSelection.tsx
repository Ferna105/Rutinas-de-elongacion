import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getSports} from '../../data';
import {SportSelection} from '../../data/types';

const SportsSelection: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {theme} = useTheme();
  
  const sports = getSports();
  const [selectedSports, setSelectedSports] = useState<SportSelection[]>(
    sports.map(s => ({...s, checked: false})),
  );

  const toggleSport = (sid: string) => {
    setSelectedSports(prev =>
      prev.map(s => (s.sid === sid ? {...s, checked: !s.checked} : s)),
    );
  };

  const handleContinue = () => {
    const selected = selectedSports.filter(s => s.checked);
    navigation.navigate('SuccessScreen', {
      status: route.params?.status || true,
      sports: selected,
    });
  };

  const hasSelection = selectedSports.some(s => s.checked);

  return (
    <LinearGradient
      colors={[
        theme.colors.gradientStart,
        theme.colors.gradientMid,
        theme.colors.gradientEnd,
      ]}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text
          style={[
            styles.title,
            {
              fontFamily: theme.typography.fontFamily.bold,
              color: theme.colors.textPrimary,
            },
          ]}>
          Seleccioná tus deportes
        </Text>

        <View style={styles.sportsGrid}>
          {selectedSports.map(sport => (
            <TouchableOpacity
              key={sport.sid}
              style={[
                styles.sportCard,
                {
                  backgroundColor: sport.checked
                    ? theme.colors.accent
                    : 'rgba(255,255,255,0.1)',
                  borderColor: theme.colors.accent,
                },
              ]}
              onPress={() => toggleSport(sport.sid)}
              activeOpacity={0.7}>
              <Icon
                name={sport.checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={30}
                color={
                  sport.checked
                    ? theme.colors.textOnButton
                    : theme.colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.sportName,
                  {
                    fontFamily: theme.typography.fontFamily.regular,
                    color: sport.checked
                      ? theme.colors.textOnButton
                      : theme.colors.textSecondary,
                  },
                ]}>
                {sport.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.continueButton,
          {
            backgroundColor: hasSelection
              ? theme.colors.accent
              : 'rgba(255,255,255,0.2)',
          },
        ]}
        onPress={handleContinue}
        disabled={!hasSelection}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.continueText,
            {
              fontFamily: theme.typography.fontFamily.bold,
              color: hasSelection
                ? theme.colors.textOnButton
                : theme.colors.textSecondary,
            },
          ]}>
          SIGUIENTE
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
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sportCard: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sportName: {
    fontSize: 15,
    marginLeft: 10,
    flex: 1,
  },
  continueButton: {
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
  continueText: {
    fontSize: 18,
  },
});

export default SportsSelection;
