import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { Survey } from '@polito/api-client';
import {
  Col,
  DisclosureIndicator,
  Icon,
  ModalContent,
  OverviewList,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { SurveyListItemByTypeName } from './SurveyListItemByTypeName';

type Props = {
  surveys: Survey[];
  close: () => void;
};

export const ExamCpdModalContent = ({ surveys, close }: Props) => {
  const { t } = useTranslation();
  const { fontSizes } = useTheme();

  const styles = useStylesheet(createStyles);
  return (
    <ModalContent title={t('examCpdModalContent.title')} close={close}>
      <Col pt={4} pb={8} ph={4} gap={2}>
        <Col align="center" gap={4}>
          <Icon
            icon={faWarning}
            color={styles.icon.color}
            size={fontSizes['5xl']}
          />
          <Text variant="prose" style={styles.message}>
            {t('examCpdModalContent.message')}
          </Text>
        </Col>

        <OverviewList>
          {surveys.map(survey => (
            <SurveyListItemByTypeName
              key={survey.id}
              survey={survey}
              trailingItem={<DisclosureIndicator />}
            />
          ))}
        </OverviewList>
      </Col>
    </ModalContent>
  );
};

const createStyles = ({ palettes, dark }: Theme) =>
  StyleSheet.create({
    icon: {
      color: dark ? palettes.danger[200] : palettes.danger[800],
    },
    message: {
      color: dark ? palettes.danger[200] : palettes.danger[800],
    },
  });
