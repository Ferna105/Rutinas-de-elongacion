import React, {useMemo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Video, {ViewType} from 'react-native-video';

interface ExerciseVideoProps {
  source: any; // módulo require() del .mp4
  style: StyleProp<ViewStyle>;
}

// Video del ejercicio en loop y sin sonido. No toma el foco de audio para no
// cortar la música que el usuario tenga sonando de fondo.
const ExerciseVideo: React.FC<ExerciseVideoProps> = ({source, style}) => {
  const videoSource = useMemo(() => ({uri: source}), [source]);

  if (!source) {
    return <View style={[style, styles.placeholder]} />;
  }

  return (
    <View style={[style, styles.clip]}>
      <Video
        source={videoSource}
        style={StyleSheet.absoluteFill}
        resizeMode="contain"
        repeat
        muted
        disableFocus
        disableAudioSessionManagement
        // TextureView para que Android respete el borderRadius del contenedor
        viewType={ViewType.TEXTURE}
        shutterColor="transparent"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
  placeholder: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});

export default React.memo(ExerciseVideo);
