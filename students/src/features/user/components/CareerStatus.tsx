import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Row, Text, useStylesheet, useTheme } from '@polito/lib/ui';
import { StudentCareerStatusEnum } from '@polito/student-api-client';

type Props = {
  status: StudentCareerStatusEnum;
};
export const CareerStatus = ({ status }: Props) => {
  const styles = useStylesheet(createStyles);
  const { t, i18n } = useTranslation();

  const { dark, palettes } = useTheme();
  const [color, backgroundColor] = useMemo(() => {
    switch (status) {
      case StudentCareerStatusEnum.Active:
        return [palettes.success[dark ? 300 : 600], palettes.success[500]];
      case StudentCareerStatusEnum.Closed:
      case StudentCareerStatusEnum.Cancelled:
      case StudentCareerStatusEnum.CareerClosed:
        return [palettes.danger[dark ? 400 : 600], palettes.danger[600]];
      case StudentCareerStatusEnum.Graduated:
        return [
          palettes.primary[dark ? 300 : 600],
          palettes.primary[dark ? 400 : 500],
        ];
      default:
        return [palettes.gray[dark ? 400 : 500], palettes.gray[500]];
    }
  }, [dark, palettes, status]);

  return (
    <Row align="baseline" gap={2}>
      <View
        style={[
          styles.statusCircle,
          {
            backgroundColor,
          },
        ]}
      />
      <Text variant="secondaryText" style={{ color }}>
        {i18n.exists(`profileScreen.careerStatusEnum.${status}`)
          ? t(`profileScreen.careerStatusEnum.${status}`).toLowerCase()
          : status.toLowerCase()}
      </Text>
    </Row>
  );
};

const createStyles = () =>
  StyleSheet.create({
    statusCircle: {
      width: 8,
      height: 8,
      borderRadius: 8,
    },
  });
