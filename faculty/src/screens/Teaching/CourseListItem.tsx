import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  DisclosureIndicator,
  ListItem,
  Row,
  Text,
  Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Tag } from '~/core/components/Tag';

import { useCourses } from '../../core/contexts/CoursesContext';
import { CourseIndicator } from '../../screens/Teaching/CourseIndicator';
import { TeachingStackParamList } from './TeachingNavigator';

interface Props {
  course: any;
  accessible?: boolean;
  accessibilityLabel?: string;
  badge?: number;
  showAllModules?: boolean;
}

/**
 * A list item with support for a title, subtitle, leading and trailing
 * elements. If a linkTo is provided, a forward icon is automatically
 * displayed as a trailing element on iOS.
 */
export const CourseListItem = ({ course, accessible }: Props) => {
  const styles = useStylesheet(createStyles);
  const { setSelectedCourse } = useCourses();
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();

  const isOwner = useCallback(() => {
    // Placeholder logic for determining if the user is the owner
    return 'Owner';
  }, []);

  const subtitle = useMemo(() => {
    return (
      <Row style={styles.subtitle}>
        <Tag
          text={isOwner()}
          backgroundColor={styles.tag.backgroundColor}
          foregroundColor={styles.tag.color}
        />
        <Text style={styles.subtitleText} numberOfLines={1}>
          {course.code}
        </Text>
      </Row>
    );
  }, [styles, course.code, isOwner]);

  const listItem = (
    <View>
      <ListItem
        key={course.code}
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
        leadingItem={<CourseIndicator />}
        trailingItem={<DisclosureIndicator />}
        onPress={() => {
          setSelectedCourse(course);
          navigation.navigate('Course', { from: 'MyCourses' });
        }}
      />
    </View>
  );

  return listItem;
};

const createStyles = ({ spacing, palettes, fontSizes }: Theme) =>
  StyleSheet.create({
    tag: {
      backgroundColor: palettes.info[50],
      color: palettes.info[600],
    },
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
