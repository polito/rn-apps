import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import {
  Icon,
  ListItem,
  OverviewList,
  Section,
  SectionHeader,
  useTheme,
} from '@polito/lib/ui';
import { type Event } from '@polito/student-api-client';

import { hideFromScreenReader } from '../../../core/accessibility/hideFromScreenReader';
import { useAccessibility } from '../../../core/hooks/useAccessibilty';

type Props = {
  contextName: string;
  events: Event[];
};

export const GraduationSessionSection = ({ contextName, events }: Props) => {
  const { t } = useTranslation();
  const { fontSizes } = useTheme();
  const { buildCompositeListLabel } = useAccessibility();

  return (
    <Section>
      <SectionHeader title={t('teachingScreen.eventTitle')} />
      <View
        accessibilityRole="list"
        accessibilityLabel={t('teachingScreen.eventTitle')}
      >
        <OverviewList indented>
          {events.map((event, index) => (
            <ListItem
              key={event.id}
              accessibilityRole="button"
              accessibilityLabel={buildCompositeListLabel(
                [contextName, event.title].filter(Boolean),
                index,
                events.length,
              )}
              accessibilityHint={t('teachingScreen.tapToOpenGraduationCode')}
              title={contextName}
              subtitle={event.title}
              leadingItem={
                <View {...hideFromScreenReader}>
                  <Icon icon={faQrcode} size={fontSizes['2xl']} />
                </View>
              }
              linkTo={{
                screen: 'GraduationCode',
                params: { id: event.id },
              }}
            />
          ))}
        </OverviewList>
      </View>
    </Section>
  );
};
