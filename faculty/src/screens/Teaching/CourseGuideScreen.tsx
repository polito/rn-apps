import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Text, Theme, useStylesheet } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { TeachingStackParamList } from './TeachingNavigator';

export const CourseGuideScreen = () => {
  const { t } = useTranslation();
  const { selectedCourse } = useCourses();
  const styles = useStylesheet(createStyles);
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('courseGuideScreen.title'),
    });
  }, [navigation, t]);
  return (
    <View style={styles.sectionsContainer}>
      <Text style={{ marginLeft: 100 }}>{selectedCourse?.guide}</Text>
    </View>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    loader: {
      marginVertical: spacing[8],
    },
    sectionsContainer: {
      paddingVertical: spacing[5],
    },
  });
