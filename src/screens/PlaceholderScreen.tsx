import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '../theme';

// Placeholder temporal mientras implementamos las pantallas del app
const PlaceholderScreen: React.FC<{title: string}> = ({title}) => {
  const {theme} = useTheme();

  return (
    <LinearGradient
      colors={[
        theme.colors.gradientStart,
        theme.colors.gradientMid,
        theme.colors.gradientEnd,
      ]}
      style={styles.container}>
      <Text
        style={[
          styles.text,
          {
            fontFamily: theme.typography.fontFamily.bold,
            color: theme.colors.textPrimary,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.subtext,
          {
            fontFamily: theme.typography.fontFamily.regular,
            color: theme.colors.textSecondary,
          },
        ]}>
        En desarrollo
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
  },
});

export default PlaceholderScreen;
