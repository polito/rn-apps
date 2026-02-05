import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { useFeedbackContext } from '@polito/lib/core';
import {
  BottomBarSpacer,
  CtaButton,
  CtaButtonSpacer,
  type Option,
  RadioGroup,
  ScreenTitle,
  type Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useBookExam, useGetExams } from '../../../core/queries/examHooks';
import { TeachingStackParamList } from '../components/TeachingNavigator';

type Props = NativeStackScreenProps<TeachingStackParamList, 'ExamQuestion'>;

export const ExamQuestionScreen = ({ route, navigation }: Props) => {
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();
  const { setFeedback } = useFeedbackContext();

  const { id } = route.params;
  const examsQuery = useGetExams();
  const exam = examsQuery.data?.find(e => e.id === id);

  const { mutateAsync: bookExam, isPending: isBooking } = useBookExam(id);

  useEffect(() => {
    if (exam && !exam.question) navigation.goBack();
  }, [exam, navigation]);

  const radioData: undefined | Option<number>[] = useMemo(() => {
    return exam?.question?.options.map(
      (label, value): Option<number> => ({
        label,
        value,
      }),
    );
  }, [exam]);

  const [state, setState] = useState<{ isError: boolean; value?: number }>({
    isError: false,
    value: undefined,
  });

  const onSubmit = async () => {
    if (state.value === undefined) {
      setState({ ...state, isError: true });
      return;
    }
    bookExam({
      courseShortcode: exam!.courseShortcode,
      questionId: exam!.question!.id,
      questionOption: state.value + 1,
    }).then(() => {
      setFeedback({ text: t('examScreen.ctaBookSuccess') });
      // reset navigation to TeachingScreen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    });
  };

  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <SafeAreaView>
          <View style={styles.container}>
            <ScreenTitle
              style={styles.screenTitle}
              title={exam?.question?.statement}
            />
            {radioData && (
              <RadioGroup
                options={radioData}
                value={state.value}
                setValue={value => setState({ ...state, value })}
                showError={state.isError}
              />
            )}
          </View>
          <CtaButtonSpacer />
          <BottomBarSpacer />
        </SafeAreaView>
      </ScrollView>
      {exam && (
        <CtaButton
          title={t('common.confirm')}
          action={onSubmit}
          loading={isBooking}
        />
      )}
    </>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    container: {
      padding: spacing[5],
    },
    screenTitle: {
      marginBottom: spacing[7],
    },
  });
