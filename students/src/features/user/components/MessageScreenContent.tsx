import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import {
  IS_IOS,
  formatDateTime,
  getHtmlTextContent,
  linkUrls,
} from '@polito/lib/core';
import {
  HtmlView,
  OverviewList,
  PersonListItem,
  Section,
  Text,
  type Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { Message } from '@polito/student-api-client';

import { useGetPerson } from '../../../core/queries/peopleHooks';

type Props = {
  message: Message;
  modal?: boolean;
};

export const MessageScreenContent = ({ message, modal }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const hasSender = !!message?.senderId;
  const hasDate = !isNaN(message?.sentAt.getDate());
  const title = message?.title ?? '';
  const titleAccessibilityLabel = getHtmlTextContent(title);
  const text = message?.message;
  const date = formatDateTime(message?.sentAt);
  const sentAtLabel = hasDate
    ? `${t('messagesScreen.sentAt')} ${date}`
    : undefined;
  const personQuery = useGetPerson(message?.senderId || undefined);

  // replace every url in string with a link
  const html = useMemo(() => {
    if (!text) return '';
    return linkUrls(text);
  }, [text]);
  const messageBodyLabel = useMemo(
    () => (html ? getHtmlTextContent(html) : ''),
    [html],
  );

  return (
    <SafeAreaView>
      <Section>
        <Text
          variant="title"
          accessibilityRole="header"
          accessibilityLabel={titleAccessibilityLabel || undefined}
          style={styles.heading}
        >
          {title}
        </Text>
        {!!hasDate && (
          <Text
            variant="secondaryText"
            accessibilityLabel={sentAtLabel}
            style={styles.date}
          >
            {date}
          </Text>
        )}
        {!!text && (
          <View
            accessible
            accessibilityLabel={messageBodyLabel}
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden={IS_IOS}
            style={styles.textMessage}
          >
            <HtmlView
              props={{ source: { html }, baseStyle: { padding: 0 } }}
              variant="longProse"
            />
          </View>
        )}
      </Section>
      {hasSender && (
        <>
          <View style={styles.container}>
            <Text
              variant="subHeading"
              weight="semibold"
              accessibilityRole="header"
            >
              {t('messageScreen.sender')}
            </Text>
          </View>
          <OverviewList indented loading={personQuery.isLoading}>
            <PersonListItem
              person={personQuery.data!}
              subtitle={t('common.teacher')}
              navigateEnabled={!modal}
            />
          </OverviewList>
        </>
      )}
    </SafeAreaView>
  );
};

const createStyles = ({ spacing, fontWeights }: Theme) =>
  StyleSheet.create({
    heading: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[3],
      fontWeight: fontWeights.bold,
    },
    date: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[1],
    },
    textMessage: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[3],
    },
    container: {
      paddingHorizontal: spacing[5],
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
