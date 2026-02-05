import { StyleSheet, View } from 'react-native';

import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { courseIcons } from '@polito/lib/features/courses';
import { Icon, Theme, useStylesheet } from '@polito/lib/ui';

interface Props {
  color?: string;
  icon?: string;
  isHidden?: boolean;
}

export const CourseIcon = ({ color, icon, isHidden }: Props) => {
  const styles = useStylesheet(createStyles);
  return (
    <View
      style={[
        styles.container,
        !isHidden && color
          ? {
              backgroundColor: color,
            }
          : undefined,
        isHidden && {
          backgroundColor: undefined,
        },
      ]}
    >
      {(isHidden && (
        <Icon icon={faEyeSlash} color={styles.hiddenIcon.color} size={22} />
      )) ||
        (icon && icon in courseIcons && (
          <Icon icon={courseIcons[icon]} color="white" />
        ))}
    </View>
  );
};

const createStyles = ({ colors, palettes }: Theme) =>
  StyleSheet.create({
    container: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: palettes.primary[400],
      alignItems: 'center',
      justifyContent: 'center',
    },
    hiddenIcon: {
      color: colors.prose,
    },
  });
