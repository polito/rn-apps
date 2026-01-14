import { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView, View } from 'react-native';
import { Platform } from 'react-native';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { useBottomBarAwareStyles } from '../../core/hooks/useBottomBarAwareStyles';
import { useSafeAreaSpacing } from '../../core/hooks/useSafeAreaSpacing';
import { Badge } from '../../ui/components/Badge';
import { IconButton } from '../../ui/components/IconButton';
import { IndentedDivider } from '../../ui/components/IndentedDivider';
import { ListItem } from '../../ui/components/ListItem';
import { OverviewList } from '../../ui/components/OverviewList';
import { SectionHeader } from '../../ui/components/SectionHeader';
import { Text } from '../../ui/components/Text';
import { useTheme } from '../../ui/hooks/useTheme';
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
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      navigation.navigate('Servizi');
    });

    return unsubscribe;
  }, [navigation]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <IconButton
          icon={faArrowLeft}
          size={22}
          onPress={() => navigation.navigate('Servizi')}
        />
      ),
      headerTitle: () => (
        <Text
          variant="heading"
          style={{
            textAlign: 'center',
            width: '100%',
            marginLeft: Platform.OS === 'android' ? -25 : -55,
          }}
        >
          {t('other.digitalSignature')}
        </Text>
      ),
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
