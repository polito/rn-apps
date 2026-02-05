import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { faVideo } from '@fortawesome/free-solid-svg-icons';
import {
  AgendaCard,
  Icon,
  Row,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import { LectureItem } from '../types/AgendaItem';

interface Props {
  item: LectureItem;
  compact?: boolean;
  onPress?: () => void;
}

export const LectureCard = ({ item, compact = false, onPress }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { colors, fontSizes, dark } = useTheme();

  const location = useMemo(() => {
    if (typeof item.place === 'string') {
      if (item.place === '') return '';
      return item.place || '-';
    }

    if (item.place && item.place.name) {
      return compact
        ? item.place.name
        : t('agendaScreen.room', { roomName: item.place.name });
    }

    return '-'; // fallback if `place` is undefined
  }, [compact, item.place, t]);

  return (
    <AgendaCard
      title={item.title}
      type={t('common.lecture')}
      time={`${item.fromTime} - ${item.toTime}`}
      location={location}
      iconColor={item.color}
      isCompact={compact}
      icon={item.icon}
      style={[
        styles.card,
        { backgroundColor: item.color + (dark ? '80' : '30') },
      ]}
      onPress={onPress} // direttamente passato ad AgendaCard
    >
      {item.virtualClassrooms?.map(vc => (
        <Row key={vc.id} align="center" style={styles.vcRow}>
          <Icon icon={faVideo} color={colors.prose} size={fontSizes.sm} />
          <Text variant="secondaryText" style={styles.vcTitle}>
            {vc.title}
          </Text>
        </Row>
      ))}
      {item.description && (
        <Text
          variant="secondaryText"
          style={styles.description}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.description}
        </Text>
      )}
    </AgendaCard>
  );
};

const createStyles = ({ colors, spacing, palettes }: Theme) =>
  StyleSheet.create({
    card: {
      borderWidth: 2,
      borderColor: palettes.primary[500],
      borderRadius: 8,
      elevation: 0,
      width: '100%',
    },
    description: {
      color: colors.lectureCardSecondary,
      marginTop: spacing[1.5],
    },
    vcTitle: {
      color: colors.lectureCardSecondary,
      marginLeft: spacing[1.5],
    },
    vcRow: {
      padding: spacing[1],
    },
  });
