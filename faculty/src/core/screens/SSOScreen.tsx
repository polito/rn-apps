import { useAuth } from '@polito/lib/features/auth';
import { SSOScreen as SharedSSOScreen } from '@polito/lib/ui';
import { RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { GuestStackParamList } from '../components/GuestNavigator';
import { Logo } from '../components/Logo';

type Props = NativeStackScreenProps<GuestStackParamList, 'SSO'>;

type SSOScreenRouteProp = RouteProp<
  { SSO: { uid: string; key: string } },
  'SSO'
>;

export const SSOScreen = ({ navigation }: Props) => {
  const route = useRoute<SSOScreenRouteProp>();
  const { key } = route.params || {};
  const { handleSSO, isLoading } = useAuth(key);

  return (
    <SharedSSOScreen
      logo={<Logo />}
      isLoading={isLoading}
      onLoginPress={() => navigation.navigate('Login')}
      onSsoPress={() => handleSSO()}
    />
  );
};
