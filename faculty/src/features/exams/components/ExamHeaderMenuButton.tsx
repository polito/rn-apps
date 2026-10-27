import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import {
  Icon,
  StatefulMenuView,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { MenuAction } from '@react-native-menu/menu';

type Props = {
  actions: MenuAction[];
  onPressAction: (actionId: string) => void;
};

export const ExamHeaderMenuButton = ({ actions, onPressAction }: Props) => {
  const { t } = useTranslation();
  const { palettes, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);

  return (
    <StatefulMenuView
      actions={actions}
      onPressAction={({ nativeEvent }) => onPressAction(nativeEvent.event)}
    >
      <View
        style={styles.trigger}
        accessible
        accessibilityRole="button"
        accessibilityLabel={t('common.options')}
      >
        <View style={styles.circle}>
          <Icon
            icon={faEllipsis}
            size={fontSizes.sm}
            color={palettes.primary[500]}
          />
        </View>
      </View>
    </StatefulMenuView>
  );
};

const createStyles = ({ palettes, spacing }: Theme) =>
  StyleSheet.create({
    trigger: {
      padding: spacing[1.5],
      marginRight: -spacing[1.5],
    },
    circle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: palettes.primary[500],
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
