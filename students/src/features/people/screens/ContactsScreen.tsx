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
import { useOfflineDisabled, usePreferencesContext } from '@polito/lib/core';
import {
  GlobalStyles,
  HeaderAccessory,
  OverviewList,
  Row,
  Section,
  Theme,
  TranslucentTextField,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { AppPreferences } from '~/core/types/preferences';

import { useDebounceValue } from '../../../core/hooks/useDebounceValue';
import { useGetPeople } from '../../../core/queries/peopleHooks';
import { PersonOverviewListItem } from '../components/PersonOverviewListItem';
import { RecentSearch } from '../components/RecentSearch';

export const ContactsScreen = () => {
  const [search, setSearch] = useState('');
  const debounceSearch = useDebounceValue(search, 400);
  const styles = useStylesheet(createStyles);
  const { spacing } = useTheme();
  const { t } = useTranslation();
  const enabled = debounceSearch.length >= 2;
  const { isLoading, data: people } = useGetPeople(debounceSearch, enabled);
  const { peopleSearched } = usePreferencesContext<AppPreferences>();

  const isInputDisabled = useOfflineDisabled();

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

  return (
    <>
      <HeaderAccessory style={styles.searchBar}>
        <Row align="center" style={{ flex: 1 }}>
          <TranslucentTextField
            autoFocus
            autoCorrect={false}
            leadingIcon={faSearch}
            accessibilityRole="search"
            value={search}
            onChangeText={setSearch}
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
      {!enabled && peopleSearched?.length > 0 && <RecentSearch />}
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
                  loading={isLoading}
                  style={{ marginTop: spacing[4] }}
                  emptyStateText={t('contactsScreen.emptyState')}
                >
                  {people?.map((person, index) => (
                    <PersonOverviewListItem
                      key={person.id}
                      person={person}
                      searchString={debounceSearch}
                      index={index}
                      totalData={people?.length || 0}
                    />
                  ))}
                </OverviewList>
              </View>
            </Section>
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
    searchIcon: {
      position: 'absolute',
      left: spacing[6],
    },
  });
