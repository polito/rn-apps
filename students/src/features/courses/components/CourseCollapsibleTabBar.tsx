import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { Col, Row, Text, TopTabBar, useTheme } from '@polito/lib/ui';
import { useHeaderHeight } from '@react-navigation/elements';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';

import {
  COURSE_EXPANDED_HEADER_HEIGHT,
  IS_IOS_LIQUID_GLASS,
  useCourseCollapsingHeader,
} from '../contexts/CourseCollapsingHeaderContext';
import { CourseIndicator } from './CourseIndicator';

export const CourseCollapsibleTabBar = (props: MaterialTopTabBarProps) => {
  const { spacing, colors } = useTheme();
  const headerHeight = useHeaderHeight();
  const nativeHeaderTop = IS_IOS_LIQUID_GLASS ? headerHeight : 0;
  const {
    scrollY,
    tabBarHeightSV,
    setTabBarHeight,
    courseTitle,
    courseSubtitle,
    uniqueShortcode,
  } = useCourseCollapsingHeader();

  const shellStyle = useAnimatedStyle(() => {
    const collapsed = Math.max(
      0,
      Math.min(scrollY.value, COURSE_EXPANDED_HEADER_HEIGHT),
    );
    const expandedVisible = Math.max(
      0,
      COURSE_EXPANDED_HEADER_HEIGHT - collapsed,
    );
    return {
      height: expandedVisible + tabBarHeightSV.value,
    };
  });

  const expandedStyle = useAnimatedStyle(() => {
    const collapsed = Math.max(
      0,
      Math.min(scrollY.value, COURSE_EXPANDED_HEADER_HEIGHT),
    );
    const h = Math.max(0, COURSE_EXPANDED_HEADER_HEIGHT - collapsed);
    const opacity = interpolate(
      collapsed,
      [0, COURSE_EXPANDED_HEADER_HEIGHT * 0.55, COURSE_EXPANDED_HEADER_HEIGHT],
      [1, 0.45, 0],
      Extrapolation.CLAMP,
    );
    return {
      height: h,
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { top: nativeHeaderTop },
        IS_IOS_LIQUID_GLASS
          ? { backgroundColor: `${colors.black}00` }
          : {
              backgroundColor: Platform.select({
                ios: colors.headersBackground,
                android: colors.surface,
              }),
            },
        shellStyle,
      ]}
    >
      <Animated.View
        style={[
          expandedStyle,
          { paddingHorizontal: spacing[4], justifyContent: 'center' },
        ]}
      >
        <Row align="center" gap={3}>
          <CourseIndicator uniqueShortcode={uniqueShortcode} />
          <Col style={styles.titleCol}>
            <Text variant="title" style={styles.largeTitle} numberOfLines={2}>
              {courseTitle}
            </Text>
            {courseSubtitle ? (
              <Text variant="caption" numberOfLines={1}>
                {courseSubtitle}
              </Text>
            ) : null}
          </Col>
        </Row>
      </Animated.View>
      <View
        onLayout={e => {
          const h = e.nativeEvent.layout.height;
          if (h > 0) {
            setTabBarHeight(h);
          }
        }}
      >
        <TopTabBar
          {...props}
          containerStyle={
            IS_IOS_LIQUID_GLASS
              ? { backgroundColor: `${colors.black}00` }
              : undefined
          }
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 10,
    elevation: 6,
  },
  titleCol: {
    flex: 1,
    minWidth: 0,
  },
  largeTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
});
