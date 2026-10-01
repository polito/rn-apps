import { ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleProp,
  StyleSheet,
  TextProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

import { Props as FAProps } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { hideFromScreenReader } from '../../core/accessibility/hideFromScreenReader';
import { IS_IOS } from '../../core/constants';
import { usePreferencesContext } from '../../core/contexts/PreferencesContext';
import { To } from '../../core/utils/resolveLinkTo';
import { useStylesheet } from '../hooks/useStylesheet';
import { Theme } from '../types/Theme';
import { IconButton } from './IconButton';
import { Separator } from './Separator';
import { Text } from './Text';

interface Props {
  title: string;
  titleStyle?: StyleProp<TextStyle>;
  subtitle?: string;
  subtitleStyle?: StyleProp<TextStyle>;
  ellipsizeTitle?: boolean;
  linkToMoreCount?: number;
  separator?: boolean;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityState?: TouchableOpacityProps['accessibilityState'];
  linkTo?: To<any>;
  trailingItem?: ReactElement;
  trailingIcon?: Pick<FAProps, 'size' | 'icon' | 'color'> &
    TouchableOpacityProps & {
      iconStyle?: FAProps['style'];
    };
}

/**
 * A section title with an optional link to a related screen
 */
export const SectionHeader = ({
  title,
  titleStyle,
  subtitle,
  subtitleStyle,
  ellipsizeTitle = true,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  linkTo,
  accessible = true,
  linkToMoreCount,
  separator = true,
  trailingItem,
  trailingIcon,
}: Props) => {
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { accessibility } = usePreferencesContext();

  const label = useMemo(
    () => accessibilityLabel ?? [title, subtitle].filter(Boolean).join(', '),
    [accessibilityLabel, title, subtitle],
  );

  const ellipsis: Partial<TextProps> = ellipsizeTitle
    ? {
        numberOfLines: 1,
        ellipsizeMode: 'tail',
      }
    : {};

  const hasInteractiveTrailing = Boolean(trailingIcon?.onPress);
  const showsCta = linkTo != null && (linkToMoreCount ?? 0) > 0;
  const hasSeparateAction =
    showsCta || hasInteractiveTrailing || trailingItem != null;
  const isAccessible = accessible;

  const navigate = () => {
    if (!linkTo) return;
    if (typeof linkTo === 'string') {
      navigation.navigate(linkTo as any);
    } else {
      navigation.navigate(linkTo.screen as any, linkTo.params);
    }
  };

  const titleContent = (
    <View style={styles.titleContainer}>
      {separator && <Separator />}

      <View style={styles.innerTitleContainer}>
        <Text
          accessible={false}
          variant="heading"
          style={[styles.title, titleStyle, styles.titleContainer]}
          {...ellipsis}
        >
          {title}
        </Text>
        {trailingIcon && !hasInteractiveTrailing && (
          <View {...hideFromScreenReader}>
            <IconButton
              {...{
                size:
                  accessibility?.fontSize && accessibility.fontSize >= 150
                    ? 40
                    : 16,
                accessibilityLabel:
                  trailingIcon.accessibilityLabel ??
                  t('sectionHeader.moreInfo', { title }),
                ...trailingIcon,
                noPadding: true,
              }}
            />
          </View>
        )}
      </View>

      {subtitle && (
        <Text
          accessible={false}
          variant="secondaryText"
          style={subtitleStyle}
          {...ellipsis}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );

  if (hasSeparateAction) {
    return (
      <View style={styles.container} accessible={false}>
        <View style={styles.innerContainer}>
          <View style={styles.titleContainer}>
            {separator && <Separator />}
            <View style={styles.innerTitleContainer}>
              <Text
                accessible={isAccessible}
                accessibilityRole="header"
                accessibilityLabel={label}
                variant="heading"
                style={[styles.title, titleStyle, styles.titleContainer]}
                {...ellipsis}
              >
                {title}
              </Text>
              {trailingIcon && (
                <IconButton
                  {...{
                    size:
                      accessibility?.fontSize && accessibility.fontSize >= 150
                        ? 40
                        : 16,
                    accessibilityLabel:
                      trailingIcon.accessibilityLabel ??
                      t('sectionHeader.moreInfo', { title }),
                    ...trailingIcon,
                    noPadding: true,
                  }}
                />
              )}
            </View>
            {subtitle && (
              <Text
                accessible={false}
                variant="secondaryText"
                style={subtitleStyle}
                {...ellipsis}
              >
                {subtitle}
              </Text>
            )}
          </View>
          {trailingItem}
          {showsCta && (
            <TouchableOpacity
              accessible
              accessibilityRole="button"
              accessibilityHint={accessibilityHint ?? t('common.tapToNavigate')}
              accessibilityState={accessibilityState}
              onPress={navigate}
            >
              <Text variant="link">
                {t('sectionHeader.cta')}
                {' ' +
                  t('sectionHeader.ctaMoreSuffix', {
                    count: linkToMoreCount,
                  })}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (linkTo) {
    return (
      <TouchableOpacity
        style={styles.container}
        accessible={isAccessible}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={accessibilityHint ?? t('common.tapToNavigate')}
        accessibilityState={accessibilityState}
        onPress={navigate}
      >
        <View
          style={styles.innerContainer}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden={IS_IOS}
        >
          {titleContent}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={styles.container}
      accessible={isAccessible}
      accessibilityRole="header"
      accessibilityLabel={label}
      accessibilityState={accessibilityState}
    >
      <View
        style={styles.innerContainer}
        importantForAccessibility={
          isAccessible ? 'no-hide-descendants' : undefined
        }
        accessibilityElementsHidden={isAccessible ? IS_IOS : undefined}
      >
        {titleContent}
        {trailingItem &&
          (isAccessible ? (
            <View {...hideFromScreenReader}>{trailingItem}</View>
          ) : (
            trailingItem
          ))}
      </View>
    </View>
  );
};

const createStyles = ({ spacing, colors }: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing[4],
    },
    innerContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    title: {
      color: colors.heading,
      marginEnd: spacing[5],
    },
    titleContainer: {
      flex: 1,
    },
    innerTitleContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      padding: 0,
      margin: 0,
    },
  });
