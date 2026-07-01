import { useTranslation } from 'react-i18next';

import { ListItem, type ListItemProps } from '@polito/lib/ui';
import { Survey } from '@polito/student-api-client';

import { useOpenInAppLink } from '../../../core/hooks/useOpenInAppLink.ts';

type Props = {
  survey: Survey;
} & Omit<ListItemProps, 'title'>;

export const SurveyListItem = ({ survey, ...props }: Props) => {
  const openInAppLink = useOpenInAppLink();
  const { t } = useTranslation();

  return (
    <ListItem
      accessibilityRole="button"
      accessibilityHint={t('surveysScreen.tapToOpenSurvey')}
      {...props}
      title={survey.title}
      subtitle={survey.subtitle ?? undefined}
      onPress={() => openInAppLink(survey.url)}
      isAction
    />
  );
};
