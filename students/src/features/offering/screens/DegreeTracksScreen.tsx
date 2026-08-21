import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccessibilityInfo,
  Pressable,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useAccessibilityFocusOnScreenFocus } from '@polito/lib/core';
import {
  Icon,
  IndentedDivider,
  OverviewList,
  RefreshControl,
  SectionHeader,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { OfferingCourseOverview } from '@polito/student-api-client';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { useGetOfferingDegree } from '../../../core/queries/offeringHooks';
import { getTracksCoursesSections } from '../../../utils/offerings';
import { DegreeTrackYear } from '../components/DegreeTrackYear';
import { useDegreeContext } from '../contexts/DegreeContext';

export type OfferingCourseYear = {
  teachingYear: number;
  data: OfferingCourseOverview[];
};

type DegreeTrackSection = {
  title: string;
  isExpanded?: boolean;
  index: number;
  data: OfferingCourseYear[];
};

export const DegreeTracksScreen = () => {
  const bottomBarHeight = useBottomTabBarHeight();
  const screenRef =
    useAccessibilityFocusOnScreenFocus<
      SectionList<OfferingCourseYear, DegreeTrackSection>
    >();
  const { t } = useTranslation();
  const safeAreaInsets = useSafeAreaInsets();
  const { degreeId, year } = useDegreeContext();
  const degreeQuery = useGetOfferingDegree({ degreeId, year });
  const { spacing, colors } = useTheme();
  const [sections, setSections] = useState<DegreeTrackSection[]>([]);
  const styles = useStylesheet(createStyles);
  const degree = degreeQuery?.data;

  useEffect(() => {
    if (!degreeQuery.isLoading) {
      setSections(getTracksCoursesSections(degree?.tracks));
    }
  }, [degree?.tracks, degreeQuery.isLoading]);

  const toggleSection = (toggleIndex: number) => {
    const willExpand = !sections[toggleIndex]?.isExpanded;
    setSections(oldSections =>
      oldSections.map((section, index) => ({
        ...section,
        isExpanded: index === toggleIndex ? !section.isExpanded : false,
      })),
    );
    setTimeout(() => {
      AccessibilityInfo.announceForAccessibility(
        t(`common.openedStatus.${willExpand}`),
      );
    }, 300);
  };

  return (
    <OverviewList
      loading={degreeQuery.isLoading}
      indented={true}
      style={{
        marginTop: spacing[4],
        marginBottom: bottomBarHeight + spacing[2],
      }}
      accessibilityRole="list"
      accessibilityLabel={t('common.degreeTracksAndCourses')}
    >
      <SectionList
        ref={screenRef}
        refreshControl={<RefreshControl queries={[degreeQuery]} manual />}
        stickySectionHeadersEnabled
        sections={sections}
        keyExtractor={(item, index) => `${item.teachingYear}-${index}`}
        renderSectionFooter={({ section: { index } }) =>
          index !== sections.length - 1 ? <IndentedDivider indent={14} /> : null
        }
        initialNumToRender={2}
        renderSectionHeader={({ section: { title, index, isExpanded } }) => (
          <Pressable
            onPress={() => toggleSection(index)}
            accessibilityRole="button"
            accessibilityState={{ expanded: isExpanded }}
            accessibilityLabel={`${title}. ${t(
              `common.openedStatus.${isExpanded}`,
            )}. ${t(`common.openedStatusAction.${isExpanded}`)}`}
            accessibilityHint={t('common.tapToToggleSection')}
          >
            <View
              style={{
                paddingLeft: safeAreaInsets.left,
                paddingRight: safeAreaInsets.right,
                ...styles.sectionHeader,
              }}
            >
              <SectionHeader
                title={title}
                titleStyle={styles.titleStyle}
                separator={false}
                trailingItem={
                  <Icon
                    icon={isExpanded ? faChevronUp : faChevronDown}
                    color={colors.secondaryText}
                  />
                }
              />
            </View>
          </Pressable>
        )}
        renderItem={({ item, section }) =>
          section?.isExpanded ? <DegreeTrackYear item={item} /> : null
        }
      />
    </OverviewList>
  );
};

const createStyles = ({ spacing, fontWeights, colors }: Theme) =>
  StyleSheet.create({
    sectionHeader: {
      paddingVertical: spacing[3],
      backgroundColor: colors.surface,
    },
    titleStyle: {
      fontWeight: fontWeights.medium,
    },
  });
