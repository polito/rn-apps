import { StyleSheet } from 'react-native';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { NewsItemOverview } from '@polito/student-api-client';

import {
  formatDate,
  getHtmlTextContent,
  useAccessibility,
} from '../../../core';
import { Icon, ListItem, Theme, useStylesheet, useTheme } from '../../../ui';

interface Props {
  newsItem: NewsItemOverview;
  index: number;
  totalData: number;
  unread?: boolean;
}

export const NewsListItem = ({
  newsItem,
  index,
  totalData,
  unread = false,
}: Props) => {
  const { colors } = useTheme();
  const styles = useStylesheet(createStyles);

  const { accessibilityListLabel } = useAccessibility();

  const accessibilityLabel = accessibilityListLabel(index, totalData);
  const title = getHtmlTextContent(newsItem?.title);
  const shortDescription = getHtmlTextContent(newsItem?.shortDescription);
  const createdAt = formatDate(newsItem.createdAt);
  const subTitle = `${createdAt} - ${shortDescription}`;

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
      accessibilityLabel={[accessibilityLabel, title, subTitle].join(', ')}
      subtitle={subTitle}
      subtitleStyle={styles.subtitle}
      trailingItem={
        <Icon
          icon={faChevronRight}
          color={colors.secondaryText}
          style={styles.icon}
        />
      }
      unread={unread}
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
