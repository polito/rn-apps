import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Platform } from 'react-native';

import {
  faArrowLeft,
  faInbox,
  faPerson,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  BottomBarSpacer,
  EmptyState,
  GlobalStyles,
  IconButton,
  IndentedDivider,
  ListItem,
  SectionHeader,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { useBottomBarAwareStyles } from '../../core/hooks/useBottomBarAwareStyles';
import { useSafeAreaSpacing } from '../../core/hooks/useSafeAreaSpacing';
import { ProfileStackParamList } from './ServiceNavigator';

export const PersoneScreen = () => {
  const { t } = useTranslation();
  const { spacing, colors } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { setSelectedProfile } = useCourses();
  const [searchText, setSearchText] = useState('');
  const { fakeProfiles } = useCourses();
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
            marginLeft: Platform.OS === 'android' ? -25 : -60,
          }}
        >
          Persone
        </Text>
      ),
    });
  }, [navigation, colors]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}
    >
      <View style={styles.searchContainer}>
        <FontAwesomeIcon
          icon={faSearch}
          size={16}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder={t('other.lookForPersone')}
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
          placeholderTextColor="#888"
        />
      </View>

      {searchText.trim() !== '' && (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          initialNumToRender={8}
          style={GlobalStyles.grow}
          contentContainerStyle={paddingHorizontal}
          data={fakeProfiles.filter(profile => {
            const search = searchText.toLowerCase().trim();
            return (
              profile.name.toLowerCase().startsWith(search) ||
              profile.surname.toLowerCase().startsWith(search)
            );
          })}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <ListItem
              title={`${item.name} ${item.surname}`}
              subtitle={item.role}
              onPress={() => {
                setSelectedProfile(item);
                navigation.navigate('Contatto');
              }}
              leadingItem={<FontAwesomeIcon icon={faPerson} size={20} />}
            />
          )}
          ListFooterComponent={<BottomBarSpacer />}
          ItemSeparatorComponent={() => <IndentedDivider />}
          ListEmptyComponent={() => (
            <EmptyState icon={faInbox} message={t('other.noPersona')} />
          )}
        />
      )}

      {fakeProfiles.some(p => p.preferred) && (
        <>
          <View style={{ marginTop: spacing[4] }} />
          <SectionHeader title={t('other.preferred')} />
          <FlatList
            data={fakeProfiles.filter(p => p.preferred)}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={paddingHorizontal}
            ItemSeparatorComponent={() => <IndentedDivider />}
            renderItem={({ item }) => (
              <ListItem
                title={`${item.name} ${item.surname}`}
                subtitle={item.role}
                onPress={() => {
                  setSelectedProfile(item);
                  navigation.navigate('Contatto');
                }}
                leadingItem={<FontAwesomeIcon icon={faPerson} size={20} />}
              />
            )}
            ListFooterComponent={<BottomBarSpacer />}
          />
        </>
      )}
    </ScrollView>
  );
};

const createStyles = ({ palettes, spacing }: Theme) =>
  StyleSheet.create({
    heading: {
      paddingTop: spacing[5],
      paddingHorizontal: spacing[2],
    },
    smartcardImage: {
      width: '100%',
      height: 200,
      marginVertical: spacing[3],
      alignSelf: 'center',
    },
    grid: {
      margin: spacing[5],
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palettes.gray[200],
      borderRadius: 12,
      borderWidth: 1,
      borderColor: palettes.gray[300],
      paddingHorizontal: 12,
      marginBottom: 12,
      marginTop: 12,
      marginHorizontal: 12,
      height: 40,
    },
    searchIcon: {
      marginRight: 8,
    },
    basicIcon: {
      marginRight: 8,
      marginTop: 4,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: palettes.gray[800],
      paddingVertical: 8,
      height: 50,
      textAlignVertical: 'center',
    },
  });
