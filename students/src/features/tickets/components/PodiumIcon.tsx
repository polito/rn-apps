import Svg, { Path } from 'react-native-svg';

import { faRankingStar } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@polito/lib/ui';

const [VB_WIDTH, VB_HEIGHT, , , PATH] = faRankingStar.icon;

interface PodiumIconProps {
  size?: number;
  color?: string;
}

export const PodiumIcon = ({ size = 64, color }: PodiumIconProps) => {
  const { palettes } = useTheme();
  return (
    <Svg
      width={(size * VB_WIDTH) / VB_HEIGHT}
      height={size}
      viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <Path d={PATH as string} fill={color ?? palettes.success[700]} />
    </Svg>
  );
};
