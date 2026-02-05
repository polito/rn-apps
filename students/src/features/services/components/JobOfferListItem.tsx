import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { JobOfferOverview } from '@polito/api-client';
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

  const accessibilityLabel = accessibilityListLabel(index, totalData);
  const location = jobOffer?.location;
  const title = getHtmlTextContent(jobOffer?.title);
  const companyInfos = `${jobOffer?.companyName} - ${t(
    'jobOffersScreen.endsAtDate',
  )}${formatDate(jobOffer?.endsAtDate)}`;

  return (
    <ListItem
      title={title}
      titleStyle={styles.title}
      linkTo={{
        screen: 'JobOffer',
        params: {
          id: jobOffer?.id,
        },
      }}
      accessibilityLabel={[
        accessibilityLabel,
        title,
        location,
        companyInfos,
      ].join(', ')}
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
