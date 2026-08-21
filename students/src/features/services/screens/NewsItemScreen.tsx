import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';

import {
  faCalendarAlt,
  faFileAlt,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { formatDate, formatDateFromString } from '@polito/lib/core';
import {
  ActivityIndicator,
  BottomBarSpacer,
  Card,
  Col,
  HtmlView,
  Icon,
  ImageLoader,
  RefreshControl,
  Row,
  ScreenTitle,
  Section,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { hideFromScreenReader } from '../../../core/accessibility/hideFromScreenReader';
import { useOpenInAppLink } from '../../../core/hooks/useOpenInAppLink.ts';
import { useGetNewsItem } from '../../../core/queries/newsHooks';
import { ServiceStackParamList } from '../components/ServicesNavigator';

type Props = NativeStackScreenProps<ServiceStackParamList, 'NewsItem'>;

export const NewsItemScreen = ({ route }: Props) => {
  const { id } = route?.params || {};
  const { palettes, spacing, colors } = useTheme();
  const { t } = useTranslation();
  const useNewsItemQuery = useGetNewsItem(id);
  const { data: newsItem, isLoading } = useNewsItemQuery;
  const styles = useStylesheet(createStyles);
  const openInAppLink = useOpenInAppLink();
  const { title, eventStartTime, createdAt, htmlContent } = newsItem || {};

  const links = newsItem?.extras.filter(e => ['link', 'file'].includes(e.type));
  const logo = newsItem?.extras.find(
    e => e.type === 'image' && e.description === 'Logo1',
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl queries={[useNewsItemQuery]} manual />}
    >
      <SafeAreaView>
        <Section>
          <ScreenTitle title={title ?? ''} style={styles.heading} />
          {isLoading && (
            <ActivityIndicator
              style={{
                marginVertical: spacing[6],
              }}
            />
          )}
        </Section>
        {!isLoading && (
          <>
            {createdAt && (
              <Card accessible padded>
                <Text
                  variant="heading"
                  weight="semibold"
                  numberOfLines={1}
                  accessibilityRole="header"
                  accessibilityLabel={`${t('newsScreen.createdAt')}${formatDate(createdAt)}`}
                >
                  {t('newsScreen.createdAt')}
                  {formatDate(createdAt)}
                </Text>
              </Card>
            )}
            {!!logo && (
              <Card
                accessible
                accessibilityLabel={t('newsScreen.logo')}
                accessibilityRole="image"
              >
                <ImageLoader
                  source={{ uri: logo.url }}
                  imageStyle={{ height: 200 }}
                  containerStyle={{ height: 200, margin: spacing[3] }}
                  resizeMode="cover"
                />
              </Card>
            )}
            {htmlContent && (
              <Card>
                <HtmlView
                  props={{ source: { html: htmlContent } }}
                  variant="longProse"
                />
              </Card>
            )}
            <Card padded>
              <Text
                variant="subHeading"
                weight="semibold"
                accessibilityRole="header"
                style={{ marginBottom: spacing[1] }}
              >
                {t('newsScreen.information')}
              </Text>
              <Col>
                {eventStartTime && (
                  <Row
                    style={styles.infoRow}
                    accessible
                    accessibilityLabel={`${t('newsScreen.eventStartTime')}${formatDateFromString(eventStartTime)}`}
                  >
                    <View {...hideFromScreenReader}>
                      <Icon
                        icon={faCalendarAlt}
                        style={styles.iconCalendar}
                        color={palettes.secondary[600]}
                      />
                    </View>
                    <Text weight="normal" accessible={false}>
                      {formatDateFromString(eventStartTime)}
                    </Text>
                  </Row>
                )}
                {links?.map((link, index) => (
                  <TouchableHighlight
                    underlayColor={colors.touchableHighlight}
                    onPress={() => openInAppLink(link.url)}
                    key={index}
                    accessible
                    accessibilityRole="link"
                    accessibilityLabel={link.description}
                    accessibilityHint={
                      link.type === 'link'
                        ? t('newsScreen.openLink')
                        : t('newsScreen.openFile')
                    }
                    style={styles.infoRow}
                  >
                    <Row align="center">
                      <View {...hideFromScreenReader}>
                        <Icon
                          icon={link.type === 'link' ? faInfoCircle : faFileAlt}
                          style={styles.iconCalendar}
                          color={palettes.secondary[600]}
                        />
                      </View>
                      <Text weight="normal" variant="link" style={styles.link}>
                        {link.description}
                      </Text>
                    </Row>
                  </TouchableHighlight>
                ))}
              </Col>
            </Card>
          </>
        )}
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    heading: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[3],
    },
    infoRow: {
      marginVertical: spacing[1],
      paddingVertical: spacing[2],
    },
    iconCalendar: {
      marginRight: spacing[2],
    },
    link: {
      textDecorationLine: 'underline',
      maxWidth: '90%',
    },
  });
