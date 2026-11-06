import { StyleSheet } from 'react-native';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import {
  DecorativeIcon,
  Row,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

type Props = {
  label: string;
};

export const SectionHeaderLink = ({ label }: Props) => {
  const styles = useStylesheet(createStyles);
  const { colors, fontSizes } = useTheme();

  return (
    <Row align="center" gap={1}>
      <Text variant="link" style={styles.label} accessible={false}>
        {label}
      </Text>
      <DecorativeIcon
        icon={faChevronRight}
        color={colors.link}
        size={fontSizes.xs}
      />
    </Row>
  );
};

const createStyles = ({ colors, fontSizes }: Theme) =>
  StyleSheet.create({
    label: {
      color: colors.link,
      fontFamily: 'Montserrat-Medium',
      fontSize: fontSizes.xs,
    },
  });
