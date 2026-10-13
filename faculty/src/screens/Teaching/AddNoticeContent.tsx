import { ScrollView } from 'react-native-gesture-handler';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { APP_TIMEZONE, usePreferencesContext } from '@polito/lib/core';
import {
  BottomBarSpacer,
  Col,
  CtaButton,
  CtaButtonContainer,
  Section,
  SegmentedControl,
  Separator,
  SwitchListItem,
  Text,
  TextArea,
  TextButton,
} from '@polito/lib/ui';
import { Theme, useStylesheet } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';

import { AppPreferences } from '~/core/types/preferences';

import { DateTime } from 'luxon';

import { useCourses } from '../../core/contexts/CoursesContext';
import { NoticeDateCard } from './NoticeDateCard';

export const AddNoticeContent = () => {
  const navigation = useNavigation();
  const { addNoticeToCourse, selectedCourse } = useCourses();
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);

  const [selectedMode, setSelectedMode] = useState<'text' | 'preview'>('text');
  const [description, setDescription] = useState('');
  const { language } = usePreferencesContext<AppPreferences>();
  const today = useMemo(
    () => DateTime.now().setZone(APP_TIMEZONE).toJSDate(),
    [],
  );
  const [alwaysVisible, setAlwaysVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activeDateField, setActiveDateField] = useState<
    'start' | 'end' | null
  >(null);
  const visibilityOptions = [
    { label: t('courseNoticesTab.textTab'), value: 'text' as const },
    { label: t('courseNoticesTab.previewTab'), value: 'preview' as const },
  ];

  useEffect(() => {
    if (selectedMode === 'preview') {
      setActiveDateField(null);
    }
  }, [selectedMode]);

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
              startDate:
                startDate && !alwaysVisible
                  ? startDate.toISOString().split('T')[0]
                  : new Date().toISOString().split('T')[0],
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
        startDate:
          startDate && !alwaysVisible
            ? startDate.toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
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
      <ScrollView
        style={styles.container}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SegmentedControl
          options={visibilityOptions}
          value={selectedMode}
          onChange={setSelectedMode}
          style={styles.segmentedControl}
        />
        {selectedMode === 'text' ? (
          <Col style={styles.section}>
            <SwitchListItem
              style={styles.listItem}
              title={t('courseNoticesTab.setAlwaysVisible')}
              accessibilityRole="switch"
              accessibilityLabel={t('courseNoticesTab.setAlwaysVisible')}
              accessibilityState={{ checked: alwaysVisible }}
              accessibilityHint={t('courseNoticesTab.alwaysVisibleHint')}
              value={alwaysVisible}
              onChange={value => {
                setAlwaysVisible(value);
                if (value) {
                  setActiveDateField(null);
                }
              }}
            />

            {!alwaysVisible && (
              <View style={styles.cardsContainer}>
                <NoticeDateCard
                  label={t('other.startDate')}
                  date={startDate}
                  onPress={() => setActiveDateField('start')}
                />
                <NoticeDateCard
                  label={t('other.endDate')}
                  date={endDate}
                  onPress={() => setActiveDateField('end')}
                />
              </View>
            )}

            <View>
              <TextArea
                label={t('other.description')}
                value={description}
                onChangeText={setDescription}
                style={styles.textAreaInput}
                placeholder={t('courseNoticesTab.descriptionPlaceholder')}
                accessibilityHint={t('courseNoticesTab.descriptionHint')}
                unlimited
              />
            </View>
          </Col>
        ) : (
          <Section style={styles.section}>
            <Separator />
            <Text style={styles.sectionTitle} accessibilityRole="header">
              {t('other.noticeTextTitle')}
            </Text>
            <Text style={styles.sectionContent}>{description}</Text>
          </Section>
        )}
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
        date={
          activeDateField === 'start' ? startDate || today : endDate || today
        }
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

const createStyles = ({
  colors,
  spacing,
  shapes,
  fontSizes,
  fontWeights,
  fontFamilies,
}: Theme) =>
  StyleSheet.create({
    container: {
      gap: spacing[5],
      backgroundColor: colors.background,
    },
    segmentedControl: {
      backgroundColor: colors.background,
    },
    section: {
      paddingHorizontal: spacing[5],
    },
    listItem: {
      borderRadius: shapes.lg,
      backgroundColor: colors.surface,
      elevation: 0,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      color: colors.prose,
      marginBottom: spacing[5],
    },
    cardsContainer: {
      flexDirection: 'row',
      gap: spacing[5],
      alignItems: 'center',
      display: 'flex',
      alignSelf: 'stretch',
      marginBottom: spacing[5],
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
    sectionTitle: {
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.25,
      fontFamily: fontFamilies.heading,
      color: colors.heading,
    },
    sectionContent: {
      fontSize: fontSizes.md,
      lineHeight: fontSizes.md * 1.5,
      fontFamily: fontFamilies.body,
      color: colors.prose,
    },
  });
