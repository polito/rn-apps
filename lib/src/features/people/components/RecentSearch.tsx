import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Platform, StyleSheet } from 'react-native';

import { usePreferencesContext } from '../../../core/contexts/PreferencesContext';
import { BottomBarSpacer } from '../../../ui/components/BottomBarSpacer';
import { OverviewList } from '../../../ui/components/OverviewList';
import { Section } from '../../../ui/components/Section';
import { SectionHeader } from '../../../ui/components/SectionHeader';
import { useStylesheet } from '../../../ui/hooks/useStylesheet';
import { useTheme } from '../../../ui/hooks/useTheme';
import { Theme } from '../../../ui/types/Theme';
import { PeoplePreferences } from '../types';
import { PersonOverviewListItem } from './PersonOverviewListItem';

interface Props {
  listHeader?: ReactNode;
  showRecents?: boolean;
}

export const RecentSearch = ({ listHeader, showRecents = false }: Props) => {
  const { t } = useTranslation();
  const { dark, palettes } = useTheme();
  const styles = useStylesheet(createStyles);
  const { peopleSearched = [] } = usePreferencesContext<PeoplePreferences>();
  const hasRecents = showRecents && peopleSearched.length > 0;
  const infoColor = dark ? palettes.info[400] : palettes.info[700];

  return (
    <FlatList
      data={[]}
      renderItem={null}
      ListHeaderComponent={
        <>
          {listHeader}
          {hasRecents && (
            <Section>
              <SectionHeader
                title={t('contactsScreen.recentSearches')}
                titleStyle={{ color: infoColor }}
                separator={false}
              />
              <OverviewList indented>
                {peopleSearched.map((person, index) => (
                  <PersonOverviewListItem
                    key={person.id}
                    person={person}
                    index={index}
                    totalData={peopleSearched.length}
                  />
                ))}
              </OverviewList>
            </Section>
          )}
        </>
      }
      ListFooterComponent={<BottomBarSpacer />}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
    />
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    listContent: {
      paddingTop: spacing[5],
      paddingHorizontal: Platform.select({ ios: spacing[4] }),
    },
  });
