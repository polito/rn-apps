import { View } from 'react-native';

import { Props as IconProps } from '@fortawesome/react-native-fontawesome';

import { IS_IOS } from '../../core/constants';
import { Icon } from './Icon';

// Wraps a decorative Icon so screen readers skip it instead of announcing it separately.
export const DecorativeIcon = (props: IconProps) => (
  <View
    accessible={false}
    importantForAccessibility="no-hide-descendants"
    accessibilityElementsHidden={IS_IOS}
  >
    <Icon {...props} />
  </View>
);
