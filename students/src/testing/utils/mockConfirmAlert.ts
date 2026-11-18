import { Alert } from 'react-native';

export const mockConfirmAlert = (message: string) =>
  jest
    .spyOn(Alert, 'alert')
    .mockImplementation((_title, alertMessage, buttons) => {
      if (alertMessage === message) {
        buttons?.[0]?.onPress?.();
      }
    });
