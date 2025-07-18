import {
    ActivityIndicatorProps,
    ActivityIndicator as RNActivityIndicator,
  } from 'react-native';
  
  import { useTheme } from '../../ui/hooks/useTheme';
  
  import { IS_ANDROID } from '../../core/components/costant';
import React from 'react';
  
export const ActivityIndicator = (props: ActivityIndicatorProps) => {
  const { palettes } = useTheme();

  return (
    <RNActivityIndicator
      color={IS_ANDROID ? palettes.secondary[600] : undefined}
      {...props}
    />
  );
};