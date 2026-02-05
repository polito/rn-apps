import { GuideSection } from '@polito/api-client';
import { HtmlView, Text } from '@polito/lib/ui';

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
