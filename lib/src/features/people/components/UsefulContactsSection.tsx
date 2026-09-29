import { useTranslation } from 'react-i18next';

import { faUser } from '@fortawesome/free-regular-svg-icons';

import { Icon } from '../../../ui/components/Icon';
import { ListItem } from '../../../ui/components/ListItem';
import { OverviewList } from '../../../ui/components/OverviewList';
import { Section } from '../../../ui/components/Section';
import { SectionHeader } from '../../../ui/components/SectionHeader';
import { useTheme } from '../../../ui/hooks/useTheme';
import { UsefulContact } from '../types';

interface Props {
  contacts: UsefulContact[];
}

export const UsefulContactsSection = ({ contacts }: Props) => {
  const { t } = useTranslation();
  const { dark, palettes, fontSizes } = useTheme();

  if (!contacts.length) {
    return null;
  }

  const infoColor = dark ? palettes.info[400] : palettes.info[700];

  return (
    <Section>
      <SectionHeader
        title={t('contactsScreen.usefulContacts')}
        titleStyle={{ color: infoColor }}
        separator={false}
      />
      <OverviewList indented>
        {contacts.map(contact => (
          <ListItem
            key={contact.id}
            title={t(contact.titleKey)}
            linkTo={{ screen: 'UsefulContact', params: { id: contact.id } }}
            leadingItem={<Icon icon={faUser} size={fontSizes.xl} />}
          />
        ))}
      </OverviewList>
    </Section>
  );
};
