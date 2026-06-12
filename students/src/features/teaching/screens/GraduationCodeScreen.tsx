import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import {
  faLocationDot,
  faShare,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import {
  dateFormatter,
  formatDate,
  formatDateTimeAccessibility,
  useFeedbackContext,
} from '@polito/lib/core';
import {
  ActivityIndicator,
  BottomBarSpacer,
  Card,
  Col,
  CtaButton,
  Text,
  type Theme,
  useStylesheet,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  useGetEventAdmissionById,
  useGetEventQrCode,
} from '../../../core/queries/eventAdmissionHooks';
import { useGetProfile } from '../../../core/queries/studentHooks';
import { GraduationCodeDetailRow } from '../components/GraduationCodeDetailRow';
import { TeachingStackParamList } from '../components/TeachingNavigator';
import {
  type GraduationCodePdfContent,
  shareGraduationCodePdf,
} from '../utils/graduationCodePdf';

type Props = NativeStackScreenProps<TeachingStackParamList, 'GraduationCode'>;

const formatHHmm = dateFormatter('HH:mm');

const buildPlaceMapUrl = (placeId: string | null) => {
  if (!placeId) {
    return '';
  }

  const parts = placeId.split('_');
  if (parts.length < 3) {
    return '';
  }

  const roomId = parts.pop() ?? '';
  const floorId = parts.pop() ?? '';
  const buildingId = parts.join('_');
  if (!buildingId || !floorId || !roomId) {
    return '';
  }

  return `https://www.polito.it/mappe?bl_id=${encodeURIComponent(
    buildingId,
  )}&fl_id=${encodeURIComponent(floorId)}&rm_id=${encodeURIComponent(roomId)}`;
};

export const GraduationCodeScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { setFeedback } = useFeedbackContext();
  const [isSharing, setIsSharing] = useState(false);
  const profileQuery = useGetProfile();
  const eventQuery = useGetEventAdmissionById(route.params.id);
  const event = eventQuery.data;
  const qrCodeQuery = useGetEventQrCode(event?.id);

  useEffect(() => {
    if (!eventQuery.isLoading && !event) {
      navigation.goBack();
    }
  }, [event, eventQuery.isLoading, navigation]);

  const fullName = useMemo(() => {
    const profile = profileQuery.data;
    if (!profile) {
      return '';
    }

    return `${profile.lastName} ${profile.firstName}`.toUpperCase();
  }, [profileQuery.data]);

  const pdfFullName = useMemo(() => {
    const profile = profileQuery.data;
    if (!profile) {
      return '';
    }

    return `${profile.lastName} ${profile.firstName}`;
  }, [profileQuery.data]);

  const locationLabel = event?.placeName ?? event?.place ?? '';

  const { dateTime, validUntilParts, entriesUsed } = useMemo(() => {
    if (!event) {
      return {
        dateTime: '',
        validUntilParts: { date: '', time: '' },
        entriesUsed: 0,
      };
    }

    return {
      dateTime: `${formatDate(event.eventStartsAt)} - ${formatHHmm(event.eventStartsAt)}`,
      validUntilParts: formatDateTimeAccessibility(event.eventEndsAt),
      entriesUsed: Math.max(
        0,
        event.totalAdmissions - event.remainingAdmissions,
      ),
    };
  }, [event]);

  const entriesText = event
    ? t('graduationCodeScreen.entriesValue', {
        used: entriesUsed,
        max: event.totalAdmissions,
      })
    : '';

  const validUntilLabel = useMemo(
    () =>
      event
        ? t('graduationCodeScreen.validUntil', {
            ...validUntilParts,
            interpolation: { escapeValue: false },
          })
        : '',
    [event, t, validUntilParts],
  );

  const pdfContent = useMemo<Omit<
    GraduationCodePdfContent,
    'qrCodeSvg'
  > | null>(() => {
    if (!event) {
      return null;
    }

    return {
      fullName: pdfFullName,
      eventTitle: event.title,
      dateTime,
      maxAdmissionsText: t('graduationCodeScreen.pdf.maxAdmissions', {
        max: event.totalAdmissions,
      }),
      location: locationLabel,
      mapUrl: buildPlaceMapUrl(event.place),
      instruction: t('graduationCodeScreen.pdf.instruction', {
        max: event.totalAdmissions,
      }),
      admissionCodeId: event.id,
      labels: {
        event: t('graduationCodeScreen.pdf.event'),
        date: t('graduationCodeScreen.pdf.date'),
        admissions: t('graduationCodeScreen.pdf.admissions'),
        location: t('graduationCodeScreen.location'),
        map: t('graduationCodeScreen.pdf.map'),
        qrTitle: t('graduationCodeScreen.pdf.qrTitle'),
        codeId: t('graduationCodeScreen.pdf.codeId'),
      },
    };
  }, [dateTime, event, locationLabel, pdfFullName, t]);

  const onPressLocation = useCallback(() => {
    if (!event?.place) {
      return;
    }

    navigation.navigate('PlacesTeachingStack', {
      screen: 'Place',
      params: {
        placeId: event.place,
        isCrossNavigation: true,
        name: event.placeName ?? event.place,
      },
    });
  }, [event, navigation]);

  const onShare = useCallback(async () => {
    if (!pdfContent || !qrCodeQuery.data) {
      return;
    }

    setIsSharing(true);
    try {
      await shareGraduationCodePdf(
        { ...pdfContent, qrCodeSvg: qrCodeQuery.data },
        t('graduationCodeScreen.share'),
      );
    } catch (error) {
      setFeedback({
        text: t('graduationCodeScreen.shareFailure', {
          reason: error instanceof Error ? error.message : String(error),
        }),
        isError: true,
      });
    } finally {
      setIsSharing(false);
    }
  }, [pdfContent, qrCodeQuery.data, setFeedback, t]);

  if (!event) {
    return null;
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <SafeAreaView>
        <View style={styles.screen}>
          <Card rounded spaced gapped style={styles.card}>
            <Text variant="heading" weight="bold" style={styles.name}>
              {fullName}
            </Text>
            <Col gap={1}>
              <GraduationCodeDetailRow
                icon={faCalendar}
                value={dateTime}
                accessibilityLabel={`${t('graduationCodeScreen.dateTime')}: ${dateTime}`}
              />
              {!!locationLabel && (
                <GraduationCodeDetailRow
                  icon={faLocationDot}
                  value={locationLabel}
                  accessibilityLabel={`${t('graduationCodeScreen.location')}: ${locationLabel}`}
                  onPress={event.place ? onPressLocation : undefined}
                />
              )}
              <GraduationCodeDetailRow
                icon={faUsers}
                value={entriesText}
                accessibilityLabel={entriesText}
              />
            </Col>
            <Text variant="caption" weight="medium" style={styles.instruction}>
              {t('graduationCodeScreen.instruction', {
                max: event.totalAdmissions,
              })}
            </Text>
            <View
              style={styles.qrContainer}
              accessibilityLabel={t('graduationCodeScreen.qrCode')}
            >
              {qrCodeQuery.data?.includes('<svg') ? (
                <SvgXml xml={qrCodeQuery.data} width={206} height={206} />
              ) : (
                <ActivityIndicator style={styles.qrLoader} />
              )}
            </View>
            <Text variant="link" style={styles.validUntil}>
              {validUntilLabel}
            </Text>
            <CtaButton
              absolute={false}
              variant="outlined"
              title={t('graduationCodeScreen.share')}
              icon={faShare}
              action={onShare}
              loading={isSharing}
              disabled={!qrCodeQuery.data}
              containerStyle={styles.shareContainer}
            />
          </Card>
        </View>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};

const createStyles = ({ spacing, fontSizes, palettes }: Theme) =>
  StyleSheet.create({
    screen: {
      paddingTop: spacing[2],
    },
    card: {
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[5],
      gap: spacing[4],
    },
    name: {
      fontSize: fontSizes['2xl'],
      lineHeight: fontSizes['2xl'] * 1.2,
    },
    instruction: {
      textAlign: 'center',
      lineHeight: fontSizes.sm * 1.5,
      textTransform: 'none',
      color: palettes.warning[700],
    },
    qrContainer: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 206,
    },
    qrLoader: {
      flex: 1,
    },
    validUntil: {
      textAlign: 'center',
    },
    shareContainer: {
      paddingTop: spacing[2],
      paddingBottom: 0,
    },
  });
