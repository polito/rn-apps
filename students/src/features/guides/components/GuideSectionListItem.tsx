import { HtmlView, Text } from '@polito/lib/ui';
import { GuideSection } from '@polito/student-api-client';

type Props = {
  section: GuideSection;
};

export const GuideSectionListItem = ({ section }: Props) => {
  return (
    <>
      <Text variant="subHeading">{section.title}</Text>
      <HtmlView
        props={{
          source: { html: section.content },
          baseStyle: { padding: 0 },
        }}
        variant="longProse"
      />
    </>
  );
};
