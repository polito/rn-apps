import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Platform, StyleSheet, View } from 'react-native';

import { usePreferencesContext } from '../../../core/contexts/PreferencesContext';
import { BottomBarSpacer } from '../../../ui/components/BottomBarSpacer';
import { IndentedDivider } from '../../../ui/components/IndentedDivider';
import { Row } from '../../../ui/components/Row';
import { Text } from '../../../ui/components/Text';
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
            <View style={styles.container}>
              <Row align="center" justify="space-between" style={styles.header}>
                <Text
                  style={[styles.heading, { color: infoColor }]}
                  variant="heading"
                >
                  {t('contactsScreen.recentSearches')}
                </Text>
              </Row>
              <View style={styles.list}>
                {peopleSearched.map((person, index) => {
                  const isFirst = index === 0;
                  const isLast = index === peopleSearched.length - 1;
                  return (
                    <View key={person.id}>
                      {!isFirst && <IndentedDivider indent={20} />}
                      <PersonOverviewListItem
                        person={person}
                        index={index}
                        totalData={peopleSearched.length}
                        containerStyle={[
                          isFirst && styles.firstItem,
                          isLast && styles.lastItem,
                        ]}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </>
      }
      ListFooterComponent={<BottomBarSpacer />}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
    />
  );
};

const createStyles = ({ shapes, spacing, colors }: Theme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: Platform.select({ ios: spacing[4] }),
    },
    header: {
      marginTop: spacing[5],
      marginBottom: spacing[2],
      paddingHorizontal: Platform.select({ android: spacing[3] }),
    },
    heading: { padding: spacing[1] },
    listContent: {
      paddingHorizontal: Platform.select({ ios: spacing[4] }),
    },
    list: {
      backgroundColor: colors.surface,
      borderRadius: Platform.select({ ios: shapes.lg, android: 0 }),
      overflow: 'hidden',
    },
    firstItem: {
      borderTopLeftRadius: Platform.select({ ios: shapes.lg }),
      borderTopRightRadius: Platform.select({ ios: shapes.lg }),
    },
    lastItem: {
      borderBottomLeftRadius: Platform.select({ ios: shapes.lg }),
      borderBottomRightRadius: Platform.select({ ios: shapes.lg }),
    },
  });
