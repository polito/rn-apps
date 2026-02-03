import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { usePreferencesContext } from '@polito/lib';
import { APP_TIMEZONE } from '@polito/lib';
import { Col } from '@polito/lib';
import { Row } from '@polito/lib';
import { Text } from '@polito/lib';
import { useStylesheet } from '@polito/lib';
import { Theme } from '@polito/lib';

import { AppPreferences } from '~/core/types/preferences';

import { DateTime } from 'luxon';

import { AgendaWeek } from '../types/AgendaWeek';
import { DailyAgenda } from './DailyAgenda';
import { EmptyWeek } from './EmptyWeek';

interface Props {
  agendaWeek: AgendaWeek;
  setCurrentDayOffset?: (offset: number) => void;
  currentDay?: DateTime;
}

export const WeeklyAgenda = ({
  agendaWeek,
  setCurrentDayOffset,
  currentDay,
}: Props) => {
  const styles = useStylesheet(createStyles);
  const { accessibility } = usePreferencesContext<AppPreferences>();
  const newDay = useMemo(
    () =>
      currentDay
        ? currentDay.startOf('day')
        : DateTime.now().setZone(APP_TIMEZONE).startOf('day'),
    [currentDay],
  );

  return (
    <View>
      <Text variant="secondaryText" style={styles.weekHeader} capitalize>
        {agendaWeek.dateRange.start!.toFormat('d MMM')}
        {' - '}
        {agendaWeek.dateRange.end!.minus(1).toFormat('d MMM')}
      </Text>
      {agendaWeek.data.map(day => (
        <DailyAgenda
          key={day.key}
          agendaDay={day}
          isEmptyWeek={agendaWeek.data.length === 1 && !day.items.length}
          onLayout={e => {
            day.date.weekday !== 1 &&
              day.date.equals(newDay) &&
              setCurrentDayOffset &&
              setCurrentDayOffset(e.nativeEvent.layout.y);
          }}
        />
      ))}
      {!agendaWeek.data.length && (
        <Row>
          <Col style={styles.dayColumn} />
          <Col
            style={[
              styles.itemsColumn,
              accessibility?.fontSize && accessibility.fontSize >= 150
                ? { paddingRight: '15%' }
                : {},
            ]}
          >
            <EmptyWeek />
          </Col>
        </Row>
      )}
    </View>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    weekHeader: {
      marginLeft: '15%',
      paddingBottom: spacing[2],
    },
    dayColumn: {
      width: '15%',
      maxWidth: 200,
    },
    itemsColumn: {
      flexGrow: 1,
      justifyContent: 'center',
    },
  });
