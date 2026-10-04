import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import { useTheme, useTitlesStyles } from '@polito/lib/ui';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AddStudentsModalContent } from '../screens/AddStudentsModalContent';
import { CourseStudentsTab } from '../screens/CourseStudentsTab';
import { EmailComposeScreen } from '../screens/EmailComposeScreen';
import { NotifyComposeScreen } from '../screens/NotifyComposeScreen';
import { SelectContactMethodScreen } from '../screens/SelectContactMethodScreen';
import { SelectStudentsModalContent } from '../screens/SelectStudentsModalContent';
import { SpecialNeedsScreen } from '../screens/SpecialNeedsScreen';
import { StudentContact } from '../screens/StudentContact';

export type StudentsStackParamList = {
  CourseStudentsScreen: undefined;
  StudentContact: undefined;
  AddStudents: undefined;
  SelectStudents: { initialSelectAll?: boolean } | undefined;
  SelectContactMethod: { selectedIds: string[] };
  EmailCompose: { selectedIds: string[] };
  NotifyCompose: { selectedIds: string[] };
  SpecialNeeds: undefined;
};

const Stack = createNativeStackNavigator<StudentsStackParamList>();

const modalScreenOptions = {
  headerLargeTitle: false,
  presentation: 'modal' as const,
  ...(Platform.OS === 'ios' ? { sheetGrabberVisible: true } : {}),
};

export const StudentsNavigator = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Stack.Navigator
      screenOptions={{
        headerLargeTitle: false,
        headerTransparent: Platform.select({ ios: true }),
        headerLargeStyle: {
          backgroundColor: colors.background,
        },
        headerBlurEffect: 'systemUltraThinMaterial',
        ...useTitlesStyles(theme),
      }}
    >
      <Stack.Screen
        name="CourseStudentsScreen"
        component={CourseStudentsTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StudentContact"
        component={StudentContact}
        options={{
          headerTitle: t('other.student'),
          headerLargeTitle: false,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen
        name="AddStudents"
        component={AddStudentsModalContent}
        options={{
          ...modalScreenOptions,
          headerTitle: t('other.addStudent'),
        }}
      />
      <Stack.Screen
        name="SelectStudents"
        component={SelectStudentsModalContent}
        options={{
          ...modalScreenOptions,
          headerTitle: t('other.selectStudents'),
        }}
      />
      <Stack.Screen
        name="SelectContactMethod"
        component={SelectContactMethodScreen}
        options={{
          headerShown: false,
          presentation: 'transparentModal',
          animation: 'fade',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="EmailCompose"
        component={EmailComposeScreen}
        options={{
          ...modalScreenOptions,
          headerTitle: t('other.newEmail'),
        }}
      />
      <Stack.Screen
        name="NotifyCompose"
        component={NotifyComposeScreen}
        options={{
          ...modalScreenOptions,
          headerTitle: t('other.newNotify'),
        }}
      />
      <Stack.Screen
        name="SpecialNeeds"
        component={SpecialNeedsScreen}
        options={{
          ...modalScreenOptions,
          headerTitle: t('other.specialNeedsTitle'),
        }}
      />
    </Stack.Navigator>
  );
};
