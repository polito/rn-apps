import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, View } from 'react-native';

import { faDownload, faFileLines } from '@fortawesome/free-solid-svg-icons';
import {
  BottomBarSpacer,
  CtaButton,
  Icon,
  ListItem,
  OverviewList,
  useBottomBarAwareStyles,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { ProfileStackParamList } from './ProfileNavigator';

const PORTO_IRIS_URL = 'https://iris.polito.it';

export const PublicationListItem = ({ title }: { title: string }) => {
  const { colors, fontSizes } = useTheme();

  return (
    <ListItem
      title={title}
      leadingItem={<Icon icon={faFileLines} size={fontSizes['2xl']} />}
      trailingItem={
        <Icon
          icon={faDownload}
          size={fontSizes.md}
          color={colors.secondaryText}
        />
      }
    />
  );
};

export const PublicationsScreen = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { spacing } = useTheme();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const { user } = useCourses();
  const publications = user.publications ?? [];

  useLayoutEffect(() => {
    navigation.setOptions({ title: t('other.publications') });
  }, [navigation, t]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          bottomBarAwareStyles,
          { paddingTop: spacing[3] },
        ]}
        contentInsetAdjustmentBehavior="automatic"
      >
        {publications.length > 0 ? (
          <OverviewList indented>
            {publications.map((pub, index) => (
              <PublicationListItem key={index} title={pub} />
            ))}
          </OverviewList>
        ) : null}
        <View style={{ height: spacing[20] }} />
        <BottomBarSpacer />
      </ScrollView>
      <CtaButton
        title={t('other.viewAllPublicationsIn', { portal: 'Porto@Iris' })}
        action={() => Linking.openURL(PORTO_IRIS_URL)}
      />
    </View>
  );
};
