import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import {
  BottomBarSpacer,
  Icon,
  ListItem,
  useBottomBarAwareStyles,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { SectionList } from '../../core/components/SectionList';
import { useCourses } from '../../core/contexts/CoursesContext';
import { ProfileStackParamList } from './ProfileNavigator';

export const PublicationsScreen = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { fontSizes } = useTheme();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const { user } = useCourses();
  const publications = user.publications ?? [];

  useLayoutEffect(() => {
    navigation.setOptions({ title: t('other.publications') });
  }, [navigation, t]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
    >
      {publications.length > 0 ? (
        <SectionList>
          {publications.map((pub, index) => (
            <ListItem
              key={index}
              title={pub}
              leadingItem={<Icon icon={faFileAlt} size={fontSizes.xl} />}
              multilineTitle={true}
            />
          ))}
        </SectionList>
      ) : null}
      <BottomBarSpacer />
    </ScrollView>
  );
};
