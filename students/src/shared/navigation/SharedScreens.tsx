import { useTranslation } from 'react-i18next';

import { PersonScreen, UsefulContactScreen } from '@polito/lib/features/people';
import { HeaderLogoNoProps, createHeaderCloseButton } from '@polito/lib/ui';
import { MfaChallenge, OfferingCourseStaff } from '@polito/student-api-client';
import { ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PolitoAuthenticatorScreen } from '~/features/user/screens/PolitoAuthenticatorScreen';

import { CourseStatisticsFilterType } from '../../features/courses/components/CourseStatisticsFilters.tsx';
import { CourseStatisticsScreen } from '../../features/courses/screens/CourseStatisticsScreen';
import { DegreeCourseGuideScreen } from '../../features/offering/screens/DegreeCourseGuideScreen';
import { DegreeCourseScreen } from '../../features/offering/screens/DegreeCourseScreen';
import { StaffScreen } from '../../features/offering/screens/StaffScreen';
import { ImageScreen } from '../../features/tickets/components/ImageScreen';
import { UnreadMessagesModal } from '../../features/user/screens/UnreadMessagesModal';

export interface SharedScreensParamList extends ParamListBase {
  Person: { id: number };
  UsefulContact: { id: string };
  DegreeCourse: {
    courseShortcode: string;
    year?: string;
  };
  DegreeCourseGuide: {
    courseShortcode: string;
    year?: string;
  };
  CourseStatistics: {
    courseShortcode: string;
    nameCourse?: string;
    courseId: number;
    teacherId?: string;
    year?: string;
    filter?: CourseStatisticsFilterType;
  };
  Staff: {
    courseShortcode: string;
    year?: string;
    staff: OfferingCourseStaff[];
  };
  MessagesModal: undefined;
  ImageScreen: {
    uri: string;
    width: number;
    height: number;
  };
  PolitoAuthenticator: {
    activeView: 'enroll' | 'auth';
    challenge?: MfaChallenge;
  };
}
const Stack = createNativeStackNavigator<SharedScreensParamList>();

export const SharedScreens = () => {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen
        name="Staff"
        component={StaffScreen}
        getId={({ params: { courseShortcode, year } }) =>
          courseShortcode + (year ?? '0')
        }
      />
      <Stack.Screen
        name="Person"
        getId={({ params: { id } }) => id.toString()}
        options={{
          headerLargeTitle: false,
          headerTitle: t('common.contact'),
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        {props => <PersonScreen {...props} showPreferredContacts={false} />}
      </Stack.Screen>
      <Stack.Screen
        name="UsefulContact"
        component={UsefulContactScreen}
        getId={({ params: { id } }) => id}
        options={{
          headerLargeTitle: false,
          headerTitle: '',
          headerBackTitle: t('contactsScreen.title'),
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen
        name="DegreeCourse"
        component={DegreeCourseScreen}
        getId={({ params: { courseShortcode, year } }) =>
          courseShortcode + (year ?? '0')
        }
        options={{
          headerTitle: t('degreeCourseScreen.title'),
          headerLargeTitle: false,
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen
        name="DegreeCourseGuide"
        component={DegreeCourseGuideScreen}
        getId={({ params: { courseShortcode, year } }) =>
          courseShortcode + (year ?? '0')
        }
        options={{
          headerTitle: t('courseGuideScreen.title'),
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen
        name="CourseStatistics"
        component={CourseStatisticsScreen}
        getId={({ params }) => `${params.courseId}${params.courseShortcode}`}
        options={{
          headerTitle: t('courseStatisticsScreen.title'),
          headerTitleAlign: 'center',
          headerBackTitle: t('common.course'),
        }}
      />
      <Stack.Screen
        name="MessagesModal"
        component={UnreadMessagesModal}
        options={({ navigation }) => ({
          headerTitle: t('messagesScreen.title'),
          headerLargeTitle: false,
          presentation: 'modal',
          headerLeft: HeaderLogoNoProps,
          headerRight: createHeaderCloseButton(navigation),
        })}
      />
      <Stack.Screen
        name="PolitoAuthenticator"
        component={PolitoAuthenticatorScreen}
        options={{
          headerTitle: t('mfaScreen.headerTitle'),
          headerLargeTitle: false,
          presentation: 'modal',
          headerLeft: HeaderLogoNoProps,
        }}
      />
      <Stack.Screen
        name="ImageScreen"
        component={ImageScreen}
        options={{
          headerLargeTitle: false,
          headerTitle: t('common.image'),
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
    </>
  );
};
