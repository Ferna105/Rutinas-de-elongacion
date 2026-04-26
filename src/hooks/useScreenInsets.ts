// Hook reutilizable para safe area insets
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export const useScreenInsets = () => {
  const insets = useSafeAreaInsets();
  
  return {
    top: Math.max(insets.top, 0),
    bottom: Math.max(insets.bottom, 0),
    left: Math.max(insets.left, 0),
    right: Math.max(insets.right, 0),
  };
};
