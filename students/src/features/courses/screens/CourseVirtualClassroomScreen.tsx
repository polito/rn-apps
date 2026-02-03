import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, View } from 'react-native';

import { formatDateWithTimeIfNotNull } from '@polito/lib';
import { BottomBarSpacer } from '@polito/lib';
import { OverviewList } from '@polito/lib';
import { PersonListItem } from '@polito/lib';
import { RefreshControl } from '@polito/lib';
import { GlobalStyles } from '@polito/lib';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { EventDetails } from '../../../core/components/EventDetails';
import { VideoPlayer } from '../../../core/components/VideoPlayer';
import { useGetCourseVirtualClassrooms } from '../../../core/queries/courseHooks';
import { useGetPerson } from '../../../core/queries/peopleHooks';
import { TeachingStackParamList } from '../../teaching/components/TeachingNavigator';
import { isLiveVC, isRecordedVC } from '../utils/lectures';

type Props = NativeStackScreenProps<
  TeachingStackParamList,
  'CourseVirtualClassroom'
>;

export const CourseVirtualClassroomScreen = ({ route }: Props) => {
  const { courseId, lectureId, teacherId } = route.params;
  const { t } = useTranslation();
  const virtualClassroomQuery = useGetCourseVirtualClassrooms(courseId);
  const teacherQuery = useGetPerson(teacherId);

  const lecture = useMemo(() => {
    return virtualClassroomQuery.data?.find(l => l.id === lectureId);
  }, [lectureId, virtualClassroomQuery.data]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl
          queries={[virtualClassroomQuery, teacherQuery]}
          manual
        />
      }
      contentContainerStyle={GlobalStyles.fillHeight}
    >
      <SafeAreaView>
        {lecture && isRecordedVC(lecture) && lecture.videoUrl && (
          <VideoPlayer
            source={{ uri: lecture.videoUrl }}
            poster={lecture?.coverUrl ?? undefined}
          />
        )}
        {lecture && isLiveVC(lecture) && (
          <View />
          // TODO handle live VC
          // <CtaButton accessibility={accessibility} title={t('courseVirtualClassroomScreen.liveCta')} action={Linking.openURL(lecture.)}/>
        )}
        <EventDetails
          title={lecture?.title ?? ''}
          type={t('courseVirtualClassroomScreen.title')}
          time={
            lecture?.createdAt
              ? formatDateWithTimeIfNotNull(lecture?.createdAt)
              : undefined
          }
        />
        <OverviewList loading={teacherQuery.isLoading}>
          {teacherQuery.data && (
            <PersonListItem
              person={teacherQuery.data}
              subtitle={t('common.teacher')}
            />
          )}
        </OverviewList>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};
