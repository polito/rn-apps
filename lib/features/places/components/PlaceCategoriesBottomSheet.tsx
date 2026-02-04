import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';

import { faFrown, faMapLocation } from '@fortawesome/free-solid-svg-icons';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { EmptyState, Icon } from '../../../ui/components';
import { useTheme } from '../../../ui/hooks/useTheme';
import { useGetPlaceCategories } from '../queries/placesHooks';
import { formatPlaceCategory } from '../utils/category';
import { PlacesBottomSheet, PlacesBottomSheetProps } from './PlacesBottomSheet';
import { PlacesStackParamList } from './PlacesNavigator';

export const PlaceCategoriesBottomSheet = (props: PlacesBottomSheetProps) => {
  const navigation =
    useNavigation<NavigationProp<PlacesStackParamList, 'Places'>>();
  const { t } = useTranslation();
  const { fontSizes } = useTheme();
  const sheetRef = useRef<BottomSheetMethods>(null);
  const { data: categories, isLoading } = useGetPlaceCategories();
  const [search, setSearch] = useState('');

  return (
    <PlacesBottomSheet
      ref={sheetRef}
      enablePanDownToClose={true}
      snapPoints={['100%']}
      textFieldProps={{
        label: t('placesScreen.searchCategories'),
        onBlur: undefined,
      }}
      search={search}
      onSearchChange={setSearch}
      onSearchClear={() => setSearch('')}
      isLoading={isLoading}
      listProps={{
        data: categories?.data
          .flatMap(
            c =>
              c.subCategories?.map(sc => ({
                ...sc,
                parent: formatPlaceCategory(c.name),
              })) ?? [],
          )
          .filter(
            sc =>
              !search || sc.name.toLowerCase().includes(search.toLowerCase()),
          )
          .map(sc => ({
            title: sc.name,
            subtitle: sc.parent,
            isAction: true,
            leadingItem: sc.markerUrl ? (
              <Image source={{ uri: sc.markerUrl }} width={30} height={30} />
            ) : (
              <Icon icon={faMapLocation} size={fontSizes['2xl']} />
            ),
            onPress: () => {
              sheetRef.current?.close();
              navigation.navigate('Places', {
                subCategoryId: sc.id,
              });
            },
          })),
        ListEmptyComponent: (
          <EmptyState
            message={t('placesScreen.noCategoriesFound')}
            icon={faFrown}
          />
        ),
      }}
      {...props}
    />
  );
};
