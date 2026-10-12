import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import {
  faChevronDown,
  faChevronUp,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import {
  Icon,
  IconButton,
  StatefulMenuView,
  TextButton,
  useTheme,
} from '@polito/lib/ui';
import { MenuAction } from '@react-native-menu/menu';

export interface CourseFilesMenuItem {
  id: string;
  title: string;
  onPress: () => void;
  checked?: boolean;
}

interface Props {
  sortLabel: string;
  sortItems: CourseFilesMenuItem[];
  moreItems: CourseFilesMenuItem[];
}

const toActions = (items: CourseFilesMenuItem[]): MenuAction[] =>
  items.map(({ id, title, checked }) => ({
    id,
    title,
    ...(checked !== undefined && { state: checked ? 'on' : 'off' }),
  }));

export const CourseFilesMenu = ({ sortLabel, sortItems, moreItems }: Props) => {
  const { palettes, fontSizes, spacing } = useTheme();
  const { t } = useTranslation();
  const [isSortOpen, setSortOpen] = useState(false);
  const sortActions = useMemo(() => toActions(sortItems), [sortItems]);
  const moreActions = useMemo(() => toActions(moreItems), [moreItems]);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
      }}
    >
      <StatefulMenuView
        actions={sortActions}
        onPressAction={e =>
          sortItems.find(i => i.id === e.nativeEvent.event)?.onPress()
        }
        onOpenMenu={() => setSortOpen(true)}
        onCloseMenu={() => setSortOpen(false)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextButton>{sortLabel}</TextButton>
          <Icon
            icon={isSortOpen ? faChevronUp : faChevronDown}
            size={fontSizes.md}
            color={palettes.primary[400]}
            style={{ marginLeft: spacing[1] }}
          />
        </View>
      </StatefulMenuView>

      <StatefulMenuView
        actions={moreActions}
        onPressAction={e =>
          moreItems.find(i => i.id === e.nativeEvent.event)?.onPress()
        }
      >
        <IconButton
          icon={faEllipsisVertical}
          color={palettes.primary[400]}
          size={fontSizes.lg}
          adjustSpacing="right"
          accessibilityLabel={t('common.options', { defaultValue: 'Options' })}
        />
      </StatefulMenuView>
    </View>
  );
};
