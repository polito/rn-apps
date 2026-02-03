import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';

import { usePreferencesContext } from '@polito/lib';
import { ActivityIndicator } from '@polito/lib';
import { Text } from '@polito/lib';
import { useStylesheet } from '@polito/lib';
import { Theme } from '@polito/lib';

import { AppPreferences } from '../types/preferences';

interface Props {
  stepNumber: number;
  width: number;
}

export const OnboardingStep = ({ stepNumber, width }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { language } = usePreferencesContext<AppPreferences>();

  const [isLoading, setIsLoading] = useState(true);

  const videoUrl = useMemo(() => {
    return `https://video.polito.it/public/app/onboarding_step_${
      stepNumber + 1
    }_${Platform.OS}_${language}.mp4`;
  }, [language, stepNumber]);

  return (
    <SafeAreaView>
      <View style={[{ width }, styles.content]}>
        <View style={styles.header}>
          <Text variant="title" role="heading">
            {t(`onboardingScreen.steps.${stepNumber}.title`)}
          </Text>
          <Text variant="prose" role="definition">
            {t(`onboardingScreen.steps.${stepNumber}.content`)}
          </Text>
        </View>
        <View style={styles.videoContainer}>
          <Video
            onBuffer={data => {
              if (data.isBuffering) setIsLoading(true);
              else setIsLoading(false);
            }}
            source={{
              uri: videoUrl,
            }}
            style={[styles.video, styles.loadingVideo]}
            resizeMode="contain"
            repeat={true}
          />
          {isLoading && <ActivityIndicator style={styles.activityIndicator} />}
        </View>
      </View>
    </SafeAreaView>
  );
};

const createStyles = ({ dark, spacing, palettes }: Theme) =>
  StyleSheet.create({
    content: {
      paddingTop: spacing[5],
      height: '100%',
      gap: spacing[5],
      paddingVertical: spacing[5],
    },
    header: {
      paddingHorizontal: spacing[5],
      gap: spacing[5],
    },
    video: {
      borderRadius: 25,
      borderWidth: 1,
      alignSelf: 'center',
      aspectRatio: 1080 / 2340,
      elevation: 4,
      flexGrow: 1,
      borderColor: Platform.select({
        ios: dark ? palettes.gray[800] : palettes.gray[400],
        android: 'transparent',
      }),
    },
    loadingVideo: {
      backgroundColor: dark ? palettes.gray[600] : palettes.gray[200],
    },
    activityIndicator: {
      position: 'absolute',
      alignSelf: 'center',
    },
    videoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
    },
  });
