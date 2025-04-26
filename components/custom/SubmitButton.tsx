import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';

interface SubmitButtonProps {
  onPress: () => void;
  title?: string;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onPress,
  title = 'Submit',
  isLoading,
  disabled,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled || isLoading ? styles.disabledButton : styles.enabledButton,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
  },
  enabledButton: {
    backgroundColor: '#0a7ea4',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default SubmitButton;
