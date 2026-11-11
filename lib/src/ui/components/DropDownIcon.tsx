import { Pressable, ViewStyle } from 'react-native';

import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import { useTheme } from '../hooks/useTheme';
import { Col } from './Col';
import { Icon } from './Icon';

interface DropDownIconProps {
  style?: ViewStyle;
  onPress?: () => void;
}

export const DropDownIcon = ({ style, onPress }: DropDownIconProps) => {
  const { palettes } = useTheme();

  return (
    <Col style={style}>
      <Pressable onPress={onPress}>
        <Icon
          icon={faChevronUp}
          style={{ marginBottom: -6 }}
          color={palettes.gray[500]}
        />
        <Icon icon={faChevronDown} color={palettes.gray[500]} />
      </Pressable>
    </Col>
  );
};
