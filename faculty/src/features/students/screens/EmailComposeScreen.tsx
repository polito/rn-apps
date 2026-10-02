import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CtaButton,
  CtaButtonContainer,
  Text,
  Theme,
  useBottomBarAwareStyles,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SCREEN_HORIZONTAL_PADDING } from '../constants';
import { StudentsStackParamList } from '../types/navigation';

export const EmailComposeScreen = () => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { palettes, dark } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<StudentsStackParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const bottomTabBarHeight = useBottomTabBarHeight();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const isSendEnabled = title.trim().length > 0 && message.trim().length > 0;

  const handleSend = () => {
    if (!isSendEnabled) return;

    Alert.alert(
      t('other.info', { defaultValue: 'Info' }),
      t('other.renderingToMail', { defaultValue: 'Rendering to mail...' }),
      [
        {
          text: t('common.ok', { defaultValue: 'OK' }),
          onPress: () => navigation.popToTop(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            Platform.OS === 'ios'
              ? styles.scrollContentIos
              : styles.scrollContent,
            bottomBarAwareStyles,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.fieldCard}>
            <Text style={[styles.fieldLabel, dark && styles.fieldLabelDark]}>
              {t('other.emailTitle', { defaultValue: 'Title' })}
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={t('other.writeTitleHere', {
                defaultValue: 'Write your title here',
              })}
              placeholderTextColor={palettes.gray[500]}
              selectionColor={palettes.secondary[600]}
              style={[styles.titleInput, dark && styles.inputDark]}
              returnKeyType="next"
            />
          </View>

          <View style={styles.messageCard}>
            <Text style={[styles.fieldLabel, dark && styles.fieldLabelDark]}>
              {t('other.message', { defaultValue: 'Message' })}
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder={t('other.writeMessageHere', {
                defaultValue: 'Write your message here',
              })}
              placeholderTextColor={palettes.gray[500]}
              selectionColor={palettes.secondary[600]}
              style={[styles.messageInput, dark && styles.inputDark]}
              multiline
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <CtaButtonContainer
          absolute={false}
          style={[
            styles.ctaContainer,
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
        </CtaButtonContainer>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = ({
  colors,
  spacing,
  palettes,
  fontSizes,
  fontWeights,
  fontFamilies,
  shapes,
}: Theme) =>
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
    scrollContent: {
      paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
      paddingTop: spacing[2],
      gap: spacing[3],
    },
    scrollContentIos: {
      flexGrow: 1,
      padding: spacing[5],
      gap: spacing[3],
      paddingBottom: spacing[2],
    },
    fieldCard: {
      backgroundColor: colors.surface,
      borderRadius: shapes.lg,
      paddingHorizontal: spacing[4],
      paddingTop: spacing[3],
      paddingBottom: spacing[2],
      minHeight: 48,
    },
    messageCard: {
      backgroundColor: colors.surface,
      borderRadius: shapes.lg,
      paddingHorizontal: spacing[4],
      paddingTop: spacing[3],
      paddingBottom: spacing[3],
      minHeight: 239,
    },
    fieldLabel: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      color: palettes.primary[700],
      lineHeight: 20,
      marginBottom: 0,
    },
    fieldLabelDark: {
      color: palettes.gray[50],
    },
    titleInput: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.normal,
      color: palettes.text[800],
      lineHeight: 24,
      paddingVertical: 0,
      minHeight: 24,
    },
    messageInput: {
      flex: 1,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.normal,
      color: palettes.text[800],
      lineHeight: 24,
      paddingVertical: 0,
      minHeight: 160,
    },
    inputDark: {
      color: palettes.gray[50],
    },
    ctaContainer: {
      paddingHorizontal: 0,
      paddingTop: 0,
      paddingBottom: spacing[4],
    },
    ctaButtonContainer: {
      paddingTop: 0,
      paddingHorizontal: SCREEN_HORIZONTAL_PADDING,
      paddingBottom: 0,
    },
  });
