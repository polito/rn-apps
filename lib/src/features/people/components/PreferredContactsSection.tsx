import { useTranslation } from 'react-i18next';

import { PersonOverview } from '@polito/student-api-client';

import { OverviewList } from '../../../ui/components/OverviewList';
import { Section } from '../../../ui/components/Section';
import { SectionHeader } from '../../../ui/components/SectionHeader';
import { useTheme } from '../../../ui/hooks/useTheme';
import { PersonOverviewListItem } from './PersonOverviewListItem';

interface Props {
  contacts: PersonOverview[];
}

export const PreferredContactsSection = ({ contacts }: Props) => {
  const { t } = useTranslation();
  const { dark, palettes } = useTheme();

  if (!contacts.length) {
    return null;
  }

  const infoColor = dark ? palettes.info[400] : palettes.info[700];

  return (
    <Section>
      <SectionHeader
        title={t('contactsScreen.preferredContacts')}
        titleStyle={{ color: infoColor }}
        separator={false}
      />
      <OverviewList indented>
        {contacts.map((person, index) => (
          <PersonOverviewListItem
            key={person.id}
            person={person}
            index={index}
            totalData={contacts.length}
          />
        ))}
      </OverviewList>
    </Section>
  );
};
