import { ScrollView, StyleSheet, View } from 'react-native';
import { useCourses } from '../../core/contexts/CoursesContext';
import React, { useLayoutEffect } from 'react';
import { Theme } from '../../ui/types/theme';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { useCollapsingHeader } from '../../core/hooks/useCollapsingHeader';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from '../../ui/components/IconButton';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Text } from '../../ui/components/Text';
import { SectionHeader } from '../../ui/components/SectionHeader';
import { spread } from 'lodash';




export const CourseGuideScreen =  ()  => {
  const { selectedCourse } = useCourses();
  const styles = useStylesheet(createStyles);
  const { scrollViewProps } = useCollapsingHeader();
 const {selectedExam} = useCourses();
  const { setOptions } = useNavigation();
  const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
        headerLeft: () => (
                <IconButton icon={faArrowLeft}  size={22} onPress={() => navigation.navigate('Course')} />
              ),
            headerTitle: () => (
                <Text variant="heading" style={{ textAlign: 'center', width: '100%', marginLeft : -25 }}>
                  Guida del corso
                    </Text>
            ),
            
        });
    }, [navigation]);
  return (
          <View style={styles.sectionsContainer} >
            <Text style={{marginLeft : 100}}>{selectedCourse?.guide}</Text>
          </View>

  );
};



const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    loader: {
      marginVertical: spacing[8] ,
    },
    sectionsContainer: {
      paddingVertical: spacing[5] ,
    },
  });