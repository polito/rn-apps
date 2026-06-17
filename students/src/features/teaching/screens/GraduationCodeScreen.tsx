import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import {
  faLocationArrow,
  faLocationDot,
  faShareSquare,
  faTimes,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import {
  dateFormatter,
  formatDate,
  formatDateTimeAccessibility,
  useFeedbackContext,
} from '@polito/lib/core';
import { resolvePlaceId } from '@polito/lib/features/places';
import {
  ActivityIndicator,
  Card,
  Col,
  CtaButton,
  IconButton,
  Text,
  type Theme,
  useSafeBottomBarHeight,
  useStylesheet,
  useTheme,
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

const BACKDROP_COLOR = 'rgba(0, 0, 0, 0.5)';

const parsePlace = (placeId?: string | null) => {
  if (!placeId) {
    return null;
  }

  const parts = placeId.split('_');
  if (parts.length < 3) {
    return null;
  }

  const roomId = parts.pop() ?? '';
  const floorId = parts.pop() ?? '';
  const buildingId = parts.join('_');
  if (!buildingId || !floorId || !roomId) {
    return null;
  }

  return { buildingId, floorId, roomId };
};

const buildPlaceMapUrl = (placeId: string | null) => {
  const place = parsePlace(placeId);
  if (!place) {
    return '';
  }

  return `https://www.polito.it/mappe?bl_id=${encodeURIComponent(
    place.buildingId,
  )}&fl_id=${encodeURIComponent(place.floorId)}&rm_id=${encodeURIComponent(
    place.roomId,
  )}`;
};

const formatGraduationDisplayName = (firstName: string, lastName: string) =>
  `${firstName.charAt(0).toUpperCase()}${firstName.slice(1).toLowerCase()} ${lastName.toUpperCase()}`;

export const GraduationCodeScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { spacing, fontSizes, colors } = useTheme();
  const bottomBarHeight = useSafeBottomBarHeight();
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

    return formatGraduationDisplayName(profile.firstName, profile.lastName);
  }, [profileQuery.data]);

  const pdfFullName = useMemo(() => {
    const profile = profileQuery.data;
    if (!profile) {
      return '';
    }

    return `${profile.lastName} ${profile.firstName}`;
  }, [profileQuery.data]);

  const locationLabel = event?.placeName ?? event?.place ?? '';

  const hasValidPlace = useMemo(
    () => parsePlace(event?.place) !== null,
    [event?.place],
  );

  const { dateTime, entriesUsed } = useMemo(() => {
    if (!event) {
      return {
        dateTime: '',
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
    const place = parsePlace(event?.place);
    if (!place) {
      return;
    }

    navigation.goBack();
    navigation.navigate('PlacesTeachingStack', {
      screen: 'Place',
      params: {
        placeId: resolvePlaceId({ ...place, siteId: '', name: '' }),
        isCrossNavigation: true,
        name: event?.placeName ?? event?.place ?? undefined,
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

  const onClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (!event) {
    return null;
  }

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.backdrop,
          { paddingBottom: bottomBarHeight + spacing[5] },
        ]}
      >
        <Pressable
          style={styles.backdropTouchable}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          onPress={onClose}
        />
        <View style={styles.cardWrapper}>
          <Card rounded gapped style={styles.card}>
            <IconButton
              accessibilityLabel={t('common.close')}
              accessibilityRole="button"
              icon={faTimes}
              size={fontSizes.lg}
              color={colors.title}
              onPress={onClose}
              adjustSpacing="right"
              style={styles.closeButton}
            />
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              overScrollMode="always"
            >
              <Text variant="prose" style={styles.name}>
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
                  />
                )}
                <GraduationCodeDetailRow
                  icon={faUsers}
                  value={entriesText}
                  accessibilityLabel={entriesText}
                />
              </Col>
              <Text
                variant="caption"
                weight="medium"
                style={styles.instruction}
              >
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
              <Col gap={3} style={styles.buttons}>
                <CtaButton
                  absolute={false}
                  variant="outlined"
                  title={t('graduationCodeScreen.share')}
                  icon={faShareSquare}
                  action={onShare}
                  loading={isSharing}
                  disabled={!qrCodeQuery.data}
                  containerStyle={styles.buttonContainer}
                />
                {hasValidPlace && (
                  <CtaButton
                    absolute={false}
                    variant="outlined"
                    title={t('graduationCodeScreen.openMap')}
                    icon={faLocationArrow}
                    action={onPressLocation}
                    containerStyle={styles.buttonContainer}
                  />
                )}
              </Col>
            </ScrollView>
          </Card>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = ({ dark, spacing, fontSizes, palettes, colors }: Theme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: BACKDROP_COLOR,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing[5],
      paddingTop: spacing[5],
    },
    backdropTouchable: {
      ...StyleSheet.absoluteFillObject,
    },
    scroll: {
      flexGrow: 0,
    },
    scrollContent: {
      gap: spacing[4],
      paddingTop: spacing[2],
    },
    cardWrapper: {
      width: '100%',
      maxWidth: 480,
      maxHeight: '100%',
    },
    card: {
      flexShrink: 1,
      marginVertical: 0,
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[5],
      backgroundColor: colors.surface,
      overflow: 'hidden',
    },
    closeButton: {
      position: 'absolute',
      right: spacing[5],
      top: spacing[5] + spacing[2] - spacing[3],
      zIndex: 1,
    },
    name: {
      paddingRight: spacing[8],
      fontFamily: 'Montserrat-Bold',
      fontSize: fontSizes['2xl'],
      lineHeight: fontSizes['2xl'] * 1.25,
    },
    instruction: {
      textAlign: 'center',
      lineHeight: fontSizes.sm * 1.5,
      textTransform: 'none',
      color: dark ? palettes.warning[500] : palettes.warning[700],
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
    buttons: {
      width: '100%',
    },
    buttonContainer: {
      padding: 0,
    },
  });
