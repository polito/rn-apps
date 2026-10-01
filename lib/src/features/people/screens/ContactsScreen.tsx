import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccessibilityInfo,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { usePreferencesContext } from '../../../core/contexts/PreferencesContext';
import { useDebounceValue } from '../../../core/hooks/useDebounceValue';
import { useOfflineDisabled } from '../../../core/hooks/useOfflineDisabled';
import { BottomBarSpacer } from '../../../ui/components/BottomBarSpacer';
import { HeaderAccessory } from '../../../ui/components/HeaderAccessory';
import { OverviewList } from '../../../ui/components/OverviewList';
import { Row } from '../../../ui/components/Row';
import { Section } from '../../../ui/components/Section';
import { TranslucentTextField } from '../../../ui/components/TranslucentTextField';
import { useStylesheet } from '../../../ui/hooks/useStylesheet';
import { useTheme } from '../../../ui/hooks/useTheme';
import { GlobalStyles } from '../../../ui/styles/GlobalStyles';
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
  /** Whether to show the preferred/favorite contacts section. */
  showPreferredContacts?: boolean;
}

export const ContactsScreen = ({
  usefulContacts,
  usefulContactsVisibility = 'always',
  showPreferredContacts = true,
}: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { spacing } = useTheme();
  const { peoplePreferred = [] } = usePreferencesContext<PeoplePreferences>();
  const [search, setSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const debounceSearch = useDebounceValue(search, 500);
  const enabled = debounceSearch.length >= 2;
  const peopleQuery = useGetPeople(debounceSearch, enabled);
  const hasUsefulContacts = (usefulContacts?.length ?? 0) > 0;
  const isInputDisabled = useOfflineDisabled();
  const people = peopleQuery.data;

  useEffect(() => {
    if (people && people.length > 0) {
      AccessibilityInfo.announceForAccessibility(
        `${t('contactsScreen.resultFound')} ${people.length} ${t('contactsScreen.resultFoundRes')}`,
      );
    }
    if (people && people.length === 0) {
      AccessibilityInfo.announceForAccessibility(
        t('contactsScreen.noResultsFound'),
      );
    }
  }, [people, t]);

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
      {showPreferredContacts && peoplePreferred.length > 0 && (
        <PreferredContactsSection contacts={peoplePreferred} />
      )}
      {showUsefulOnSearchFocus && (
        <UsefulContactsSection contacts={usefulContacts!} />
      )}
    </>
  );

  return (
    <>
      <HeaderAccessory style={styles.searchBar}>
        <Row align="center" style={GlobalStyles.grow}>
          <TranslucentTextField
            autoFocus
            autoCorrect={false}
            leadingIcon={faSearch}
            accessibilityRole="search"
            value={search}
            onChangeText={setSearch}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            style={[GlobalStyles.grow, styles.textField]}
            label={t('contactsScreen.search')}
            editable={!isInputDisabled}
            isClearable={!!search}
            onClear={() => setSearch('')}
            onClearLabel={t('contactsScreen.clearSearch')}
            accessibilityLabel={t('contactsScreen.searchPlaceholder')}
            accessibilityHint={t('common.searchSuggestionsHint')}
            accessibilityState={{ disabled: isInputDisabled }}
          />
        </Row>
      </HeaderAccessory>
      {!enabled && (
        <RecentSearch
          showRecents={isSearchFocused}
          listHeader={idleListHeader}
        />
      )}
      {enabled && (
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingBottom: spacing[4] }}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView>
            <Section>
              <View
                accessibilityRole="list"
                accessibilityLabel={`${t('contactsScreen.searchResults')} - ${people?.length || 0} ${t('contactsScreen.contactsFound')}`}
              >
                <OverviewList
                  loading={peopleQuery.isLoading}
                  style={{ marginTop: spacing[4] }}
                  emptyStateText={t('contactsScreen.emptyState')}
                  indented
                >
                  {people?.map((item, index) => (
                    <PersonOverviewListItem
                      key={item.id}
                      person={item}
                      index={index}
                      totalData={people?.length ?? 0}
                      searchString={debounceSearch}
                    />
                  ))}
                </OverviewList>
              </View>
            </Section>
            <BottomBarSpacer />
          </SafeAreaView>
        </ScrollView>
      )}
    </>
  );
};

const createStyles = ({ spacing, shapes }: Theme) =>
  StyleSheet.create({
    textField: {
      paddingLeft: spacing[4],
      borderRadius: shapes.lg,
      marginLeft: spacing[3],
    },
    searchBar: {
      paddingBottom: spacing[2],
      paddingTop: spacing[2],
    },
  });
