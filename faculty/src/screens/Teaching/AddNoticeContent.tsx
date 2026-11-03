import { ScrollView } from 'react-native-gesture-handler';

import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { APP_TIMEZONE, usePreferencesContext } from '@polito/lib/core';
import {
  BottomBarSpacer,
  CtaButton,
  CtaButtonContainer,
  TextArea,
  TextButton,
  useHideTabs,
} from '@polito/lib/ui';
import { Theme, useStylesheet } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';

import { AppPreferences } from '~/core/types/preferences';

import { DateTime } from 'luxon';

import { ModalHeader } from '../../core/components/ModalHeader';
import { useCourses } from '../../core/contexts/CoursesContext';
import { NoticeDateCard } from './NoticeDateCard';

export const AddNoticeContent = () => {
  useHideTabs();
  const navigation = useNavigation();
  const { addNoticeToCourse, selectedCourse } = useCourses();
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  const [description, setDescription] = useState('');
  const { language } = usePreferencesContext<AppPreferences>();
  const today = useMemo(
    () => DateTime.now().setZone(APP_TIMEZONE).toJSDate(),
    [],
  );
  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activeDateField, setActiveDateField] = useState<
    'start' | 'end' | null
  >(null);
  const alwaysVisible = endDate === null;

  const handleDateChange = useCallback(
    (selectedDate: Date) => {
      if (selectedDate && activeDateField) {
        if (activeDateField === 'start') {
          setStartDate(selectedDate);
        } else {
          setEndDate(selectedDate);
        }
        setActiveDateField(null);
      }
    },
    [activeDateField],
  );

  const hasDescription = description.trim().length > 0;
  const canPublish = hasDescription;

  const handlePublishPress = () => {
    const lastNoticeId =
      selectedCourse?.notices
        .map(n => n.id)
        .reduce((maxId, id) => Math.max(maxId, id), 0) ?? 0;
    Alert.alert(t('common.confirm'), t('other.alertPublishNotice'), [
      {
        text: t('common.no'),
        style: 'cancel',
      },
      {
        text: t('common.yes'),
        onPress: () => {
          selectedCourse &&
            addNoticeToCourse(selectedCourse?.id, {
              title: '',
              id: lastNoticeId + 1,
              content: description,
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate ? endDate.toISOString().split('T')[0] : '',
              visible: true,
              alwaysVisible: alwaysVisible,
            });
          navigation.goBack();
        },
      },
    ]);
  };

  const handleSaveDraft = useCallback(() => {
    const lastNoticeId =
      selectedCourse?.notices
        .map(n => n.id)
        .reduce((maxId, id) => Math.max(maxId, id), 0) ?? 0;

    selectedCourse &&
      addNoticeToCourse(selectedCourse?.id, {
        title: '',
        id: lastNoticeId + 1,
        content: description,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate ? endDate.toISOString().split('T')[0] : '',
        visible: false,
        alwaysVisible: alwaysVisible,
      });
    navigation.goBack();
  }, [
    selectedCourse,
    addNoticeToCourse,
    description,
    startDate,
    alwaysVisible,
    endDate,
    navigation,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TextButton accessibilityRole="button" onPress={handleSaveDraft}>
            {t('common.saveDraft')}
          </TextButton>
        );
      },
    });
  }, [navigation, t, handleSaveDraft]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ModalHeader
        right={
          <TextButton accessibilityRole="button" onPress={handleSaveDraft}>
            {t('common.saveDraft')}
          </TextButton>
        }
      />
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.section}>
          <View style={styles.cardsContainer}>
            <NoticeDateCard
              label={t('other.startDate')}
              date={startDate}
              onPress={() => setActiveDateField('start')}
            />
            <NoticeDateCard
              label={t('other.endDate')}
              date={endDate}
              emptyLabel={t('courseNoticesTab.noEndDate')}
              onClear={() => setEndDate(null)}
              onPress={() => setActiveDateField('end')}
            />
          </View>
          <TextArea
            label={t('other.noticeTextTitle')}
            value={description}
            onChangeText={setDescription}
            style={styles.textAreaInput}
            placeholder={t('courseNoticesTab.textPlaceholder')}
            description={t('courseNoticesTab.descriptionHelper')}
            accessibilityHint={t('courseNoticesTab.descriptionHint')}
          />
        </View>
        <BottomBarSpacer />
      </ScrollView>

      <CtaButtonContainer absolute={Platform.OS === 'android'}>
        <CtaButton
          absolute={false}
          title={t('other.publish')}
          action={handlePublishPress}
          disabled={!canPublish}
          accessibilityState={{ disabled: !canPublish }}
          accessibilityHint={
            canPublish ? undefined : t('courseNoticesTab.publishDisabledHint')
          }
          icon={faPaperPlane}
          containerStyle={styles.CTAbutton}
        />
      </CtaButtonContainer>
      <DatePicker
        modal
        locale={language}
        date={activeDateField === 'start' ? startDate : endDate || startDate}
        mode="date"
        open={activeDateField !== null}
        onConfirm={handleDateChange}
        onCancel={() => setActiveDateField(null)}
        title={
          activeDateField === 'start'
            ? t('other.selectStartDate')
            : t('other.selectEndDate')
        }
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
      />
    </SafeAreaView>
  );
};

const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    section: {
      paddingHorizontal: spacing[5],
      paddingTop: spacing[3],
    },
    cardsContainer: {
      flexDirection: 'row',
      gap: spacing[3],
      alignItems: 'center',
      alignSelf: 'stretch',
      marginBottom: spacing[4],
    },
    textAreaInput: {
      paddingHorizontal: 0,
      paddingVertical: 0,
      minHeight: spacing[24],
    },
    CTAbutton: {
      width: '100%',
    },
    safeArea: {
      flex: 1,
    },
  });
