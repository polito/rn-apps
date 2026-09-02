import { PermissionsAndroid } from 'react-native';

export const requestBluetoothPermissions = async (): Promise<boolean> => {
  const permissions = [
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  ];

  const results = await PermissionsAndroid.requestMultiple(permissions);

  return Object.values(results).every(
    result => result === PermissionsAndroid.RESULTS.GRANTED,
  );
};
