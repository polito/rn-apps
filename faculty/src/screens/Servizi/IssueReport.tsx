import { useEffect, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ScrollView } from 'react-native';
import { Platform } from 'react-native';

import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  Badge,
  BottomBarSpacer,
  CtaButton,
  IconButton,
  IndentedDivider,
  ListItem,
  Text,
  useTheme,
} from '@polito/lib';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { useBottomBarAwareStyles } from '../../core/hooks/useBottomBarAwareStyles';
import { useSafeAreaSpacing } from '../../core/hooks/useSafeAreaSpacing';
import { ProfileStackParamList } from './ServiceNavigator';

export const IssueReport = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const { issues, setSelectedIssue } = useCourses();
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
          {t('other.reportsFault')}
        </Text>
      ),
    });
  }, [navigation, colors, t]);

  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={bottomBarAwareStyles}
        contentInsetAdjustmentBehavior="automatic"
        bounces={false}
      >
        <FlatList
          data={issues}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={paddingHorizontal}
          ItemSeparatorComponent={() => <IndentedDivider />}
          renderItem={({ item }) => {
            const getBadgeColors = (status: string) => {
              switch (status) {
                case 'in attesa':
                  return {
                    backgroundColor: '#FFF3CD',
                    foregroundColor: '#856404',
                  }; // light yellow bg, dark yellow text
                case 'risolta':
                  return {
                    backgroundColor: '#D4EDDA',
                    foregroundColor: '#155724',
                  }; // light green bg, dark green text
                case 'respinta':
                  return {
                    backgroundColor: '#F8D7DA',
                    foregroundColor: '#721C24',
                  }; // light red bg, dark red text
                default:
                  return {
                    backgroundColor: '#E2E3E5',
                    foregroundColor: '#6C757D',
                  }; // default grey
              }
            };

            const { backgroundColor, foregroundColor } = getBadgeColors(
              item.status,
            );

            return (
              <ListItem
                title={item.title.replace(/^Segnalazione/, t('other.report'))}
                subtitle={item.details}
                onPress={() => {
                  setSelectedIssue(item);
                  navigation.navigate('IssueDetails');
                }}
                trailingItem={
                  <Badge
                    text={
                      item.status === 'in attesa'
                        ? t('other.waiting')
                        : item.status === 'risolta'
                          ? t('other.resolved')
                          : item.status === 'respinta'
                            ? t('other.rejected')
                            : item.status
                    }
                    backgroundColor={backgroundColor}
                    foregroundColor={foregroundColor}
                  />
                }
              />
            );
          }}
          ListFooterComponent={<BottomBarSpacer />}
        />
      </ScrollView>
      <CtaButton
        title={t('other.newReport')}
        action={() => {
          navigation.navigate('IssueReportForm');
        }}
        absolute={false}
        variant="filled"
        icon={faPlus}
      />
    </>
  );
};
