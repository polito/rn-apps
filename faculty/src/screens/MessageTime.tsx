import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Text, Theme, useStylesheet } from '@polito/lib';

import { format, isToday, isTomorrow } from 'date-fns';
// Importa da date-fns
import { it } from 'date-fns/locale';

// Locale per l'italiano

interface TimeWidgetProps {
  right?: boolean;
  time: Date;
}

export const MessageTime = ({ right, time }: TimeWidgetProps) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  // Formatta la data
  let timeText = format(time, 'dd/MM/yyyy HH:mm', { locale: it });

  const isTodayFlag = isToday(time);
  const isTomorrowFlag = isTomorrow(time);

  // Modifica il testo per "Oggi" o "Domani"
  if (isTodayFlag) {
    timeText = `${t('common.today')} ${format(time, 'HH:mm', { locale: it })}`;
  }

  if (isTomorrowFlag) {
    timeText = `${t('common.tomorrow')} ${format(time, 'HH:mm', { locale: it })}`;
  }

  return (
    <Text variant="caption" style={[styles.hour, right && styles.hourRight]}>
      {timeText || ''}
    </Text>
  );
};

const createStyles = ({ spacing, fontSizes, fontWeights }: Theme) =>
  StyleSheet.create({
    hour: {
      flex: 1,
      width: '70%',
      paddingVertical: spacing[1],
      marginLeft: spacing[4],
      justifyContent: 'center',
      alignItems: 'center',
      textTransform: 'capitalize',
      textAlign: 'center',
      fontSize: fontSizes['2xs'],
      fontWeight: fontWeights.normal,
    },
    hourRight: {
      alignSelf: 'flex-end',
      marginRight: spacing[4],
    },
  });
