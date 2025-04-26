import { Alert } from 'react-native';

export function useConfirmationAlert() {
  const confirmationAlert = ({
    title = 'Confirm',
    message = 'Are you sure?',
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    confirmStyle = 'destructive' as
      | 'destructive'
      | 'cancel'
      | 'default'
      | undefined,
    onCancel = () => {},
    onConfirm = () => {},
    cancelable = true,
  }) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: cancelText,
          style: 'cancel',
          onPress: onCancel,
        },
        {
          text: confirmText,
          style: confirmStyle,
          onPress: onConfirm,
        },
      ],
      { cancelable },
    );
  };

  return { confirmationAlert };
}
