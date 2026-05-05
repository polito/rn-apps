import { StyleSheet } from 'react-native';

import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import {
  Icon,
  Row,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

interface InfoMessageProps {
  type?: 'info' | 'warning' | 'error';
  showIcon?: boolean;
  label: string;
  labelStyle?: any;
  iconStyle?: any;
}

export const InfoMessage = ({
  type = 'info',
  showIcon = true,
  label,
  labelStyle,
  iconStyle,
}: InfoMessageProps) => {
  const styles = useStylesheet(createStyles);
  const { palettes, fontSizes } = useTheme();
  const color = {
    info: palettes.info[700],
    warning: palettes.warning[600],
    error: palettes.error[700],
  }[type];

  const textColor = {
    info: palettes.info[700],
    warning: palettes.warning[700],
    error: palettes.error[700],
  }[type];

  return (
    <Row style={[styles.container, { borderColor: color }]}>
      {showIcon && (
        <Icon
          icon={faCircleInfo}
          size={fontSizes.md}
          color={color}
          style={[styles.icon, iconStyle]}
        />
      )}
      <Text style={[styles.label, { color: textColor }, labelStyle]}>
        {label}
      </Text>
    </Row>
  );
};

const createStyles = ({ palettes, spacing, shapes, fontSizes }: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'flex-start',
      paddingVertical: spacing[3],
      gap: spacing[5],
      borderRadius: shapes.lg,
      borderWidth: 1,
      paddingHorizontal: 21,
      marginHorizontal: spacing[5],
    },

    label: {
      flexShrink: 1,
      color: palettes.gray[700],
      fontFamily: 'Montserrat-Medium',
      fontSize: fontSizes.sm,
    },
    icon: {
      marginTop: spacing[1.5],
    },
  });
