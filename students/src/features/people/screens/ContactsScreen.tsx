import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { usePreferencesContext } from '@polito/lib';
import { useOfflineDisabled } from '@polito/lib';
import { HeaderAccessory } from '@polito/lib';
import { OverviewList } from '@polito/lib';
import { Row } from '@polito/lib';
import { Section } from '@polito/lib';
import { TranslucentTextField } from '@polito/lib';
import { useStylesheet } from '@polito/lib';
import { useTheme } from '@polito/lib';
import { GlobalStyles } from '@polito/lib';
import { Theme } from '@polito/lib';

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

  return (
    <>
      <HeaderAccessory style={styles.searchBar}>
        <Row align="center" style={{ flex: 1 }}>
          <TranslucentTextField
            autoFocus
            autoCorrect={false}
            leadingIcon={faSearch}
            value={search}
            onChangeText={setSearch}
            style={[GlobalStyles.grow, styles.textField]}
            label={t('contactsScreen.search')}
            editable={!isInputDisabled}
            isClearable={!!search}
            onClear={() => setSearch('')}
            onClearLabel={t('contactsScreen.clearSearch')}
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
