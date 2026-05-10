import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import {useTheme} from '../theme';

export type ModalButtonStyle = 'default' | 'cancel' | 'destructive';

export interface ModalButton {
  text: string;
  onPress?: () => void;
  style?: ModalButtonStyle;
}

interface AppModalProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: ModalButton[];
  onClose?: () => void;
  cancelable?: boolean;
}

const AppModal: React.FC<AppModalProps> = ({
  visible,
  title,
  message,
  buttons = [{text: 'OK'}],
  onClose,
  cancelable = true,
}) => {
  const {theme} = useTheme();

  const handlePress = (button: ModalButton) => {
    button.onPress?.();
    onClose?.();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => cancelable && onClose?.()}>
      <Pressable
        style={styles.overlay}
        onPress={() => cancelable && onClose?.()}>
        <Pressable
          style={[styles.card, {backgroundColor: theme.colors.surface}]}
          onPress={() => {}}>
          <Text
            style={[
              styles.title,
              {
                fontFamily: theme.typography.fontFamily.bold,
                color: theme.colors.textPrimary,
              },
            ]}>
            {title}
          </Text>
          {message ? (
            <Text
              style={[
                styles.message,
                {
                  fontFamily: theme.typography.fontFamily.regular,
                  color: theme.colors.textSecondary,
                },
              ]}>
              {message}
            </Text>
          ) : null}
          <View style={styles.buttons}>
            {buttons.map((b, i) => {
              const isDestructive = b.style === 'destructive';
              const isCancel = b.style === 'cancel';
              return (
                <TouchableOpacity
                  key={`${b.text}-${i}`}
                  style={[
                    styles.button,
                    {
                      backgroundColor: isCancel
                        ? 'rgba(255,255,255,0.08)'
                        : isDestructive
                        ? theme.colors.danger
                        : theme.colors.accent,
                    },
                  ]}
                  onPress={() => handlePress(b)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        fontFamily: theme.typography.fontFamily.bold,
                        color: isCancel
                          ? theme.colors.textPrimary
                          : theme.colors.textOnButton,
                      },
                    ]}>
                    {b.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 14,
    padding: 22,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },
  buttons: {
    gap: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
  },
});

export default AppModal;
