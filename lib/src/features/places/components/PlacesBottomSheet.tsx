import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import { faMapPin } from '@fortawesome/free-solid-svg-icons';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { BottomSheetFlatListProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

import {
  ActivityIndicator,
  BottomSheet,
  BottomSheetProps,
  BottomSheetTextField,
  Icon,
  IndentedDivider,
  ListItem,
  ListItemProps,
  TranslucentTextFieldProps,
} from '../../../ui/components';
import { useTheme } from '../../../ui/hooks/useTheme';

export interface PlacesBottomSheetProps extends Omit<
  BottomSheetProps,
  'children'
> {
  textFieldProps?: Partial<TranslucentTextFieldProps>;
  searchFieldLabel?: string;
  listProps?: Partial<BottomSheetFlatListProps<ListItemProps>>;
  isLoading?: boolean;
  search?: string;
  showSearchBar?: boolean;
  onSearchChange?: (newSearch: string) => void;
  onSearchClear?: () => void;
  onSearchTrigger?: () => void;
}

export const PlacesBottomSheet = forwardRef<
  BottomSheetMethods,
  PlacesBottomSheetProps
>(
  (
    {
      textFieldProps,
      listProps,
      searchFieldLabel,
      isLoading = false,
      search,
      onSearchChange,
      onSearchTrigger,
      onSearchClear,
      showSearchBar = true,
      ...props
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const { fontSizes, spacing } = useTheme();
    const innerRef = useRef<BottomSheetMethods>(null);

    useImperativeHandle(ref, () => innerRef.current!);

    const listItems = useMemo(() => listProps?.data ?? [], [listProps?.data]);
    const snapPoints = useMemo(() => {
      return [Platform.OS === 'android' ? 58 : 64, '100%'];
    }, []);
    return (
      <BottomSheet
        ref={innerRef}
        snapPoints={snapPoints}
        enableBlurKeyboardOnGesture={Platform.OS === 'ios'}
        enableAndroidKeyboardHandling={Platform.OS === 'android'}
        {...props}
      >
        {showSearchBar && (
          <BottomSheetTextField
            label={searchFieldLabel ?? t('common.search')}
            returnKeyType="search"
            accessibilityRole="search"
            onSubmitEditing={() => {
              onSearchTrigger?.();
            }}
            value={search}
            isClearable={!!search}
            onChangeText={onSearchChange}
            onClear={onSearchClear}
            {...textFieldProps}
          />
        )}
        <BottomSheetFlatList
          renderItem={({ item }: { item: ListItemProps }) => (
            <ListItem
              leadingItem={<Icon icon={faMapPin} size={fontSizes['2xl']} />}
              {...item}
              title={item.title ?? t('common.untitled')}
            />
          )}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={IndentedDivider}
          {...listProps}
          data={listItems}
          ListEmptyComponent={
            isLoading ? (
              <ActivityIndicator style={{ marginVertical: spacing[8] }} />
            ) : (
              listProps?.ListEmptyComponent
            )
          }
        />
      </BottomSheet>
    );
  },
);
