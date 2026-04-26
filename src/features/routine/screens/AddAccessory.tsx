import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../theme';

const AddAccessory: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {theme} = useTheme();

  const handleYes = () => {
    navigation.navigate('AccessoryExercises', route.params);
  };

  const handleNo = () => {
    navigation.navigate('RoutineInformation', route.params);
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
        <Icon name="plus-circle" size={80} color={theme.colors.accent} />

        <Text
          style={[
            styles.title,
            {
              fontFamily: theme.typography.fontFamily.bold,
              color: theme.colors.textPrimary,
            },
          ]}>
          ¿Querés agregar ejercicios accesorios?
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              fontFamily: theme.typography.fontFamily.regular,
              color: theme.colors.textSecondary,
            },
          ]}>
          Podés complementar tu rutina con ejercicios específicos por cadena muscular
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.colors.accent}]}
            onPress={handleYes}
            activeOpacity={0.7}>
            <Icon name="check" size={40} color={theme.colors.textOnButton} />
            <Text
              style={[
                styles.buttonText,
                {
                  fontFamily: theme.typography.fontFamily.bold,
                  color: theme.colors.textOnButton,
                },
              ]}>
              SÍ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.colors.accent}]}
            onPress={handleNo}
            activeOpacity={0.7}>
            <Icon name="close" size={40} color={theme.colors.textOnButton} />
            <Text
              style={[
                styles.buttonText,
                {
                  fontFamily: theme.typography.fontFamily.bold,
                  color: theme.colors.textOnButton,
                },
              ]}>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
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

export default AddAccessory;
