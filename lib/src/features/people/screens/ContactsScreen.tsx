import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { usePreferencesContext } from '../../../core/contexts/PreferencesContext';
import { useDebounceValue } from '../../../core/hooks/useDebounceValue';
import { BottomBarSpacer } from '../../../ui/components/BottomBarSpacer';
import { OverviewList } from '../../../ui/components/OverviewList';
import { TranslucentTextField } from '../../../ui/components/TranslucentTextField';
import { useStylesheet } from '../../../ui/hooks/useStylesheet';
import { Theme } from '../../../ui/types/Theme';
import { PersonOverviewListItem } from '../components/PersonOverviewListItem';
import { PreferredContactsSection } from '../components/PreferredContactsSection';
import { RecentSearch } from '../components/RecentSearch';
import { UsefulContactsSection } from '../components/UsefulContactsSection';
import { useGetPeople } from '../queries/peopleHooks';
import {
  PeoplePreferences,
  UsefulContact,
  UsefulContactsVisibility,
} from '../types';

interface Props {
  usefulContacts?: UsefulContact[];
  usefulContactsVisibility?: UsefulContactsVisibility;
}

export const ContactsScreen = ({
  usefulContacts,
  usefulContactsVisibility = 'always',
}: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { peoplePreferred = [] } = usePreferencesContext<PeoplePreferences>();
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const debounceSearch = useDebounceValue(search, 500);
  const enabled = debounceSearch.length >= 2;
  const peopleQuery = useGetPeople(debounceSearch, enabled);
  const hasUsefulContacts = (usefulContacts?.length ?? 0) > 0;

  const showUsefulAlways =
    !enabled && hasUsefulContacts && usefulContactsVisibility === 'always';
  const showUsefulOnSearchFocus =
    !enabled &&
    hasUsefulContacts &&
    usefulContactsVisibility === 'onSearchFocus' &&
    isSearchFocused;

  const idleListHeader = (
    <>
      {showUsefulAlways && <UsefulContactsSection contacts={usefulContacts!} />}
      {peoplePreferred.length > 0 && (
        <PreferredContactsSection contacts={peoplePreferred} />
      )}
      {showUsefulOnSearchFocus && (
        <UsefulContactsSection contacts={usefulContacts!} />
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <TranslucentTextField
        autoFocus
        label={t('contactsScreen.search')}
        icon={faMagnifyingGlass}
        value={search}
        onChangeText={setSearch}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        style={styles.searchBar}
      />
      {!enabled && (
        <RecentSearch
          showRecents={isSearchFocused}
          listHeader={idleListHeader}
        />
      )}
      {enabled && (
        <>
          <OverviewList
            loading={peopleQuery.isLoading}
            emptyStateText={t('contactsScreen.emptyState')}
            indented
          >
            {peopleQuery.data?.map((item, index) => (
              <PersonOverviewListItem
                key={item.id}
                person={item}
                index={index}
                totalData={peopleQuery.data?.length ?? 0}
                searchString={debounceSearch}
              />
            ))}
          </OverviewList>
          <BottomBarSpacer />
        </>
      )}
    </View>
  );
};

const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchBar: {
      marginHorizontal: spacing[5],
      marginTop: spacing[2],
      marginBottom: spacing[2],
    },
  });
