import { useCallback, useState } from 'react';
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
  InfoMessage,
  OverviewList,
  Text,
  TextButton,
  TextField,
  Theme,
  useHideTabs,
  useStylesheet,
} from '@polito/lib/ui';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { StudentsStackParamList } from '../navigation/StudentsNavigator';

const NOTIFY_MAX_CHARACTERS = 4000;

type Props = NativeStackScreenProps<StudentsStackParamList, 'NotifyCompose'>;

export const NotifyComposeScreen = ({ navigation }: Props) => {
  useHideTabs();
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      const parent = navigation.getParent();
      const timer = setTimeout(() => {
        parent?.setOptions({ tabBarStyle: { display: 'none' } });
      }, 0);
      return () => clearTimeout(timer);
    }, [navigation]),
  );
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { setFeedback } = useFeedbackContext();
  const [message, setMessage] = useState('');
  const [showCharacterLimitWarning, setShowCharacterLimitWarning] =
    useState(false);

  const isSendEnabled = message.trim().length > 0;

  const dismissCompose = useCallback(() => {
    const { index, routes } = navigation.getState();
    const courseIndex = routes.findIndex(
      route => (route.name as string) === 'Course',
    );
    if (courseIndex >= 0 && index > courseIndex) {
      navigation.pop(index - courseIndex);
      return;
    }
    navigation.popToTop();
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
    dismissCompose();
  }, [dismissCompose, isSendEnabled, message.length, setFeedback, t]);

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      {Platform.OS === 'ios' ? (
        <View style={styles.header}>
          <TextButton onPress={() => navigation.goBack()}>
            {t('common.close')}
          </TextButton>
          <Text
            weight="semibold"
            style={styles.headerTitle}
            numberOfLines={1}
            pointerEvents="none"
          >
            {t('other.newNotify', { defaultValue: 'New notify' })}
          </Text>
        </View>
      ) : null}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
                onChangeText={handleMessageChange}
                autoCapitalize="sentences"
                multiline
                numberOfLines={8}
                style={styles.titleField}
                inputStyle={styles.messageInput}
              />
            </View>
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

        <View style={styles.ctaRow}>
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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[2],
    },
    headerTitle: {
      position: 'absolute',
      left: spacing[5],
      right: spacing[5],
      textAlign: 'center',
      fontSize: fontSizes.md,
      color: colors.title,
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
    messageInput: {
      borderBottomWidth: 0,
      minHeight: 180,
      paddingTop: spacing[0.5],
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
