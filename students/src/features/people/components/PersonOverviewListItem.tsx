import { ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableHighlightProps,
  View,
  ViewStyle,
} from 'react-native';

import { faUser } from '@fortawesome/free-regular-svg-icons';
import {
  MAX_RECENT_SEARCHES,
  useOfflineDisabled,
  usePreferencesContext,
} from '@polito/lib/core';
import { Icon, ListItem, useStylesheet, useTheme } from '@polito/lib/ui';
import { PersonOverview } from '@polito/student-api-client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';

import { AppPreferences } from '~/core/types/preferences';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import { getPersonKey } from '../../../core/queries/peopleHooks';
import { HighlightedText } from './HighlightedText';

interface Props {
  person: PersonOverview;
  searchString?: string;
  trailingItem?: ReactElement;
  index: number;
  totalData: number;
  containerStyle?: StyleProp<ViewStyle>;
}

export const PersonOverviewListItem = ({
  person,
  trailingItem,
  searchString,
  index,
  totalData,
  containerStyle,
  ...rest
}: TouchableHighlightProps & Props) => {
  const { fontSizes, colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const styles = useStylesheet(createStyles);
  const { accessibilityListLabel } = useAccessibility();
  const { t } = useTranslation();
  const { updatePreference, peopleSearched } =
    usePreferencesContext<AppPreferences>();
  const subtitle = person.role ?? '';
  const firstName = person?.firstName ?? '';
  const lastName = person?.lastName ?? '';
  const title = [firstName, lastName].join(' ').trim();

  const navigateToPerson = () => {
    const personIndex = peopleSearched.findIndex(p => p.id === person.id);
    if (personIndex === -1) {
      if (peopleSearched.length >= MAX_RECENT_SEARCHES) {
        peopleSearched.pop();
      }
      updatePreference('peopleSearched', [person, ...peopleSearched]);
    } else {
      const newPeopleSearched = peopleSearched.filter(p => p.id !== person.id);
      updatePreference('peopleSearched', [person, ...newPeopleSearched]);
    }
    navigation.navigate('Person', { id: person.id });
  };

  const queryClient = useQueryClient();

  const isDataMissing = useCallback(
    () => queryClient.getQueryData(getPersonKey(person!.id)) === undefined,
    [person, queryClient],
  );

  const isDisabled = useOfflineDisabled(isDataMissing);
  return (
    <ListItem
      onPress={navigateToPerson}
      leadingItem={
        person?.picture ? (
          <Image
            source={{ uri: person.picture }}
            style={styles.picture}
            accessible={false}
          />
        ) : (
          <View
            accessible={false}
            importantForAccessibility="no-hide-descendants"
          >
            <Icon icon={faUser} size={fontSizes.xl} />
          </View>
        )
      }
      title={<HighlightedText text={title} highlight={searchString || ''} />}
      accessibilityLabel={[
        title,
        subtitle,
        accessibilityListLabel(index, totalData),
      ]
        .filter(Boolean)
        .join(', ')}
      accessibilityRole="button"
      accessibilityHint={t('common.tapToViewContact')}
      accessibilityState={{ disabled: isDisabled }}
      subtitle={subtitle}
      trailingItem={trailingItem}
      style={[
        {
          backgroundColor: colors.surface,
        },
        containerStyle,
      ]}
      disabled={isDisabled}
      {...rest}
    />
  );
};

const createStyles = () =>
  StyleSheet.create({
    picture: {
      width: '100%',
      height: '100%',
      borderRadius: 20,
    },
  });
