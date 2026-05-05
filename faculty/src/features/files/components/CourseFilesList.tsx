import type { ReactNode } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import {
  FileDownloadStatus,
  IndentedDivider,
  ManagedFileListItem,
  useTheme,
} from '@polito/lib/ui';

export interface CourseFileEntry {
  id: string;
  name: string;
  subtitle?: string;
  status: FileDownloadStatus;
  onPress: () => void;
  isFolder?: boolean;
  onLongPress?: () => void;
  onActionPress?: () => void;
  /** When set, replaces the download/sync trailing control (e.g. multi-select checkbox). */
  trailing?: ReactNode;
}

interface Props {
  files: CourseFileEntry[];
  fillHeight?: boolean;
}

export const CourseFilesList = ({ files, fillHeight = false }: Props) => {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.card,
        fillHeight ? styles.cardFill : null,
        { borderRadius: spacing[3], backgroundColor: colors.surface },
      ]}
    >
      <FlatList
        style={fillHeight ? styles.flatListFill : null}
        contentContainerStyle={[
          styles.listContent,
          { paddingLeft: spacing[4], paddingRight: spacing[5] },
        ]}
        data={files}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <ManagedFileListItem
              name={item.name}
              subtitle={item.subtitle}
              status={item.status}
              onPress={item.onPress}
              isFolder={item.isFolder}
              onLongPress={item.onLongPress}
              onActionPress={item.trailing ? undefined : item.onActionPress}
              trailing={item.trailing}
            />
            {index < files.length - 1 ? (
              <IndentedDivider
                style={[styles.fileDivider, { marginRight: -spacing[5] }]}
              />
            ) : null}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  cardFill: {
    flex: 1,
  },
  flatListFill: {
    flex: 1,
  },
  listContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    width: '100%',
  },
  itemContainer: {
    alignSelf: 'stretch',
  },
  fileDivider: {
    alignSelf: 'stretch',
  },
});
