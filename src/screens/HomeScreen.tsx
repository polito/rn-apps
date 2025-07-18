import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SectionHeader } from '../ui/components/SectionHeader';

export const HomeScreen = () => {
  return (
    <View>
      <View style={styles.sectionsContainer}>
        <View style={styles.section}>
          <SectionHeader title="Corsi" linkTo="Courses" />
          <Text>Lorem ipsum dolor sit amet</Text>
        </View>
        <View style={styles.section}>
          <SectionHeader title="Appelli" linkTo="Exams" />
          <Text>Lorem ipsum dolor sit amet</Text>
        </View>
        <View style={styles.section}>
          <SectionHeader title="Libretto" linkTo="Grades" />
          <Text>Lorem ipsum dolor sit amet</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionsContainer: {
    display: 'flex',
    paddingVertical: 18,
  },
  section: {
    marginBottom: 24,
  },
});