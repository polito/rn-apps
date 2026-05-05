import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

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
}

export const CourseFilesList = ({ files }: Props) => {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { borderRadius: spacing[3], backgroundColor: colors.surface },
      ]}
    >
      <View
        style={[
          styles.listContent,
          { paddingLeft: spacing[4], paddingRight: spacing[5] },
        ]}
      >
        {files.map((file, index) => (
          <View key={file.id} style={styles.itemContainer}>
            <ManagedFileListItem
              name={file.name}
              subtitle={file.subtitle}
              status={file.status}
              onPress={file.onPress}
              isFolder={file.isFolder}
              onLongPress={file.onLongPress}
              onActionPress={file.trailing ? undefined : file.onActionPress}
              trailing={file.trailing}
            />
            {index < files.length - 1 && (
              <IndentedDivider
                style={[styles.fileDivider, { marginRight: -spacing[5] }]}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  listContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  itemContainer: {
    alignSelf: 'stretch',
  },
  fileDivider: {
    alignSelf: 'stretch',
  },
});
