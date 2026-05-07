import { StyleSheet, View } from 'react-native';

import { Text, Theme, useStylesheet, useTheme } from '@polito/lib/ui';

import { IosTopBar, IosTopBarTextAction } from './IosTopBar';

type Props = {
  title: string;
  backLabel: string;
  onBackPress: () => void;
};

export const CourseDirectoryTopBar = ({
  title,
  backLabel,
  onBackPress,
}: Props) => {
  const { colors, dark, palettes } = useTheme();
  const styles = useStylesheet(createStyles);
  const iosGrabberColor = dark ? palettes.gray[500] : palettes.gray[300];

  return (
    <IosTopBar
      backgroundColor={dark ? colors.surface : colors.white}
      grabberColor={iosGrabberColor}
      dividerColor={dark ? palettes.gray[600] : colors.divider}
      left={
        <IosTopBarTextAction
          label={backLabel}
          onPress={onBackPress}
          color={palettes.gray[500]}
          containerStyle={styles.backButton}
        />
      }
      center={
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      }
      right={<View style={styles.rightSpacer} />}
    />
  );
};

const createStyles = ({ colors, spacing, fontFamilies, fontWeights }: Theme) =>
  StyleSheet.create({
    backButton: {
      minWidth: 56,
    },
    title: {
      flex: 1,
      textAlign: 'center',
      color: colors.heading,
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
      letterSpacing: -0.43,
      marginTop: 6,
      marginHorizontal: spacing[1],
    },
    rightSpacer: {
      minWidth: 56,
      minHeight: 28,
    },
  });
