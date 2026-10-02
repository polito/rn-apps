import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import { useTheme, useTitlesStyles } from '@polito/lib/ui';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  AddStudentsScreen,
  CourseStudentsTab,
  EmailComposeScreen,
  NotifyComposeScreen,
  SelectContactMethodScreen,
  SelectStudentsScreen,
  SpecialNeedsScreen,
  StudentContact,
} from '../screens';
import { StudentsStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<StudentsStackParamList>();

/** Students feature navigator hosting all student-related screens. */
export const StudentsNavigator = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const titleStyles = useTitlesStyles(theme);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerLargeTitle: false,
        headerTransparent: false,
        headerBackButtonDisplayMode: 'minimal',
        ...titleStyles,
      }}
    >
      <Stack.Screen name="CourseStudentsScreen" component={CourseStudentsTab} />
      <Stack.Screen
        name="StudentContact"
        component={StudentContact}
        options={{
          title: t('other.student'),
          headerShown: true,
          presentation: 'card',
          animation: 'slide_from_right',
          fullScreenGestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="AddStudents"
        component={AddStudentsScreen}
        options={{
          title: t('other.addStudent'),
          headerShown: true,
          presentation: Platform.OS === 'android' ? 'card' : 'modal',
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
        }}
      />
      <Stack.Screen
        name="SelectStudents"
        component={SelectStudentsScreen}
        options={{
          title: t('other.selectStudents'),
          headerShown: true,
          presentation: Platform.OS === 'android' ? 'card' : 'modal',
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
        }}
      />
      <Stack.Screen
        name="SelectContactMethod"
        component={SelectContactMethodScreen}
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EmailCompose"
        component={EmailComposeScreen}
        options={{
          title: t('other.newEmail'),
          headerShown: true,
          presentation: Platform.OS === 'android' ? 'card' : 'modal',
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
        }}
      />
      <Stack.Screen
        name="NotifyCompose"
        component={NotifyComposeScreen}
        options={{
          title: t('other.newNotify'),
          headerShown: true,
          presentation: Platform.OS === 'android' ? 'card' : 'modal',
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
        }}
      />
      <Stack.Screen
        name="SpecialNeeds"
        component={SpecialNeedsScreen}
        options={{
          title: t('other.specialNeedsTitle'),
          headerShown: true,
          presentation: Platform.OS === 'android' ? 'card' : 'modal',
          animation: Platform.OS === 'android' ? 'slide_from_right' : 'default',
        }}
      />
    </Stack.Navigator>
  );
};
