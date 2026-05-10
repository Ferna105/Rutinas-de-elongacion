import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../theme';

interface RoutineProgressProps {
  totalMinutes: number;
  totalExercises?: number;
  label?: string;
}

const RoutineProgress: React.FC<RoutineProgressProps> = ({
  totalMinutes,
  totalExercises,
  label = 'Duración de la rutina',
}) => {
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: 'rgba(65,189,252,0.15)',
          borderColor: theme.colors.accent,
        },
      ]}>
      <Icon name="timer-outline" size={22} color={theme.colors.accent} />
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.label,
            {
              fontFamily: theme.typography.fontFamily.regular,
              color: theme.colors.textSecondary,
            },
          ]}>
          {label}
        </Text>
        <Text
          style={[
            styles.value,
            {
              fontFamily: theme.typography.fontFamily.bold,
              color: theme.colors.textPrimary,
            },
          ]}>
          {totalMinutes} min
          {typeof totalExercises === 'number'
            ? ` • ${totalExercises} ejercicios`
            : ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
    gap: 10,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 16,
    marginTop: 2,
  },
});

export default RoutineProgress;
