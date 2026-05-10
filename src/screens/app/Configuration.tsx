import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../theme';
import {useAuth} from '../../components/AuthContext';
import {getSports} from '../../data/queries';
import {SportSelection} from '../../data/types';
import AppModal from '../../components/AppModal';

const Configuration: React.FC = () => {
  const {theme, themeMode, setThemeMode} = useTheme();
  const {profile, updateProfile} = useAuth();
  
  const [practicesSport, setPracticesSport] = useState(false);
  const [selectedSports, setSelectedSports] = useState<SportSelection[]>([]);
  const [resultModal, setResultModal] = useState<{
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (profile) {
      setPracticesSport(profile.status);
      setSelectedSports(
        getSports().map(s => ({
          ...s,
          checked: profile.sports?.some(ps => ps.sid === s.sid) || false,
        })),
      );
    }
  }, [profile]);

  const toggleSport = (sid: string) => {
    setSelectedSports(prev =>
      prev.map(s => (s.sid === sid ? {...s, checked: !s.checked} : s)),
    );
  };

  const handleSave = async () => {
    try {
      const selected = selectedSports.filter(s => s.checked);
      await updateProfile({
        status: practicesSport,
        sports: practicesSport ? selected : [],
      });
      setResultModal({
        title: 'Éxito',
        message: 'Perfil actualizado correctamente',
      });
    } catch (error) {
      setResultModal({
        title: 'Error',
        message: 'No se pudo guardar el perfil',
      });
    }
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
        {/* Tema */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontFamily: theme.typography.fontFamily.bold,
                color: theme.colors.textPrimary,
              },
            ]}>
            Apariencia
          </Text>
          
          <View style={styles.themeButtons}>
            {['auto', 'light', 'dark'].map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.themeButton,
                  {
                    backgroundColor:
                      themeMode === mode
                        ? theme.colors.accent
                        : 'rgba(255,255,255,0.1)',
                  },
                ]}
                onPress={() => setThemeMode(mode as 'auto' | 'light' | 'dark')}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.themeButtonText,
                    {
                      fontFamily: theme.typography.fontFamily.bold,
                      color:
                        themeMode === mode
                          ? theme.colors.textOnButton
                          : theme.colors.textSecondary,
                    },
                  ]}>
                  {mode === 'auto' ? 'Auto' : mode === 'light' ? 'Claro' : 'Oscuro'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Deportes */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  fontFamily: theme.typography.fontFamily.bold,
                  color: theme.colors.textPrimary,
                },
              ]}>
              Practico deporte
            </Text>
            <Switch
              value={practicesSport}
              onValueChange={setPracticesSport}
              trackColor={{
                false: theme.colors.switchTrackInactive,
                true: theme.colors.switchTrackActive,
              }}
              thumbColor={theme.colors.accent}
            />
          </View>

          {practicesSport && (
            <View style={styles.sportsList}>
              {selectedSports.map(sport => (
                <TouchableOpacity
                  key={sport.sid}
                  style={[
                    styles.sportItem,
                    {
                      backgroundColor: sport.checked
                        ? 'rgba(65,189,252,0.2)'
                        : 'rgba(255,255,255,0.05)',
                    },
                  ]}
                  onPress={() => toggleSport(sport.sid)}
                  activeOpacity={0.7}>
                  <Icon
                    name={
                      sport.checked
                        ? 'checkbox-marked'
                        : 'checkbox-blank-outline'
                    }
                    size={24}
                    color={
                      sport.checked
                        ? theme.colors.accent
                        : theme.colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.sportName,
                      {
                        fontFamily: theme.typography.fontFamily.regular,
                        color: sport.checked
                          ? theme.colors.textPrimary
                          : theme.colors.textSecondary,
                      },
                    ]}>
                    {sport.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Botones de acción */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            {backgroundColor: theme.colors.accent},
          ]}
          onPress={handleSave}
          activeOpacity={0.7}>
          <Icon name="content-save" size={24} color={theme.colors.textOnButton} />
          <Text
            style={[
              styles.saveButtonText,
              {
                fontFamily: theme.typography.fontFamily.bold,
                color: theme.colors.textOnButton,
              },
            ]}>
            GUARDAR CAMBIOS
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <AppModal
        visible={resultModal !== null}
        title={resultModal?.title || ''}
        message={resultModal?.message}
        onClose={() => setResultModal(null)}
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  themeButtonText: {
    fontSize: 14,
  },
  sportsList: {
    marginTop: 15,
  },
  sportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  sportName: {
    fontSize: 16,
    marginLeft: 12,
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Configuration;
