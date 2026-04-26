import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../../theme';
import Icon from 'react-native-vector-icons/Ionicons';

const StatusSelection: React.FC = () => {
  const navigation = useNavigation<any>();
  const {theme} = useTheme();

  const handleYes = () => {
    navigation.navigate('SportsSelection', {status: true});
  };

  const handleNo = () => {
    navigation.navigate('SuccessScreen', {status: false});
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
        <Text style={[styles.title, {fontFamily: theme.typography.fontFamily.bold, color: theme.colors.textPrimary}]}>
          ¿Practicás algún deporte?
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.colors.accent}]}
            onPress={handleYes}
            activeOpacity={0.7}>
            <Icon name="checkmark-circle" size={40} color={theme.colors.textOnButton} />
            <Text style={[styles.buttonText, {fontFamily: theme.typography.fontFamily.bold, color: theme.colors.textOnButton}]}>
              SÍ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.colors.accent}]}
            onPress={handleNo}
            activeOpacity={0.7}>
            <Icon name="close-circle" size={40} color={theme.colors.textOnButton} />
            <Text style={[styles.buttonText, {fontFamily: theme.typography.fontFamily.bold, color: theme.colors.textOnButton}]}>
              NO
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 60,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 400,
  },
  button: {
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 24,
    marginTop: 10,
  },
});

export default StatusSelection;
