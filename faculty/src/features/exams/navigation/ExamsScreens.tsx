import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, Theme, useStylesheet } from '@polito/lib/ui';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import { ExamAddStudentsScreen } from '../screens/ExamAddStudentsScreen';
import { ExamAttendanceScreen } from '../screens/ExamAttendanceScreen';
import { ExamEnrolledStudentsScreen } from '../screens/ExamEnrolledStudentsScreen';
import { ExamScreen } from '../screens/ExamScreen';
import { ExamSelectStudentsScreen } from '../screens/ExamSelectStudentsScreen';
import { ExamsScreen } from '../screens/ExamsScreen';

export type ExamsStackParamList = {
  Exams: undefined;
  Exam: { id: number };
  ExamAttendance: { id: number };
  ExamEnrolledStudents: { id: number };
  ExamSelectStudents: { id: number };
  ExamAddStudents: { id: number };
};

const Stack = createNativeStackNavigator<ExamsStackParamList>();

const HeaderCloseTextButton = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ExamsStackParamList>;
}) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  return (
    <TouchableOpacity
      onPress={navigation.goBack}
      accessibilityRole="button"
      style={styles.closeButton}
    >
      <Text style={styles.closeText}>{t('common.close')}</Text>
    </TouchableOpacity>
  );
};

const createStyles = ({ colors, fontSizes, spacing }: Theme) =>
  StyleSheet.create({
    closeButton: {
      padding: spacing[2],
      marginLeft: -spacing[2],
    },
    closeText: {
      color: colors.secondaryText,
      fontSize: fontSizes.md,
    },
  });

const sheetOptions = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ExamsStackParamList>;
}): NativeStackNavigationOptions => ({
  presentation: 'modal',
  headerLargeTitle: false,
  headerTransparent: false,
  headerLeft: () => <HeaderCloseTextButton navigation={navigation} />,
  ...(Platform.OS === 'ios' ? { sheetGrabberVisible: true } : {}),
});

export const ExamsScreens = () => {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        name="Exams"
        component={ExamsScreen}
        options={{
          headerTitle: t('examsScreen.title'),
        }}
      />
      <Stack.Screen
        name="Exam"
        component={ExamScreen}
        getId={({ params }) => `${params.id}`}
        options={{
          headerLargeTitle: false,
          headerTitle: t('examsScreen.title'),
        }}
      />
      <Stack.Screen
        name="ExamAttendance"
        component={ExamAttendanceScreen}
        options={({ navigation }) => ({
          ...sheetOptions({ navigation }),
          headerTitle: t('examAttendanceScreen.title'),
        })}
      />
      <Stack.Screen
        name="ExamEnrolledStudents"
        component={ExamEnrolledStudentsScreen}
        options={{
          headerLargeTitle: false,
          headerTransparent: false,
          headerTitle: t('examEnrolledStudentsScreen.title'),
        }}
      />
      <Stack.Screen
        name="ExamSelectStudents"
        component={ExamSelectStudentsScreen}
        options={({ navigation }) => sheetOptions({ navigation })}
      />
      <Stack.Screen
        name="ExamAddStudents"
        component={ExamAddStudentsScreen}
        options={({ navigation }) => ({
          ...sheetOptions({ navigation }),
          headerTitle: t('examAddStudentsScreen.title'),
        })}
      />
    </>
  );
};
