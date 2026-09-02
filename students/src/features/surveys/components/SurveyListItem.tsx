import { useOpenInAppLink } from '@polito/lib/features/auth';
import { ListItem, type ListItemProps } from '@polito/lib/ui';
import { Survey } from '@polito/student-api-client';

type Props = {
  survey: Survey;
} & Omit<ListItemProps, 'title'>;

export const SurveyListItem = ({ survey, ...props }: Props) => {
  const openInAppLink = useOpenInAppLink();
  return (
    <ListItem
      {...props}
      title={survey.title}
      subtitle={survey.subtitle ?? undefined}
      onPress={() => openInAppLink(survey.url)}
      isAction
    />
  );
};
