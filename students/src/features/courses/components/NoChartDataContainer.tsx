import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { faChartSimple } from '@fortawesome/free-solid-svg-icons';
import { Icon } from '@polito/lib';
import { useStylesheet } from '@polito/lib';
import { useTheme } from '@polito/lib';
import type { Theme } from '@polito/lib';

export const NoChartDataContainer = ({
  hasData,
  children,
}: {
  hasData: boolean;
  children: React.ReactNode;
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  if (hasData) return <View>{children}</View>;

  return (
    <View style={styles.view}>
      <View style={styles.container}>
        <Icon icon={faChartSimple} size={52} color={colors.tabBarInactive} />
        <Text style={styles.title}>{t('courseStatisticsScreen.noData')}</Text>
      </View>

      {children}
    </View>
  );
};

const createStyles = ({ colors, fontSizes, fontWeights }: Theme) =>
  StyleSheet.create({
    view: {
      position: 'relative',
    },
    title: {
      color: colors.tabBarInactive,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
    },
    container: {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      top: 0,
      zIndex: 1,
      alignSelf: 'center',
      height: '100%',
    },
  });
