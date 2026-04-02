import { ReactElement } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableHighlightProps,
  View,
  ViewStyle,
} from 'react-native';

import { faFolder } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { useStylesheet } from '../hooks/useStylesheet';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../types/Theme';
import { Icon } from './Icon';
import { ListItem } from './ListItem';

interface Props {
  title: string | ReactElement;
  subtitle?: string | ReactElement;
  trailingItem?: ReactElement;
  isDownloaded?: boolean;
  unread?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

export const DirectoryListItem = ({
  isDownloaded = false,
  unread = false,
  ...props
}: TouchableHighlightProps & Props) => {
  const { palettes } = useTheme();
  const styles = useStylesheet(createItemStyles);

  return (
    <ListItem
      leadingItem={
        <View>
          <Icon icon={faFolder} size={24} color={palettes.secondary[500]} />
          {isDownloaded && (
            <View style={styles.downloadedIconContainer}>
              <Icon
                icon={faCheckCircle}
                size={12}
                color={palettes.success[600]}
              />
            </View>
          )}
        </View>
      }
      isAction
      unread={unread}
      {...props}
    />
  );
};

const createItemStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    downloadedIconContainer: {
      padding: 2,
      borderRadius: 16,
      backgroundColor: colors.background,
      position: 'absolute',
      top: -5,
      left: -8,
    },
  });
