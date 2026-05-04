import { useTranslation } from 'react-i18next';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { faFile } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowUpRightFromSquare,
  faChevronLeft,
  faChevronRight,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  IndentedDivider,
  Text,
  Theme,
  useBottomBarAwareStyles,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';

import { useCourses } from '../../../core/contexts/CoursesContext';

export const SpecialNeedsScreen = () => {
  const { palettes, dark } = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { selectedStudent } = useCourses();
  const { t } = useTranslation();

  if (!selectedStudent) return null;

  const studentFullName = `${selectedStudent.name} ${selectedStudent.surname}`;

  const measures = [
    {
      bold: t('specialNeeds.calculator', { defaultValue: 'Calculator' }),
      rest: ` ${t('specialNeeds.calculatorSuffix', { defaultValue: 'allowed' })}`,
    },
    {
      bold: t('specialNeeds.readabilityCriteria', {
        defaultValue: 'Readability criteria',
      }),
      rest: ` ${t('specialNeeds.readabilityCriteriaDetail', {
        defaultValue:
          '(Arial, 12-point font, 1.5 line spacing, non-justified text, expanded spacing)',
      })}`,
    },
    {
      bold: t('specialNeeds.cheatSheet', {
        defaultValue: 'Cheat sheet for formulas',
      }),
      rest: ` ${t('specialNeeds.cheatSheetSuffix', {
        defaultValue: 'for written and oral exams',
      })}`,
    },
    {
      bold: t('specialNeeds.additionalTime', {
        defaultValue: '30% additional time for completing exams',
      }),
      rest: `. ${t('specialNeeds.additionalTimeSuffix', {
        defaultValue:
          'Alternatively, for written exams, consider a quantitative (but not qualitative) reduction of the test itself',
      })}`,
    },
    {
      bold: t('specialNeeds.contentAssessment', {
        defaultValue: 'Assessment of content vs. form',
      }),
      rest: `: ${t('specialNeeds.contentAssessmentSuffix', {
        defaultValue:
          'prioritize content over form and spelling in the evaluation of tests',
      })}`,
    },
  ];

  const sectionTitleColor = dark ? palettes.gray[50] : palettes.primary[700];

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      {Platform.OS === 'ios' ? (
        <View style={styles.iosHeaderContainer}>
          <View style={[styles.iosGrabber, dark && styles.iosGrabberDark]} />
          <View style={[styles.iosHeader, dark && styles.iosHeaderDark]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.closeButton}
              accessibilityRole="button"
            >
              <Text
                style={[styles.closeButtonText, { color: palettes.gray[500] }]}
              >
                {t('common.close', { defaultValue: 'Close' })}
              </Text>
            </TouchableOpacity>
            <View style={styles.iosHeaderTitleWrap} pointerEvents="none">
              <Text
                style={[styles.iosHeaderTitle, { color: sectionTitleColor }]}
                numberOfLines={2}
              >
                {t('specialNeeds.title', {
                  defaultValue: 'Compensative measures',
                })}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.topBar,
            dark && styles.topBarDark,
            { height: insets.top + 44, paddingTop: insets.top },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={18}
              color={palettes.primary[500]}
            />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>
            {t('specialNeeds.title', {
              defaultValue: 'Compensative measures',
            })}
          </Text>
          <View style={styles.topBarRightSpacer} />
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          Platform.OS === 'ios'
            ? styles.scrollContentIos
            : styles.contentContainer,
          bottomBarAwareStyles,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Info card */}
        <View
          style={[
            styles.infoCard,
            // Keep the info card's dark-theme background aligned with design token --info-info-100.
            dark && { backgroundColor: '#E0F2FE' },
          ]}
        >
          <Text style={styles.infoCardHeader}>
            {t('specialNeeds.infoCardHeader', {
              defaultValue: 'List of compensatory measures granted to',
            })}{' '}
            <Text style={styles.infoCardHeaderBold}>{studentFullName}</Text>
          </Text>

          <View style={styles.measuresList}>
            {measures.map((measure, index) => (
              <View key={index} style={styles.measureRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.measureText}>
                  <Text style={styles.measureBold}>{measure.bold}</Text>
                  {measure.rest}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Details card */}
        <View style={styles.detailsCard}>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {}}
            accessibilityRole="button"
          >
            <View style={styles.leadingIcon}>
              <FontAwesomeIcon
                icon={faCircleInfo}
                size={20}
                color={dark ? palettes.gray[50] : palettes.primary[700]}
              />
            </View>
            <View style={styles.listItemContent}>
              <Text
                style={[styles.listItemTitle, dark && styles.listItemTitleDark]}
                numberOfLines={1}
              >
                {t('specialNeeds.moreDetails', {
                  defaultValue: 'More Details',
                })}
              </Text>
              <Text style={styles.listItemSubtitle}>
                {t('specialNeeds.moreDetailsSubtitle', {
                  defaultValue:
                    'Click here to view the list of requests for this course',
                })}
              </Text>
            </View>
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              size={16}
              color={palettes.gray[500]}
            />
          </TouchableOpacity>

          <IndentedDivider
            style={[styles.divider, dark && styles.dividerDark]}
          />

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {}}
            accessibilityRole="button"
          >
            <View style={styles.leadingIcon}>
              <FontAwesomeIcon
                icon={faFile}
                size={20}
                color={palettes.darkOrange[600]}
              />
            </View>
            <View style={styles.listItemContent}>
              <Text
                style={[styles.listItemTitle, dark && styles.listItemTitleDark]}
                numberOfLines={1}
              >
                {t('specialNeeds.handbook', {
                  defaultValue: 'Reporting procedure handbook',
                })}
              </Text>
            </View>
            <FontAwesomeIcon
              icon={faChevronRight}
              size={16}
              color={palettes.gray[500]}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = ({
  colors,
  spacing,
  palettes,
  fontSizes,
  fontWeights,
  fontFamilies,
  shapes,
}: Theme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
      gap: spacing[4],
    },
    scrollContentIos: {
      flexGrow: 1,
      padding: spacing[5],
      gap: 22,
      paddingBottom: spacing[2],
    },
    iosHeader: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[0.5],
      minHeight: 44,
      backgroundColor: colors.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palettes.gray[300],
    },
    iosHeaderDark: {
      borderBottomColor: palettes.gray[500],
    },
    iosHeaderContainer: {
      backgroundColor: colors.surface,
    },
    iosGrabber: {
      width: 36,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: 'rgba(60, 60, 67, 0.30)',
      alignSelf: 'center',
      marginTop: spacing[1.5],
    },
    iosGrabberDark: {
      backgroundColor: palettes.gray[500],
    },
    iosHeaderTitleWrap: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing[16],
    },
    closeButton: {
      zIndex: 1,
      flexShrink: 0,
      paddingVertical: spacing[1],
    },
    closeButtonText: {
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontWeight: fontWeights.normal,
      lineHeight: 22,
      letterSpacing: -0.43,
    },
    iosHeaderTitle: {
      color: palettes.primary[700],
      textAlign: 'center',
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      lineHeight: 22,
      letterSpacing: -0.43,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing[1],
      backgroundColor: palettes.gray[100],
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palettes.gray[300],
    },
    topBarDark: {
      borderBottomColor: palettes.gray[500],
    },
    backButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingLeft: spacing[4],
    },
    topBarTitle: {
      fontFamily: fontFamilies.body,
      fontSize: 17,
      fontWeight: '600',
      lineHeight: 22,
      color: palettes.primary[700],
      textAlign: 'center',
    },
    topBarRightSpacer: {
      width: 44,
      height: 44,
    },
    infoCard: {
      backgroundColor: palettes.info[100],
      borderWidth: 1,
      borderColor: palettes.info[500],
      borderRadius: 12,
      padding: spacing[4],
      gap: spacing[2],
    },
    infoCardHeader: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: palettes.text[800],
      lineHeight: fontSizes.sm * 1.5,
    },
    infoCardHeaderBold: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: palettes.text[800],
      lineHeight: fontSizes.sm * 1.5,
    },
    measuresList: {
      gap: 2,
    },
    measureRow: {
      flexDirection: 'row',
      gap: spacing[2],
    },
    bullet: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      color: palettes.text[600],
      lineHeight: fontSizes.sm * 1.5,
      marginTop: 1,
    },
    measureText: {
      flex: 1,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      color: palettes.text[600],
      lineHeight: fontSizes.sm * 1.5,
    },
    measureBold: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.medium,
      color: palettes.text[600],
      lineHeight: fontSizes.sm * 1.5,
    },
    detailsCard: {
      backgroundColor: colors.surface,
      borderRadius: shapes.lg,
      overflow: 'hidden',
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 60,
      paddingRight: spacing[3],
      paddingVertical: spacing[3],
    },
    leadingIcon: {
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: spacing[4],
    },
    listItemContent: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: spacing[4],
    },
    listItemTitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.md,
      fontWeight: fontWeights.medium,
      color: palettes.text[800],
      lineHeight: fontSizes.md * 1.5,
    },
    listItemTitleDark: {
      color: palettes.gray[50],
    },
    listItemSubtitle: {
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.normal,
      color: palettes.gray[500],
      lineHeight: fontSizes.sm * 1.5,
    },
    divider: {
      alignSelf: 'stretch',
      marginLeft: spacing[4],
      minHeight: 1,
    },
    dividerDark: {
      backgroundColor: palettes.gray[500],
    },
  });
