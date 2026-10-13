import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, View } from 'react-native';

import {
  Badge,
  IndentedDivider,
  ListItem,
  OverviewList,
  SectionHeader,
  useBottomBarAwareStyles,
  useSafeAreaSpacing,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { ProfileStackParamList } from './ServiceNavigator';

export const DigitalSignatureScreen = () => {
  const { t } = useTranslation();
  const { spacing, colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const { setSelectedDoc } = useCourses();
  const { tbsDocs } = useCourses();
  const { paddingHorizontal } = useSafeAreaSpacing();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('other.digitalSignature'),
    });
  }, [navigation, colors, t]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}
    >
      <View style={{ marginTop: spacing[4] }} />
      <SectionHeader title={t('other.toBeSigned')} />
      <View style={{ marginBottom: spacing[4] }} />
      <OverviewList>
        <FlatList
          data={tbsDocs.filter(b => b.status === 'da firmare')}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={paddingHorizontal}
          ItemSeparatorComponent={() => <IndentedDivider />}
          renderItem={({ item }) => {
            return (
              <ListItem
                title={item.title}
                subtitle={'Da firmare entro ' + item.tbsDate}
                onPress={() => {
                  setSelectedDoc(item);
                  navigation.navigate('SignatureScreen');
                }}
              />
            );
          }}
        />
      </OverviewList>

      <View style={{ marginTop: spacing[4] }} />
      <SectionHeader title={t('other.signedByYou')} />
      <View style={{ marginBottom: spacing[4] }} />
      <OverviewList>
        <FlatList
          data={tbsDocs.filter(b => b.status === 'firmato')}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={paddingHorizontal}
          ItemSeparatorComponent={() => <IndentedDivider />}
          renderItem={({ item }) => {
            const getBadgeColors = (signers: number) => {
              switch (signers) {
                case 1:
                  return {
                    backgroundColor: '#D4EDDA',
                    foregroundColor: '#155724',
                  }; // light green bg, dark green text
                default:
                  return {
                    backgroundColor: '#FFF3CD',
                    foregroundColor: '#856404',
                  };
              }
            };

            const { backgroundColor, foregroundColor } = getBadgeColors(
              item.numberOfSignatures,
            );

            return (
              <ListItem
                title={item.title}
                subtitle={t('other.toBeSignedUntil') + ' ' + item.tbsDate}
                onPress={() => {
                  setSelectedDoc(item);
                  navigation.navigate('SignatureScreen');
                }}
                trailingItem={
                  <Badge
                    text={
                      item.numberOfSignatures === 1
                        ? t('other.completedSigns')
                        : t('other.waitingForSigns')
                    }
                    backgroundColor={backgroundColor}
                    foregroundColor={foregroundColor}
                  />
                }
              />
            );
          }}
        />
      </OverviewList>
    </ScrollView>
  );
};
