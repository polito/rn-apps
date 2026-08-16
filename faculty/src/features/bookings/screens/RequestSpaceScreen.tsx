import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import {
  IconButton,
  ListItem,
  OverviewList,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ProfileStackParamList } from '../../../screens/Servizi/ServiceNavigator';
import { bookingsColors } from '../utils/bookingsTheme';

export const RequestSpaceScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useStylesheet(createStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerBackTitle: '',
      headerShadowVisible: true,
      headerTransparent: false,
      headerStyle: {
        backgroundColor: bookingsColors.headerGray,
      },
      contentStyle: {
        backgroundColor: colors.background,
      },
      headerLeft: () => (
        <IconButton
          icon={faChevronLeft}
          color={bookingsColors.linkBlue}
          size={22}
          adjustSpacing="left"
          noPadding
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />
      ),
    });
  }, [navigation, colors.background, styles.backButton]);

  const options = [
    {
      id: 'room',
      title: t('other.requestRoom'),
      onPress: () => navigation.navigate('PrenotaAulaForm'),
    },
    {
      id: 'facility',
      title: t('bookingsScreen.requestFacilitySpaces'),
      onPress: () => navigation.navigate('CalendarioSpaziStrutture'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerDivider} />
      <OverviewList style={styles.list}>
        {options.map(option => (
          <ListItem
            key={option.id}
            title={option.title}
            titleStyle={styles.listTitle}
            containerStyle={styles.listItem}
            isAction
            onPress={option.onPress}
          />
        ))}
      </OverviewList>
    </View>
  );
};

const createStyles = ({
  dark,
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  spacing,
}: Theme) =>
  StyleSheet.create({
    backButton: {
      marginLeft: -spacing[1],
      paddingHorizontal: spacing[2],
      paddingVertical: spacing[1],
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: spacing[5],
    },
    headerDivider: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.divider,
    },
    list: {
      marginTop: 0,
      marginBottom: 0,
    },
    listItem: {
      minHeight: 44,
      paddingVertical: spacing[1],
    },
    listTitle: {
      overflow: 'hidden',
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      lineHeight: 20,
      color: dark ? colors.title : bookingsColors.textPrimary,
    },
  });
