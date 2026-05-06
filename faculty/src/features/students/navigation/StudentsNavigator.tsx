import { Platform } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  AddStudentsScreen,
  CourseStudentsTab,
  SelectStudentsScreen,
  SpecialNeedsScreen,
  StudentContact,
  StudentExamsScreen,
} from '../screens';
import { StudentsStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<StudentsStackParamList>();

/** Students feature navigator hosting all student-related screens. */
export const StudentsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CourseStudentsScreen" component={CourseStudentsTab} />
      <Stack.Screen
        name="StudentContact"
        component={StudentContact}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
          fullScreenGestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="AddStudents"
        component={AddStudentsScreen}
        options={{
          presentation: Platform.OS === 'android' ? 'card' : 'modal',
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
        }}
      />
      <Stack.Screen
        name="SelectStudents"
        component={SelectStudentsScreen}
        options={{
          presentation: Platform.OS === 'android' ? 'card' : 'modal',
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
        }}
      />
      <Stack.Screen
        name="SpecialNeeds"
        component={SpecialNeedsScreen}
        options={{
          presentation: Platform.OS === 'android' ? 'card' : 'modal',
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
        }}
      />
      <Stack.Screen
        name="StudentExams"
        component={StudentExamsScreen}
        options={{
          presentation: Platform.OS === 'android' ? 'card' : 'modal',
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
        }}
      />
    </Stack.Navigator>
  );
};
