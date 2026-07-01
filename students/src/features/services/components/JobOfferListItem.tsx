import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { formatDate, getHtmlTextContent } from '@polito/lib/core';
import {
  Col,
  Icon,
  ListItem,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { JobOfferOverview } from '@polito/student-api-client';

import { useAccessibility } from '../../../core/hooks/useAccessibilty';

interface Props {
  jobOffer: JobOfferOverview;
  index: number;
  totalData: number;
}

export const JobOfferListItem = ({ jobOffer, index, totalData }: Props) => {
  const { colors } = useTheme();
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();
  const { accessibilityListLabel } = useAccessibility();

  const location = jobOffer?.location;
  const title = getHtmlTextContent(jobOffer?.title);
  const companyInfos = `${jobOffer?.companyName} - ${t(
    'jobOffersScreen.endsAtDate',
  )}${formatDate(jobOffer?.endsAtDate)}`;

  return (
    <ListItem
      accessible={true}
      accessibilityRole="button"
      title={title}
      titleStyle={styles.title}
      linkTo={{
        screen: 'JobOffer',
        params: {
          id: jobOffer?.id,
        },
      }}
      accessibilityLabel={[
        title,
        location,
        companyInfos,
        accessibilityListLabel(index, totalData),
      ]
        .filter(Boolean)
        .join(', ')}
      accessibilityHint={t('jobOfferListItem.tapToViewDetails')}
      subtitle={
        <Col>
          <Text
            variant="secondaryText"
            style={styles.subtitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {location}
          </Text>
          <Text
            style={styles.companyInfos}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {companyInfos}
          </Text>
        </Col>
      }
      subtitleStyle={styles.subtitle}
      trailingItem={
        <Icon
          icon={faChevronRight}
          color={colors.secondaryText}
          style={styles.icon}
        />
      }
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
      fontWeight: fontWeights.medium,
      textTransform: 'capitalize',
      fontSize: fontSizes.sm,
      marginTop: spacing[0.5],
    },
    companyInfos: {
      color: palettes.text['400'],
      fontWeight: fontWeights.normal,
      fontSize: fontSizes.xs,
      marginTop: spacing[1],
    },
    icon: {
      marginRight: -spacing[1],
    },
  });
