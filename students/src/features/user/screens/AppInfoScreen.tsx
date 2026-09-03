import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowUpRightFromSquare,
  faChevronRight,
  faComments,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { IS_IOS, getHtmlTextContent } from '@polito/lib/core';
import {
  BottomBarSpacer,
  Icon,
  ListItem,
  OverviewList,
  RefreshControl,
  Row,
  Section,
  SectionHeader,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';

import {
  getWhatsNewArchiveAnnouncements,
  useGetAnnouncements,
} from '../../../core/queries/announcementHooks';
import {
  getOperationalNotices,
  useGetNews,
} from '../../../core/queries/newsHooks';
import { WhatsNewCard } from '../components/WhatsNewCard';

const GITHUB_REPO_URL = 'https://github.com/polito/rn-apps';
const POLITO_STUDENTS_TOPIC_ID = 1101;
const TECHNICAL_ISSUES_SUBTOPIC_ID = 2001;
const FEEDBACK_SUGGESTIONS_SUBTOPIC_ID = 1721;
const TECHNICAL_ISSUES_LINK = {
  screen: 'CreateTicket',
  params: {
    topicId: POLITO_STUDENTS_TOPIC_ID,
    subtopicId: TECHNICAL_ISSUES_SUBTOPIC_ID,
  },
};
const SUGGESTIONS_LINK = {
  screen: 'CreateTicket',
  params: {
    topicId: POLITO_STUDENTS_TOPIC_ID,
    subtopicId: FEEDBACK_SUGGESTIONS_SUBTOPIC_ID,
  },
};

export const AppInfoScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { fontSizes } = useTheme();
  const version = DeviceInfo.getVersion();
  const buildNumber = DeviceInfo.getBuildNumber().slice(-2);

  const announcementsQuery = useGetAnnouncements();
  const newsQuery = useGetNews();

  const announcements = useMemo(
    () => getWhatsNewArchiveAnnouncements(announcementsQuery.data),
    [announcementsQuery.data],
  );

  const latestNews = useMemo(
    () => getOperationalNotices(newsQuery.data)[0],
    [newsQuery.data],
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl queries={[announcementsQuery, newsQuery]} manual />
      }
    >
      <SafeAreaView>
        <View style={styles.container}>
          <Section>
            <SectionHeader
              title={t('appInfoScreen.whatsNew')}
              titleStyle={styles.sectionTitle}
              linkTo="WhatsNew"
              accessibilityLabel={[
                t('appInfoScreen.whatsNew'),
                t('appInfoScreen.showAll'),
              ].join(', ')}
              trailingItem={
                <Row align="center" gap={0.5} style={styles.showAllRow}>
                  <Text
                    variant="link"
                    style={styles.showAll}
                    accessible={false}
                  >
                    {t('appInfoScreen.showAll')}
                  </Text>
                  <View
                    accessible={false}
                    importantForAccessibility="no-hide-descendants"
                    accessibilityElementsHidden={IS_IOS}
                  >
                    <Icon
                      icon={faChevronRight}
                      color={styles.showAll.color}
                      size={fontSizes.xs}
                    />
                  </View>
                </Row>
              }
            />
            {announcementsQuery.isLoading || announcements.length === 0 ? (
              <View
                accessibilityRole="list"
                accessibilityLabel={
                  announcementsQuery.isLoading
                    ? t('appInfoScreen.whatsNewLoading')
                    : t('appInfoScreen.whatsNewListLabel', { count: 0 })
                }
              >
                <OverviewList
                  loading={announcementsQuery.isLoading}
                  emptyStateText={t('appInfoScreen.whatsNewEmpty')}
                />
              </View>
            ) : (
              <WhatsNewCard announcements={announcements.slice(0, 4)} />
            )}
          </Section>

          <Section>
            <SectionHeader
              title={t('appInfoScreen.recentCommunications')}
              titleStyle={styles.sectionTitle}
            />
            {newsQuery.isLoading || !latestNews ? (
              <View
                accessibilityRole="list"
                accessibilityLabel={
                  newsQuery.isLoading
                    ? t('common.loading')
                    : t('appInfoScreen.recentCommunicationsListLabel')
                }
              >
                <OverviewList
                  loading={newsQuery.isLoading}
                  emptyStateText={t('appInfoScreen.recentCommunicationsEmpty')}
                />
              </View>
            ) : (
              <View
                accessibilityRole="list"
                accessibilityLabel={t(
                  'appInfoScreen.recentCommunicationsListLabel',
                )}
              >
                <OverviewList>
                  <ListItem
                    title={getHtmlTextContent(latestNews.title ?? '')}
                    titleStyle={styles.listItemTitle}
                    subtitle={getHtmlTextContent(
                      latestNews.shortDescription ?? '',
                    )}
                    subtitleStyle={styles.listItemSubtitle}
                    subtitleProps={{ numberOfLines: 1 }}
                    containerStyle={styles.listItemContainer}
                    trailingItem={
                      <View
                        accessible={false}
                        importantForAccessibility="no-hide-descendants"
                        accessibilityElementsHidden={IS_IOS}
                      >
                        <Icon
                          icon={faChevronRight}
                          size={fontSizes.md}
                          color={styles.listItemTrailingIcon.color}
                        />
                      </View>
                    }
                    accessibilityRole="button"
                    accessibilityLabel={[
                      getHtmlTextContent(latestNews.title ?? ''),
                      getHtmlTextContent(latestNews.shortDescription ?? ''),
                    ]
                      .filter(Boolean)
                      .join(', ')}
                    accessibilityHint={t('appInfoScreen.openCommunicationHint')}
                    linkTo={{
                      screen: 'NewsItem',
                      params: { id: latestNews.id },
                    }}
                  />
                </OverviewList>
              </View>
            )}
          </Section>

          <Section>
            <SectionHeader
              title={t('appInfoScreen.feedback')}
              titleStyle={styles.sectionTitle}
            />
            <View
              accessibilityRole="list"
              accessibilityLabel={t('appInfoScreen.feedbackListLabel')}
            >
              <OverviewList indented>
                <ListItem
                  title={t('appInfoScreen.reportProblemTitle')}
                  titleStyle={styles.listItemTitle}
                  subtitle={t('appInfoScreen.reportProblemSubtitle')}
                  subtitleStyle={styles.listItemSubtitle}
                  subtitleProps={{ numberOfLines: 1 }}
                  containerStyle={styles.listItemContainer}
                  leadingItem={
                    <View
                      accessible={false}
                      importantForAccessibility="no-hide-descendants"
                      accessibilityElementsHidden={IS_IOS}
                    >
                      <Icon
                        icon={faTriangleExclamation}
                        size={fontSizes['2xl']}
                        color={styles.listItemIcon.color}
                      />
                    </View>
                  }
                  trailingItem={
                    <View
                      accessible={false}
                      importantForAccessibility="no-hide-descendants"
                      accessibilityElementsHidden={IS_IOS}
                    >
                      <Icon
                        icon={faChevronRight}
                        size={fontSizes.md}
                        color={styles.listItemTrailingIcon.color}
                      />
                    </View>
                  }
                  accessibilityRole="button"
                  accessibilityLabel={[
                    t('appInfoScreen.reportProblemTitle'),
                    t('appInfoScreen.reportProblemSubtitle'),
                  ].join(', ')}
                  accessibilityHint={t('appInfoScreen.reportProblemHint')}
                  linkTo={TECHNICAL_ISSUES_LINK}
                />
                <ListItem
                  title={t('appInfoScreen.suggestionTitle')}
                  titleStyle={styles.listItemTitle}
                  subtitle={t('appInfoScreen.suggestionSubtitle')}
                  subtitleStyle={styles.listItemSubtitle}
                  subtitleProps={{ numberOfLines: 1 }}
                  containerStyle={styles.listItemContainer}
                  leadingItem={
                    <View
                      accessible={false}
                      importantForAccessibility="no-hide-descendants"
                      accessibilityElementsHidden={IS_IOS}
                    >
                      <Icon
                        icon={faComments}
                        size={fontSizes['2xl']}
                        color={styles.listItemIcon.color}
                      />
                    </View>
                  }
                  trailingItem={
                    <View
                      accessible={false}
                      importantForAccessibility="no-hide-descendants"
                      accessibilityElementsHidden={IS_IOS}
                    >
                      <Icon
                        icon={faChevronRight}
                        size={fontSizes.md}
                        color={styles.listItemTrailingIcon.color}
                      />
                    </View>
                  }
                  accessibilityRole="button"
                  accessibilityLabel={[
                    t('appInfoScreen.suggestionTitle'),
                    t('appInfoScreen.suggestionSubtitle'),
                  ].join(', ')}
                  accessibilityHint={t('appInfoScreen.suggestionHint')}
                  linkTo={SUGGESTIONS_LINK}
                />
              </OverviewList>
            </View>
          </Section>

          <OverviewList indented>
            <ListItem
              title={t('appInfoScreen.githubTitle')}
              titleStyle={styles.listItemTitle}
              subtitle={t('appInfoScreen.githubSubtitle')}
              subtitleStyle={styles.listItemSubtitle}
              subtitleProps={{ numberOfLines: 1 }}
              containerStyle={styles.listItemContainer}
              leadingItem={
                <View
                  accessible={false}
                  importantForAccessibility="no-hide-descendants"
                  accessibilityElementsHidden={IS_IOS}
                >
                  <Icon
                    icon={faGithub}
                    size={fontSizes['2xl']}
                    color={styles.listItemIcon.color}
                  />
                </View>
              }
              trailingItem={
                <View
                  accessible={false}
                  importantForAccessibility="no-hide-descendants"
                  accessibilityElementsHidden={IS_IOS}
                >
                  <Icon
                    icon={faArrowUpRightFromSquare}
                    color={styles.listItemTrailingIcon.color}
                    size={fontSizes.md}
                  />
                </View>
              }
              accessibilityRole="link"
              accessibilityLabel={[
                t('appInfoScreen.githubTitle'),
                t('appInfoScreen.githubSubtitle'),
              ].join(', ')}
              accessibilityHint={t('common.externalLink')}
              onPress={() => Linking.openURL(GITHUB_REPO_URL)}
            />
          </OverviewList>

          <Text
            variant="secondaryText"
            style={styles.version}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {t('appInfoScreen.version', { version, build: buildNumber })}
          </Text>
        </View>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};

const createStyles = ({ colors, spacing, fontSizes, fontWeights }: Theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: spacing[5],
    },
    sectionTitle: {
      color: colors.heading,
      fontFamily: 'Montserrat-Bold',
      fontSize: fontSizes.md,
      fontStyle: 'normal',
      fontWeight: fontWeights.bold,
      lineHeight: fontSizes.xl,
    },
    showAll: {
      color: colors.link,
      fontFamily: 'Montserrat-Medium',
      fontSize: fontSizes.xs,
      fontStyle: 'normal',
      fontWeight: fontWeights.medium,
      lineHeight: fontSizes.md,
      textAlign: 'right',
    },
    showAllRow: {
      marginRight: spacing[2],
    },
    listItemContainer: {
      minHeight: 52,
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[2],
    },
    listItemTitle: {
      color: colors.title,
      fontFamily: 'Montserrat-SemiBold',
      fontSize: fontSizes.sm,
      fontStyle: 'normal',
      fontWeight: fontWeights.semibold,
      lineHeight: fontSizes.xl,
      overflow: 'hidden',
    },
    listItemSubtitle: {
      color: colors.secondaryText,
      fontFamily: 'Montserrat-Medium',
      fontSize: fontSizes.xs,
      fontStyle: 'normal',
      fontWeight: fontWeights.medium,
      lineHeight: fontSizes.md,
      overflow: 'hidden',
    },
    listItemIcon: {
      color: colors.heading,
      textAlign: 'center',
    },
    listItemTrailingIcon: {
      color: colors.secondaryText,
      textAlign: 'center',
    },
    version: {
      color: colors.secondaryText,
      fontFamily: 'Montserrat-Medium',
      fontSize: fontSizes.xs,
      fontStyle: 'normal',
      fontWeight: fontWeights.medium,
      lineHeight: fontSizes.md,
      marginHorizontal: spacing[5],
      marginTop: spacing[6],
      overflow: 'hidden',
    },
  });
