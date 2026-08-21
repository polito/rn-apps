import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';

import { faCircle } from '@fortawesome/free-regular-svg-icons';
import {
  hideFromScreenReader,
  usePreferencesContext,
  useScreenReader,
} from '@polito/lib/core';
import {
  Icon,
  PillDropdownActivator,
  StatefulMenuView,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import {
  MenuAction,
  MenuComponentRef,
  NativeActionEvent,
} from '@react-native-menu/menu';

import { AppPreferences } from '~/core/types/preferences';

import { ALL_AGENDA_TYPES, AgendaItemType } from '../types/AgendaItem';

export const AgendaTypeFilter = () => {
  const { t } = useTranslation();
  const getLocalizedType = useCallback(
    (type: AgendaItemType) => {
      return t(
        `common.` + (type === 'exam' ? 'examCall_plural' : `${type}_plural`),
      );
    },
    [t],
  );

  const { agendaScreen, updatePreference } =
    usePreferencesContext<AppPreferences>();
  const { announce } = useScreenReader();

  const filters = useMemo(() => {
    return { ...agendaScreen.filters };
  }, [agendaScreen]);

  const toggleFilter = useCallback(
    (type: AgendaItemType) => {
      const enabled = !filters[type];
      updatePreference('agendaScreen', {
        ...agendaScreen,
        filters: { ...filters, [type]: enabled },
      });
      announce(
        `${getLocalizedType(type)}, ${t(`common.activeStatus.${enabled}`)}`,
      );
    },
    [agendaScreen, filters, updatePreference, announce, getLocalizedType, t],
  );

  const { colors } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<MenuComponentRef>(null);

  const colorsMap: Record<AgendaItemType, string | null> = useMemo(() => {
    return {
      booking: colors.bookingCardBorder,
      deadline: colors.deadlineCardBorder,
      exam: colors.examCardBorder,
      lecture: null,
    };
  }, [
    colors.bookingCardBorder,
    colors.deadlineCardBorder,
    colors.examCardBorder,
  ]);

  const styles = useStylesheet(createStyles);

  // Update the pill content when the state changes
  const pillContent = useMemo(() => {
    const selectedTypes: AgendaItemType[] = [];
    Object.entries(filters).forEach(([type, enabled]) => {
      if (enabled) selectedTypes.push(type as AgendaItemType);
    });

    if (selectedTypes.length === 0 || selectedTypes.length === 4) {
      return <Text>{t('common.all')}</Text>;
    } else {
      return selectedTypes.map(type => (
        <View key={type} style={styles.buttonType}>
          <View
            accessible={false}
            importantForAccessibility="no-hide-descendants"
          >
            <Icon icon={faCircle} color={colorsMap[type] ?? undefined} />
          </View>
          <Text>{getLocalizedType(type)}</Text>
        </View>
      ));
    }
  }, [filters, colorsMap, getLocalizedType, styles.buttonType, t]);

  const pillContentText = useMemo(() => {
    const selectedTypes: AgendaItemType[] = [];
    Object.entries(filters).forEach(([type, enabled]) => {
      if (enabled) selectedTypes.push(type as AgendaItemType);
    });

    if (selectedTypes.length === 0 || selectedTypes.length === 4) {
      return t('common.all');
    } else {
      return selectedTypes.map(type => getLocalizedType(type)).join(', ');
    }
  }, [filters, getLocalizedType, t]);

  const typeActions = useMemo(() => {
    return ALL_AGENDA_TYPES.map(eventType => {
      const typedEventType = eventType as AgendaItemType;
      const title = getLocalizedType(typedEventType);

      return {
        id: eventType,
        title,
        state: (filters[typedEventType] ? 'on' : 'off') as MenuAction['state'],
        imageColor: colorsMap[typedEventType] ?? undefined,
        image: Platform.select({
          ios: 'circle',
          android: 'circle',
        }),
      };
    });
  }, [filters, colorsMap, getLocalizedType]);

  const onPressAction = useCallback(
    ({ nativeEvent: { event } }: NativeActionEvent) => {
      toggleFilter(event as AgendaItemType);
    },
    [toggleFilter],
  );

  return (
    <StatefulMenuView
      ref={menuRef}
      actions={typeActions}
      onPressAction={onPressAction}
      onOpenMenu={() => setIsOpen(true)}
      onCloseMenu={() => setIsOpen(false)}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${t('common.event_plural')}, ${pillContentText}`}
      accessibilityHint={t('agendaTypeFilter.filterHint')}
      accessibilityState={{ expanded: isOpen }}
      accessibilityActions={[{ name: 'activate' }]}
      onAccessibilityAction={() => menuRef.current?.show()}
    >
      <PillDropdownActivator variant="neutral" {...hideFromScreenReader}>
        <View style={styles.typeFilter}>
          <Text key="events">{t('common.event_plural')} </Text>
          <Text
            style={
              Array.isArray(pillContent) &&
              pillContent.length > 0 && {
                paddingRight: 4,
                paddingLeft: 6,
                backgroundColor: colors.background,
                borderRadius: 3,
              }
            }
          >
            {Array.isArray(pillContent) && pillContent.length.toString()}{' '}
          </Text>
        </View>
      </PillDropdownActivator>
    </StatefulMenuView>
  );
};

const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    typeFilter: {
      display: 'flex',
      flexDirection: 'row',
      gap: spacing[2],
      alignItems: 'center',
    },
    buttonType: {
      display: 'flex',
      flexDirection: 'row',
      gap: spacing[1],
      alignItems: 'center',
    },
    tabBooking: {
      borderColor: colors.bookingCardBorder,
    },
    tabDeadline: {
      borderColor: colors.deadlineCardBorder,
    },
    tabExam: {
      borderColor: colors.examCardBorder,
    },
  });
