import { useCallback, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFeedbackContext } from '@polito/lib/core';
import {
  CtaButton,
  OverviewList,
  Text,
  TextButton,
  TextField,
  Theme,
  useHideTabs,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { StudentsStackParamList } from '../navigation/StudentsNavigator';

type Props = NativeStackScreenProps<StudentsStackParamList, 'EmailCompose'>;

export const EmailComposeScreen = ({ navigation }: Props) => {
  useHideTabs();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useStylesheet(createStyles);
  const bottomTabBarHeight = useBottomTabBarHeight();
  const { setFeedback } = useFeedbackContext();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const isSendEnabled = title.trim().length > 0 && message.trim().length > 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerShadowVisible: false,
      ...(Platform.OS === 'ios'
        ? {
            headerBackVisible: false,
            headerLeft: () => (
              <TextButton
                color={colors.secondaryText}
                onPress={() => navigation.goBack()}
              >
                {t('common.back')}
              </TextButton>
            ),
            headerRight: () => null,
          }
        : {}),
    });
  }, [colors.secondaryText, navigation, t]);

  const handleSend = useCallback(() => {
    if (!isSendEnabled) return;

    setFeedback({
      text: t('other.renderingToMail', {
        defaultValue: 'Rendering to mail...',
      }),
    });
    navigation.popToTop();
  }, [isSendEnabled, navigation, setFeedback, t]);

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <OverviewList style={styles.field} dividers={false}>
            <View>
              <Text weight="semibold" style={styles.cardLabel}>
                {t('other.emailTitle', { defaultValue: 'Title' })}
              </Text>
              <TextField
                label={t('other.writeTitleHere', {
                  defaultValue: 'Write your title here',
                })}
                accessibilityLabel={t('other.emailTitle', {
                  defaultValue: 'Title',
                })}
                value={title}
                onChangeText={setTitle}
                autoCapitalize="sentences"
                returnKeyType="next"
                style={styles.titleField}
                inputStyle={styles.input}
              />
            </View>
          </OverviewList>

          <OverviewList style={styles.messageField} dividers={false}>
            <View>
              <Text weight="semibold" style={styles.cardLabel}>
                {t('other.message', { defaultValue: 'Message' })}
              </Text>
              <TextField
                label={t('other.writeMessageHere', {
                  defaultValue: 'Write your message here',
                })}
                accessibilityLabel={t('other.message', {
                  defaultValue: 'Message',
                })}
                value={message}
                onChangeText={setMessage}
                autoCapitalize="sentences"
                multiline
                numberOfLines={8}
                style={styles.titleField}
                inputStyle={styles.messageInput}
              />
            </View>
          </OverviewList>
        </ScrollView>

        <View
          style={[
            styles.ctaRow,
            Platform.OS === 'android'
              ? { paddingBottom: bottomTabBarHeight }
              : undefined,
          ]}
        >
          <CtaButton
            title={t('other.send', { defaultValue: 'Send' })}
            action={handleSend}
            disabled={!isSendEnabled}
            absolute={false}
            containerStyle={styles.ctaButtonContainer}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = ({ colors, spacing, fontSizes }: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingTop: spacing[4],
      paddingBottom: spacing[4],
      gap: spacing[3],
    },
    field: {
      marginHorizontal: spacing[5],
    },
    cardLabel: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[2],
      fontSize: fontSizes.md,
      color: colors.heading,
    },
    titleField: {
      paddingTop: 0,
      paddingBottom: spacing[1],
    },
    messageField: {
      marginHorizontal: spacing[5],
      minHeight: 239,
    },
    input: {
      borderBottomWidth: 0,
      paddingTop: spacing[0.5],
    },
    messageInput: {
      borderBottomWidth: 0,
      minHeight: 180,
      paddingTop: spacing[0.5],
      textAlignVertical: 'top',
    },
    ctaRow: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing[5],
      paddingTop: spacing[2],
      paddingBottom: spacing[4],
    },
    ctaButtonContainer: {
      paddingTop: 0,
      paddingHorizontal: 0,
      paddingBottom: 0,
    },
  });
