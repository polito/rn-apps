import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { formatDate, getHtmlTextContent } from '@polito/lib/core';
import { Icon, ListItem, Theme, useStylesheet, useTheme } from '@polito/lib/ui';
import { NewsItemOverview } from '@polito/student-api-client';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';
import { useNotifications } from '../../../core/hooks/useNotifications';

interface Props {
  newsItem: NewsItemOverview;
  index: number;
  totalData: number;
}

export const NewsListItem = ({ newsItem, index, totalData }: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useStylesheet(createStyles);

  const { accessibilityListLabel } = useAccessibility();
  const { getUnreadsCount } = useNotifications();

  const title = getHtmlTextContent(newsItem?.title);
  const shortDescription = getHtmlTextContent(newsItem?.shortDescription);
  const createdAt = formatDate(newsItem.createdAt);
  const subTitle = `${createdAt} - ${shortDescription}`;
  const isUnread = !!getUnreadsCount([
    'services',
    'news',
    newsItem?.id.toString(),
  ]);

  return (
    <ListItem
      title={title}
      titleStyle={styles.title}
      linkTo={{
        screen: 'NewsItem',
        params: {
          id: newsItem?.id,
        },
      }}
      accessibilityRole="button"
      accessibilityLabel={[
        title,
        isUnread ? t('common.unread') : '',
        subTitle,
        accessibilityListLabel(index, totalData),
      ]
        .filter(Boolean)
        .join(', ')}
      subtitle={subTitle}
      subtitleStyle={styles.subtitle}
      trailingItem={
        <Icon
          icon={faChevronRight}
          color={colors.secondaryText}
          style={styles.icon}
        />
      }
      unread={isUnread}
    />
  );
};

const createStyles = ({ spacing, fontSizes, fontWeights, palettes }: Theme) =>
  StyleSheet.create({
    title: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
    },
    subtitle: {
      color: palettes.text['500'],
      fontWeight: fontWeights.normal,
      fontSize: fontSizes.sm,
      marginTop: spacing[0.5],
    },
    icon: {
      marginRight: -spacing[1],
    },
  });
