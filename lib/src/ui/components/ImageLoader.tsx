import { useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import {
  Image,
  type ImageContentFit,
  type ImageProps,
  type ImageStyle,
} from 'expo-image';

import { ActivityIndicator } from './ActivityIndicator';

type Props = Omit<
  ImageProps,
  'style' | 'source' | 'contentFit' | 'onLoadStart' | 'onLoadEnd' | 'onLoad'
> & {
  containerStyle?: StyleProp<ViewStyle>;
  source: { uri: string };
  resizeMode: ImageContentFit;
  imageStyle?: StyleProp<ImageStyle>;
  onLoad?: ImageProps['onLoad'];
  onLoadStart?: ImageProps['onLoadStart'];
  onLoadEnd?: ImageProps['onLoadEnd'];
};

export const ImageLoader = ({
  resizeMode,
  imageStyle,
  containerStyle,
  source,
  onLoadStart,
  onLoadEnd,
  onLoad,
  ...rest
}: Props) => {
  const [loading, setLoading] = useState(true);
  const [src, setSrc] = useState(source);

  return (
    <View style={containerStyle} onLayout={() => setSrc(source)}>
      <Image
        {...rest}
        source={src}
        style={imageStyle}
        contentFit={resizeMode}
        onLoadStart={() => {
          setLoading(true);
          onLoadStart?.();
        }}
        onLoad={onLoad}
        onLoadEnd={() => {
          setLoading(false);
          onLoadEnd?.();
        }}
      />
      {loading && <ActivityIndicator style={styles.activityIndicator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
