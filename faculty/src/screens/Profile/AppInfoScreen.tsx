import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowUpRightFromSquare,
  faBullhorn,
  faChevronRight,
  faComments,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { IS_IOS, useAccessibility } from '@polito/lib/core';
import {
  BottomBarSpacer,
  CarouselDots,
  DecorativeIcon,
  Icon,
  ListItem,
  OverviewList,
  Row,
  Section,
  SectionHeader,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { DateTime } from 'luxon';

import { ProfileStackParamList } from './ProfileNavigator';
import { communications, news } from './announcements';

const GITHUB_REPO_URL = 'https://github.com/polito/rn-apps';

type Props = NativeStackScreenProps<ProfileStackParamList, 'AppInfo'>;

export const AppInfoScreen = ({ navigation }: Props) => {
  const { t, i18n } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { fontSizes, colors, spacing } = useTheme();
  const { width: pageWidth } = useWindowDimensions();
  const { accessibilityListLabel } = useAccessibility();
  const [index, setIndex] = useState(0);
  const cards = news.slice(0, 4);
  const communication = communications[0];

  const openSupport = () =>
    navigation.getParent()?.navigate('ServicesTab', { screen: 'Support' });

  const feedbackItem = (
    titleKey: string,
    subtitleKey: string,
    icon: IconDefinition,
  ) => (
    <ListItem
      title={t(titleKey)}
      subtitle={t(subtitleKey)}
      leadingItem={
        <DecorativeIcon
          icon={icon}
          size={fontSizes['2xl']}
          color={colors.heading}
        />
      }
      isAction
      accessibilityRole="button"
      accessibilityLabel={`${t(titleKey)}, ${t(subtitleKey)}`}
      onPress={openSupport}
    />
  );

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.container}>
        <Section>
          <SectionHeader
            title={t('appInfoScreen.whatsNew')}
            accessibilityLabel={t('appInfoScreen.whatsNew')}
            trailingItem={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${t('appInfoScreen.whatsNew')}, ${t(
                  'appInfoScreen.showAll',
                )}`}
                onPress={() => navigation.navigate('WhatsNew')}
              >
                <Row align="center" gap={0.5}>
                  <Text variant="link" style={styles.showAll}>
                    {t('appInfoScreen.showAll')}
                  </Text>
                  <DecorativeIcon
                    icon={faChevronRight}
                    color={colors.link}
                    size={fontSizes.xs}
                  />
                </Row>
              </Pressable>
            }
          />
          <View
            accessibilityRole="list"
            accessibilityLabel={t('appInfoScreen.whatsNewListLabel', {
              count: cards.length,
            })}
          >
            <ScrollView
              horizontal
              pagingEnabled
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={e =>
                setIndex(Math.round(e.nativeEvent.contentOffset.x / pageWidth))
              }
            >
              {cards.map((item, cardIndex) => {
                const date = DateTime.fromJSDate(item.date)
                  .setLocale(i18n.language)
                  .toFormat('d MMMM yyyy');
                return (
                  <View
                    key={item.id}
                    style={{ width: pageWidth, paddingHorizontal: spacing[4] }}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={[
                        date,
                        item.title,
                        accessibilityListLabel(cardIndex, cards.length),
                      ].join(', ')}
                      accessibilityHint={t('appInfoScreen.openNewsHint')}
                      onPress={() =>
                        navigation.navigate('NewOverlay', { id: item.id })
                      }
                      style={({ pressed }) => [
                        styles.card,
                        pressed && styles.pressed,
                      ]}
                    >
                      <View style={styles.cardText}>
                        <Text variant="secondaryText" style={styles.cardDate}>
                          {date}
                        </Text>
                        <Text
                          variant="title"
                          style={styles.cardTitle}
                          numberOfLines={2}
                        >
                          {item.title}
                        </Text>
                      </View>
                      <DecorativeIcon
                        icon={faBullhorn}
                        size={fontSizes['2xl']}
                        color={colors.heading}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
            {cards.length > 1 && (
              <View
                style={styles.dots}
                importantForAccessibility="no-hide-descendants"
                accessibilityElementsHidden={IS_IOS}
              >
                <CarouselDots
                  carouselLength={cards.length}
                  carouselIndex={index}
                  gap={10}
                />
              </View>
            )}
          </View>
        </Section>

        {communication && (
          <Section>
            <SectionHeader title={t('appInfoScreen.recentCommunications')} />
            <OverviewList>
              <ListItem
                title={communication.title}
                subtitle={communication.contents}
                subtitleProps={{ numberOfLines: 1 }}
                isAction
                accessibilityRole="button"
                accessibilityLabel={`${communication.title}, ${communication.contents}`}
                accessibilityHint={t('appInfoScreen.openCommunicationHint')}
                onPress={() =>
                  navigation.navigate('NewOverlay', { id: communication.id })
                }
              />
            </OverviewList>
          </Section>
        )}

        <Section>
          <SectionHeader title={t('appInfoScreen.feedback')} />
          <View
            accessibilityRole="list"
            accessibilityLabel={t('appInfoScreen.feedbackListLabel')}
          >
            <OverviewList indented>
              {feedbackItem(
                'appInfoScreen.reportProblemTitle',
                'appInfoScreen.reportProblemSubtitle',
                faTriangleExclamation,
              )}
              {feedbackItem(
                'appInfoScreen.suggestionTitle',
                'appInfoScreen.suggestionSubtitle',
                faComments,
              )}
            </OverviewList>
          </View>
        </Section>

        <OverviewList indented>
          <ListItem
            title={t('appInfoScreen.githubTitle')}
            subtitle={t('appInfoScreen.githubSubtitle')}
            leadingItem={
              <DecorativeIcon
                icon={faGithub}
                size={fontSizes['2xl']}
                color={colors.heading}
              />
            }
            trailingItem={
              <Icon
                icon={faArrowUpRightFromSquare}
                color={colors.secondaryText}
                size={fontSizes.md}
              />
            }
            accessibilityRole="link"
            accessibilityLabel={`${t('appInfoScreen.githubTitle')}, ${t(
              'appInfoScreen.githubSubtitle',
            )}`}
            accessibilityHint={t('common.externalLink')}
            onPress={() => Linking.openURL(GITHUB_REPO_URL)}
          />
        </OverviewList>

        <Text variant="secondaryText" style={styles.version}>
          {t('appInfoScreen.version', {
            version: DeviceInfo.getVersion(),
            build: DeviceInfo.getBuildNumber(),
          })}
        </Text>
      </View>
      <BottomBarSpacer />
    </ScrollView>
  );
};

const createStyles = ({
  colors,
  palettes,
  shapes,
  spacing,
  fontSizes,
}: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: spacing[5],
    },
    showAll: {
      fontSize: fontSizes.xs,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
      padding: spacing[4],
      borderRadius: shapes.lg,
      borderWidth: 1,
      borderColor: palettes.navy[400],
      backgroundColor: colors.surface,
    },
    pressed: {
      opacity: 0.7,
    },
    cardText: {
      flex: 1,
      gap: spacing[1],
    },
    cardDate: {
      fontSize: fontSizes.xs,
    },
    cardTitle: {
      fontSize: fontSizes.md,
    },
    dots: {
      alignItems: 'center',
      marginTop: spacing[6],
    },
    version: {
      fontSize: fontSizes.xs,
      marginHorizontal: spacing[5],
      marginTop: spacing[6],
    },
  });
