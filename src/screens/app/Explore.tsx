import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../theme';
import {getShowableExercises} from '../../data/queries';
import {ExerciseWithAsset} from '../../data/types';

const Explore: React.FC = () => {
  const {theme} = useTheme();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseWithAsset | null>(null);
  const exercises = getShowableExercises();

  const renderExerciseItem = ({item}: {item: ExerciseWithAsset}) => (
    <TouchableOpacity
      style={[styles.exerciseCard, {backgroundColor: 'rgba(255,255,255,0.05)'}]}
      onPress={() => setSelectedExercise(item)}
      activeOpacity={0.7}>
      <Image source={item.gif} style={styles.thumbnail} />
      <View style={styles.exerciseInfo}>
        <Text
          style={[
            styles.exerciseName,
            {
              fontFamily: theme.typography.fontFamily.bold,
              color: theme.colors.textPrimary,
            },
          ]}>
          {item.showableName}
        </Text>
        <Text
          style={[
            styles.exercisePreview,
            {
              fontFamily: theme.typography.fontFamily.regular,
              color: theme.colors.textSecondary,
            },
          ]}
          numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[
        theme.colors.gradientStart,
        theme.colors.gradientMid,
        theme.colors.gradientEnd,
      ]}
      style={styles.container}>
      <FlatList
        data={exercises}
        renderItem={renderExerciseItem}
        keyExtractor={item => item.eid}
        contentContainerStyle={styles.listContent}
      />

      {/* Modal de detalle */}
      <Modal
        visible={selectedExercise !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedExercise(null)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: theme.colors.surface},
            ]}>
            <ScrollView>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedExercise(null)}>
                <Icon name="close" size={30} color={theme.colors.textPrimary} />
              </TouchableOpacity>

              {selectedExercise && (
                <>
                  <Image source={selectedExercise.gif} style={styles.modalGif} />
                  <Text
                    style={[
                      styles.modalTitle,
                      {
                        fontFamily: theme.typography.fontFamily.bold,
                        color: theme.colors.textPrimary,
                      },
                    ]}>
                    {selectedExercise.showableName}
                  </Text>
                  <Text
                    style={[
                      styles.modalDescription,
                      {
                        fontFamily: theme.typography.fontFamily.regular,
                        color: theme.colors.textSecondary,
                      },
                    ]}>
                    {selectedExercise.description}
                  </Text>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 15,
  },
  exerciseCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    marginBottom: 4,
  },
  exercisePreview: {
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalGif: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default Explore;
