import { ScrollView } from 'react-native-gesture-handler';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';

import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { APP_TIMEZONE, usePreferencesContext } from '@polito/lib/core';
import {
  BottomBarSpacer,
  Card,
  Col,
  CtaButton,
  CtaButtonContainer,
  Icon,
  Row,
  Section,
  SegmentedControl,
  Separator,
  SwitchListItem,
  Text,
  TextArea,
  TextButton,
} from '@polito/lib/ui';
import { Theme, useStylesheet, useTheme } from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';

import { AppPreferences } from '~/core/types/preferences';

import { DateTime } from 'luxon';

import { useCourses } from '../../core/contexts/CoursesContext';

export const EditNoticeContent = () => {
  const navigation = useNavigation();

  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { fontSizes, palettes } = useTheme();
  const { selectedNotice, selectedCourse, updateCourseNotice } = useCourses();
  const [selectedMode, setSelectedMode] = useState<'text' | 'preview'>('text');
  const [description, setDescription] = useState(selectedNotice?.content ?? '');
  const { language } = usePreferencesContext<AppPreferences>();
  const today = useMemo(
    () => DateTime.now().setZone(APP_TIMEZONE).toJSDate(),
    [],
  );

  const [alwaysVisible, setAlwaysVisible] = useState(
    selectedNotice?.alwaysVisible ?? false,
  );
  const [startDate, setStartDate] = useState<Date | null>(
    selectedNotice?.startDate ? new Date(selectedNotice.startDate) : null,
  );
  const [endDate, setEndDate] = useState<Date | null>(
    selectedNotice?.endDate ? new Date(selectedNotice.endDate) : null,
  );
  const [isStartDateSelected, setIsStartDateSelected] = useState(
    !!selectedNotice?.startDate,
  );
  const [isEndDateSelected, setIsEndDateSelected] = useState(
    !!selectedNotice?.endDate,
  );
  const [activeDateField, setActiveDateField] = useState<
    'start' | 'end' | null
  >(null);
  const visibilityOptions = [
    { label: 'Text', value: 'text' },
    { label: 'Preview', value: 'preview' },
  ] as const;
  const cardTitleSelectedStyle = { color: palettes.primary[700] };
  const cardIconSelectedColor = palettes.primary[700];

  useEffect(() => {
    if (selectedMode === 'preview') {
      setActiveDateField(null);
    }
  }, [selectedMode]);

  useEffect(() => {
    if (!selectedNotice) return;

    setDescription(selectedNotice.content ?? '');
    setAlwaysVisible(selectedNotice.alwaysVisible ?? false);
    setStartDate(
      selectedNotice.startDate ? new Date(selectedNotice.startDate) : null,
    );
    setEndDate(
      selectedNotice.endDate ? new Date(selectedNotice.endDate) : null,
    );
    setIsStartDateSelected(!!selectedNotice.startDate);
    setIsEndDateSelected(!!selectedNotice.endDate);
  }, [selectedNotice]);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const renderDateLabel = (date: Date | null) => {
    return date ? formatDate(date) : t('common.datePlaceholder');
  };

  const handleDateChange = useCallback(
    (selectedDate: Date) => {
      if (selectedDate && activeDateField) {
        if (activeDateField === 'start') {
          setStartDate(selectedDate);
          setIsStartDateSelected(true);
        } else {
          setEndDate(selectedDate);
          setIsEndDateSelected(true);
        }
        setActiveDateField(null);
      }
    },
    [activeDateField],
  );

  const hasDescription = description.trim().length > 0;
  const canPublish = hasDescription;

  const handlePublishPress = () => {
    Alert.alert(t('common.confirm'), t('other.alertPublishNotice'), [
      {
        text: t('common.no'),
        style: 'cancel',
      },
      {
        text: t('common.yes'),
        onPress: () => {
          selectedCourse &&
            selectedNotice &&
            updateCourseNotice(selectedCourse?.id, selectedNotice?.id, {
              title: '',
              id: selectedNotice.id,
              content: description,
              startDate:
                startDate && !alwaysVisible
                  ? startDate.toISOString().split('T')[0]
                  : new Date().toISOString().split('T')[0],
              endDate: endDate ? endDate.toISOString().split('T')[0] : '',
              alwaysVisible: alwaysVisible,
              visible: true,
            });
          navigation.goBack();
        },
      },
    ]);
  };

  const handleSaveDraft = useCallback(() => {
    selectedCourse &&
      selectedNotice &&
      updateCourseNotice(selectedCourse?.id, selectedNotice?.id, {
        title: '',
        id: selectedNotice.id,
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
    selectedNotice,
    updateCourseNotice,
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
          !selectedNotice?.visible && (
            <TextButton onPress={handleSaveDraft}>
              {t('common.saveDraft')}
            </TextButton>
          )
        );
      },
    });
  }, [selectedNotice, navigation, t, handleSaveDraft]);

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
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.cardTouchArea}
                  onPress={() => setActiveDateField('start')}
                >
                  <Card rounded style={styles.card}>
                    <Row style={styles.cardContent}>
                      <Icon
                        icon={faCalendarDay}
                        size={fontSizes['2xl']}
                        color={
                          isStartDateSelected
                            ? cardIconSelectedColor
                            : palettes.gray[500]
                        }
                      />
                      <Col>
                        <Text
                          style={[
                            styles.cardTitle,
                            isStartDateSelected && cardTitleSelectedStyle,
                          ]}
                        >
                          {t('other.startDate')}
                        </Text>
                        <Text style={styles.cardSubtitle}>
                          {renderDateLabel(startDate)}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.cardTouchArea}
                  onPress={() => setActiveDateField('end')}
                >
                  <Card rounded style={styles.card}>
                    <Row style={styles.cardContent}>
                      <Icon
                        icon={faCalendarDay}
                        size={fontSizes['2xl']}
                        color={
                          isEndDateSelected
                            ? cardIconSelectedColor
                            : palettes.gray[500]
                        }
                      />
                      <Col>
                        <Text
                          style={[
                            styles.cardTitle,
                            isEndDateSelected && cardTitleSelectedStyle,
                          ]}
                        >
                          {t('other.endDate')}
                        </Text>
                        <Text style={styles.cardSubtitle}>
                          {renderDateLabel(endDate)}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                </TouchableOpacity>
              </View>
            )}

            <View>
              <TextArea
                label={t('other.description')}
                value={description}
                onChangeText={setDescription}
                style={styles.textAreaInput}
                placeholder={t('common.textAreaPlaceholder')}
                unlimited
              />
            </View>
          </Col>
        ) : (
          <Section style={styles.section}>
            <Separator />
            <Text variant="heading" style={styles.sectionTitle}>
              {t('other.noticeTextTitle')}
            </Text>
            <Text style={styles.sectionContent}>{description}</Text>
          </Section>
        )}
        <BottomBarSpacer />
      </ScrollView>

      <CtaButtonContainer absolute={Platform.OS === 'android'}>
        <CtaButton
          absolute={Platform.OS === 'ios'}
          title={t('other.saveAndExit')}
          disabled={!canPublish}
          action={handlePublishPress}
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
  palettes,
  spacing,
  shapes,
  fontSizes,
  fontWeights,
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
      color: palettes.text[800],
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
    cardTouchArea: {
      flex: 1,
      minWidth: 0,
    },
    card: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      marginVertical: 0,
      elevation: 0,
    },
    cardContent: {
      alignItems: 'center',
      gap: spacing[3],
    },
    cardTitle: {
      color: palettes.gray[500],
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      fontFamily: 'Montserrat-SemiBold',
    },
    cardSubtitle: {
      color: palettes.gray[500],
      fontSize: fontSizes.md,
      fontWeight: fontWeights.normal,
      fontFamily: 'Montserrat-Regular',
    },
    textAreaInput: {
      color: palettes.gray[500],
      fontSize: fontSizes.md,
      fontWeight: fontWeights.normal,
      fontFamily: 'Montserrat-Regular',
      paddingHorizontal: 0,
      paddingVertical: 0,
      minHeight: spacing[24],
    },
    CTAbutton: {
      backgroundColor: colors.background,
      width: '100%',
    },

    sectionTitle: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      fontFamily: 'Montserrat-SemiBold',
      color: palettes.primary[700],
    },
    sectionContent: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.normal,
      fontFamily: 'Montserrat-Regular',
      color: palettes.gray[800],
    },
    safeArea: {
      flex: 1,
    },
  });
