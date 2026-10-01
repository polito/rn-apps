import { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import {
  DisclosureIndicator,
  ListItem,
  Row,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Tag } from '~/core/components/Tag';

import Color from 'color';

import { useCourses } from '../../core/contexts/CoursesContext';
import { CourseIndicator } from '../../screens/Teaching/CourseIndicator';
import { TeachingStackParamList } from './TeachingNavigator';

interface Props {
  course: any;
  accessible?: boolean;
  accessibilityLabel?: string;
  badge?: number;
  showAllModules?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

/**
 * A list item with support for a title, subtitle, leading and trailing
 * elements. If a linkTo is provided, a forward icon is automatically
 * displayed as a trailing element on iOS.
 */
export const CourseListItem = ({
  course,
  accessible,
  disabled,
  onPress,
}: Props) => {
  const styles = useStylesheet(createStyles);
  const { dark, palettes } = useTheme();
  const { setSelectedCourse } = useCourses();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

  const isOwner = useCallback(() => {
    // Placeholder logic for determining if the user is the owner
    return 'Owner';
  }, []);

  const tagColors = useMemo(
    () => ({
      background: Color(palettes.primary[dark ? 600 : 50])
        .alpha(0.4)
        .toString(),
      text: dark ? palettes.primary[400] : palettes.primary[500],
    }),
    [dark, palettes],
  );

  const subtitle = useMemo(() => {
    return (
      <Row style={styles.subtitle} pt={1}>
        <Tag
          text={isOwner()}
          backgroundColor={tagColors.background}
          foregroundColor={tagColors.text}
        />
        <Text style={styles.subtitleText} numberOfLines={1}>
          {course.code}
        </Text>
      </Row>
    );
  }, [styles, course.code, isOwner, tagColors]);

  return (
    <ListItem
      /*

        ***** THIS SHOULD BE THE WAY TO NAVIGATE INSTEAD OF USING onPress AS DONE FOR STUDENTS APP ******
        ** maintain onPress for now to keep existing behavior **
        
        linkTo={{
          screen: 'Course',
          params: {
            id: course.id,
          },
        }}
        */

      accessible={accessible}
      title={course.title}
      subtitle={subtitle}
      leadingItem={
        <CourseIndicator
          uniqueShortcode={course.uniqueShortcode ?? course.code}
        />
      }
      trailingItem={<DisclosureIndicator />}
      disabled={disabled}
      onPress={
        onPress ??
        (() => {
          setSelectedCourse(course);
          navigation.navigate('Course', { from: 'MyCourses' });
        })
      }
    />
  );
};

const createStyles = ({ spacing, palettes, fontSizes }: Theme) =>
  StyleSheet.create({
    subtitle: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing[2],
      alignSelf: 'stretch',
    },
    subtitleText: {
      color: palettes.gray[500],
      fontSize: fontSizes.sm,
    },
  });
