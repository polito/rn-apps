import { HtmlView } from '@lib/ui/components/HtmlView';
import { Text } from '@lib/ui/components/Text';
import { GuideSection } from '@polito/api-client';

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
