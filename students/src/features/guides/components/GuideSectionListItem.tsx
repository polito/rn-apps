import { View } from 'react-native';

import { getHtmlTextContent } from '@polito/lib/core';
import { HtmlView, Text } from '@polito/lib/ui';
import { GuideSection } from '@polito/student-api-client';

type Props = {
  section: GuideSection;
};

export const GuideSectionListItem = ({ section }: Props) => {
  return (
    <>
      <Text variant="subHeading" accessibilityRole="header">
        {section.title}
      </Text>
      {/* a11y: manual test required — alt text not forwarded to FastImage */}
      <View
        accessible={true}
        accessibilityLabel={getHtmlTextContent(section.content)}
        importantForAccessibility="no-hide-descendants"
      >
        <HtmlView
          props={{
            source: { html: section.content },
            baseStyle: { padding: 0 },
          }}
          variant="longProse"
        />
      </View>
    </>
  );
};
