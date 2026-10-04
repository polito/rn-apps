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

import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { useFeedbackContext } from '@polito/lib/core';
import {
  CtaButton,
  InfoMessage,
  OverviewList,
  TextField,
  Theme,
  createHeaderCloseButton,
  useHideTabs,
  useStylesheet,
} from '@polito/lib/ui';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { StudentsStackParamList } from '../navigation/StudentsNavigator';

const NOTIFY_MAX_CHARACTERS = 4000;

type Props = NativeStackScreenProps<StudentsStackParamList, 'NotifyCompose'>;

export const NotifyComposeScreen = ({ navigation }: Props) => {
  useHideTabs();
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const bottomTabBarHeight = useBottomTabBarHeight();
  const { setFeedback } = useFeedbackContext();
  const [message, setMessage] = useState('');
  const [showCharacterLimitWarning, setShowCharacterLimitWarning] =
    useState(false);

  const isSendEnabled = message.trim().length > 0;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerShadowVisible: false,
      headerRight:
        Platform.OS === 'ios' ? createHeaderCloseButton(navigation) : undefined,
    });
  }, [navigation]);

  const handleMessageChange = (text: string) => {
    setMessage(text);
    if (text.length <= NOTIFY_MAX_CHARACTERS) {
      setShowCharacterLimitWarning(false);
    }
  };

  const handleSend = useCallback(() => {
    if (!isSendEnabled) return;

    if (message.length > NOTIFY_MAX_CHARACTERS) {
      setShowCharacterLimitWarning(true);
      return;
    }

    setFeedback({
      text: t('other.comingSoon', { defaultValue: 'Coming soon.' }),
    });
    navigation.popToTop();
  }, [isSendEnabled, message.length, navigation, setFeedback, t]);

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
          <OverviewList style={styles.messageField}>
            <TextField
              label={t('other.writeMessageHere', {
                defaultValue: 'Write your message here',
              })}
              accessibilityLabel={t('other.message', {
                defaultValue: 'Message',
              })}
              value={message}
              onChangeText={handleMessageChange}
              autoCapitalize="sentences"
              multiline
              numberOfLines={8}
              inputStyle={styles.messageInput}
            />
          </OverviewList>
        </ScrollView>

        {showCharacterLimitWarning ? (
          <InfoMessage variant="warning" style={styles.warning}>
            {t('other.notifyMaxCharacters', {
              defaultValue:
                'You have reached the maximum character limit of 4000',
            })}
          </InfoMessage>
        ) : null}

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
            icon={faPaperPlane}
            disabled={!isSendEnabled}
            absolute={false}
            containerStyle={styles.ctaButtonContainer}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = ({ colors, spacing }: Theme) =>
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
    },
    messageField: {
      marginHorizontal: spacing[5],
      minHeight: 239,
    },
    messageInput: {
      borderBottomWidth: 0,
      minHeight: 180,
      textAlignVertical: 'top',
    },
    warning: {
      marginHorizontal: spacing[5],
      marginBottom: spacing[3],
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
