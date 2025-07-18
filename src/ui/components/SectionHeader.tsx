import React, { JSX } from 'react';
import { StyleSheet, useColorScheme, View, TouchableOpacity, StyleProp, TextStyle, TouchableOpacityProps, TextProps } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import { colors } from '../../core/constants/colors';
import { Separator } from './Separator';
import { useTheme } from '../hooks/useTheme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TeachingScreen } from '../../screens/Teaching/TeachingScreen';
import { EmptyScreen } from '../../screens/EmptyScreen';
import {Link} from '@react-navigation/native'
import { Text } from './Text';
import { Theme } from '../types/theme';
import { useStylesheet } from '../hooks/useStylesheet';
import { Props as FAProps } from '@fortawesome/react-native-fontawesome';
import { IconButton } from './IconButton';
import { useTranslation } from 'react-i18next';

type SectionHeaderProps = {
  title: string;
  linkTo?: string; // Nome della schermata di destinazione
  titleStyle?: StyleProp<TextStyle>;
  subtitle?: string;
  subtitleStyle?: StyleProp<TextStyle>;
  ellipsizeTitle?: boolean;
  linkToMoreCount?: number;
  separator?: boolean;
  accessible?: boolean;
  accessibilityLabel?: string | undefined;
  trailingItem?: JSX.Element;
  trailingIcon?: Pick<FAProps, 'size' | 'icon' | 'color'> &
    TouchableOpacityProps & {
      iconStyle?: FAProps['style'];
    };
  linkname?  : string;

};
const Stack = createNativeStackNavigator();

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  linkTo,
  titleStyle,
  subtitle,
  subtitleStyle,
  ellipsizeTitle = true,
  accessibilityLabel = undefined,
  accessible = true,
  linkToMoreCount,
  separator = true,
  trailingItem,
  trailingIcon,
  linkname
 }) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = useStylesheet(createStyles);
  const ellipsis: Partial<TextProps> = ellipsizeTitle
  ? {
      numberOfLines: 1,
      ellipsizeMode: 'tail',
    }
  : {};
  const { t } = useTranslation();


  const Header = () => {
    return (
      <View style={{ ...styles.innerContainer }}>
        <View style={styles.titleContainer}>
          {separator && <Separator />}

          <View style={{ ...styles.innerTitleContainer }}>
            <Text
              accessible={false}
              variant="heading"
              style={[styles.title, titleStyle, styles.titleContainer]}
              accessibilityRole="header"
              {...ellipsis}
            >
              {title}
            </Text>
            {trailingIcon && (
              <IconButton {...{ size: 16, ...trailingIcon, noPadding: true }} />
            )}
          </View>

          {subtitle && (
            <Text
              accessible={false}
              variant="secondaryText"
              style={subtitleStyle}
              accessibilityRole="header"
              {...ellipsis}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {trailingItem && trailingItem}

        {linkTo && (
          <TouchableOpacity onPress={() => navigation.navigate(linkTo)} accessible={true} accessibilityRole="button">
            <Text variant="link">
            {linkname ? linkname : t('other.showMore')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };


  if (!linkTo) {
    return (
      <View
        style={styles.container}
        accessible={accessible}
        accessibilityRole={linkTo ? 'button' : 'header'}
        accessibilityLabel={accessibilityLabel}
      >
        <Header />
      </View>
    );
  }

  return (
          <TouchableOpacity
        style={styles.container}
        accessible={accessible}
        accessibilityRole={linkTo ? 'button' : 'header'}
        accessibilityLabel={accessibilityLabel}
        onPress={() => {
          if (linkTo) {
            if (typeof linkTo === 'string') {
              navigation.navigate(linkTo);
            } else {
              navigation.navigate(linkTo.screen, linkTo.params);
            }
          }
        }}
      >
        <Header />
      </TouchableOpacity>
  );
};



const createStyles = ({ spacing, colors }: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing[4] , 
    },
    innerContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    title: {
      color: colors.heading,
      marginEnd: spacing[5] ,
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