import { useOpenInAppLink } from '@polito/lib/core';
import { ListItem, type ListItemProps } from '@polito/lib/ui';
import { Survey } from '@polito/student-api-client';

type Props = {
  survey: Survey;
} & Omit<ListItemProps, 'title'>;

export const SurveyListItemByTypeName = ({ survey, ...props }: Props) => {
  const openInAppLink = useOpenInAppLink();
  return (
    <ListItem
      {...props}
      title={survey.type.name}
      onPress={() => openInAppLink(survey.url)}
      isAction
    />
  );
};
