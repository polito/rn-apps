import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, TouchableOpacity, View } from 'react-native';

import { faChevronLeft, faSliders } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  HeaderAccessory,
  IconButton,
  Tab,
  Tabs,
  Text,
  useTheme,
} from '@polito/lib/ui';
import {
  MaterialTopTabBarProps,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import {
  ParamListBase,
  getFocusedRouteNameFromRoute,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { FileNavigator } from '../../features/files/navigation/FileNavigator';
import { CourseAssignmentsTab } from './CourseAssignmentsTab';
import { CourseInfoScreen } from './CourseInfoScreen';
import { CourseLecturesTab } from './CourseLecturesTab';
import { CourseNoticesTab } from './CourseNoticesTab';
import { StaffScreen } from './CourseStaffScreen';
import { CourseStudentsTab } from './CourseStudentsTab';
import { TeachingStackParamList } from './TeachingNavigator';

interface CourseTabsParamList extends ParamListBase, TeachingStackParamList {
  CourseInfoScreen: undefined;
  CourseStaffScreen: undefined;
  CourseNoticesScreen: undefined;
  CourseFilesScreen: undefined;
  CourseLecturesScreen: undefined;
  CourseStudentsScreen: undefined;
  CourseAssignmentsScreen: undefined;
}

const TopTabs = createMaterialTopTabNavigator<CourseTabsParamList>();

const CourseTopTabBar = ({
  state,
  descriptors,
  navigation,
}: MaterialTopTabBarProps) => {
  const { dark, palettes, fontFamilies, fontSizes, fontWeights, spacing } =
    useTheme();
  const focusedTopRoute = state.routes[state.index];
  const focusedNestedRoute = getFocusedRouteNameFromRoute(
    focusedTopRoute as never,
  );
  const hideTabsOnAndroid =
    Platform.OS === 'android' &&
    focusedTopRoute?.name === 'CourseFilesScreen' &&
    focusedNestedRoute != null &&
    focusedNestedRoute !== 'CourseFilesScreen';

  if (hideTabsOnAndroid) {
    return null;
  }

  return (
    <HeaderAccessory>
      <Tabs>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({
                name: route.name,
                merge: true,
                params: {},
              });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Tab
              key={route.key}
              selected={isFocused}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              textStyle={{
                fontFamily: fontFamilies.body,
                fontSize: fontSizes.xs + 1,
                fontStyle: 'normal',
                fontWeight: fontWeights.medium,
                lineHeight: 19.5,
              }}
              style={[
                {
                  display: 'flex',
                  paddingVertical: spacing[1] - 1,
                  paddingHorizontal: spacing[2.5],
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: spacing[1],
                },
                !isFocused
                  ? {
                      borderWidth: 1,
                      borderColor: palettes.primary[dark ? 600 : 50],
                    }
                  : undefined,
              ]}
            >
              {label as string}
            </Tab>
          );
        })}
      </Tabs>
    </HeaderAccessory>
  );
};

export const CourseNavigator = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { dark, palettes, fontSizes, spacing, fontFamilies, fontWeights } =
    theme;
  const navigation =
    useNavigation<NativeStackNavigationProp<TeachingStackParamList>>();
  const headerSideWidth = 44;

  const [showPlusButton, setShowPlusButton] = useState<boolean>(false); // <--- Stato
  const [_formPage, setFormPage] = useState('');
  const [tab, setTab] = useState('Info');
  const headerTitle = (() => {
    switch (tab) {
      case 'Info':
        return 'Info';
      case 'Staff':
        return t('courseStaffTab.title');
      case 'Notices':
        return t('common.notice_plural');
      case 'Files':
        return t('courseFilesTab.title');
      case 'Lectures':
        return t('common.lecture_plural');
      case 'Students':
        return t('other.students');
      case 'Assignments':
        return t('courseAssignmentsTab.title');
      default:
        return t('common.course');
    }
  })();

  useEffect(() => {
    const isAndroid = Platform.OS === 'android';

    navigation.setOptions({
      headerTitleAlign: 'center',
      headerBackVisible: isAndroid,
      headerTintColor: palettes.primary[500],
      headerLeft: isAndroid
        ? undefined
        : () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              accessibilityLabel={t('common.back')}
              style={{
                display: 'flex',
                width: headerSideWidth,
                marginLeft: -spacing[3],
                paddingLeft: 0,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                paddingVertical: spacing[2],
              }}
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                color={palettes.primary[500]}
                style={{ width: 11.421, height: 19.878 }}
              />
            </TouchableOpacity>
          ),
      headerTitle: () => (
        <Text
          variant="heading"
          style={{
            fontSize: 16,
            color: dark ? palettes.gray[50] : palettes.primary[700],
            fontWeight: fontWeights.medium,
            textAlign: 'center',
            fontFamily: fontFamilies.body,
            fontStyle: 'normal',
          }}
          numberOfLines={1}
        >
          {headerTitle}
        </Text>
      ),
      headerRight: () =>
        tab === 'Info' ? (
          <View
            style={{
              width: headerSideWidth,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconButton
              icon={faSliders}
              color={palettes.primary[400]}
              size={fontSizes.lg}
              accessibilityLabel={t('common.preferences')}
              hitSlop={{ left: spacing[3], right: spacing[3] }}
            />
          </View>
        ) : (
          <View style={{ width: headerSideWidth }} />
        ),
    });
  }, [
    tab,
    headerSideWidth,
    showPlusButton, // 🔥 Trigga il re-render dell'header
    fontSizes.lg,
    fontSizes.md,
    navigation,
    spacing,
    fontFamilies.body,
    fontWeights.medium,
    t,
    dark,
    palettes.primary,
    palettes.gray,
    headerTitle,
  ]);

  return (
    <TopTabs.Navigator tabBar={props => <CourseTopTabBar {...props} />}>
      <TopTabs.Screen
        name="CourseInfoScreen"
        component={CourseInfoScreen}
        options={{ title: 'Info' }}
        listeners={{
          tabPress: () => {
            setShowPlusButton(false);
            setTab('Info');
            setFormPage('');
          },
          focus: () => {
            setShowPlusButton(false);
            setFormPage('');
            setTab('Info');
          },
        }}
      />
      <TopTabs.Screen
        name="CourseStaffScreen"
        component={StaffScreen}
        options={{ title: t('courseStaffTab.title') }}
        listeners={{
          tabPress: () => {
            setShowPlusButton(false);
            setFormPage('');
            setTab('Staff');
          },
          focus: () => {
            setShowPlusButton(false);
            setFormPage('');
            setTab('Staff');
          },
        }}
      />
      <TopTabs.Screen
        name="CourseNoticesScreen"
        component={CourseNoticesTab}
        options={{ title: t('common.notice_plural') }}
        listeners={{
          tabPress: () => {
            setShowPlusButton(false);
            setFormPage('');
            setTab('Notices');
          },
          focus: () => {
            setShowPlusButton(false);
            setFormPage('');
            setTab('Notices');
          },
        }}
      />
      <TopTabs.Screen
        name="CourseFilesScreen"
        component={FileNavigator}
        options={{ title: t('courseFilesTab.title') }}
        listeners={{
          tabPress: () => {
            setShowPlusButton(true);
            setFormPage('Files');
            setTab('Files');
          },
          focus: () => {
            setShowPlusButton(true);
            setFormPage('Files');
            setTab('Files');
          },
        }}
      />
      <TopTabs.Screen
        name="CourseLecturesScreen"
        component={CourseLecturesTab}
        options={{ title: t('common.lecture_plural') }}
        listeners={{
          tabPress: () => {
            setShowPlusButton(true);
            setFormPage('Lecture');
            setTab('Lectures');
          },
          focus: () => {
            setShowPlusButton(true);
            setFormPage('Lecture');
            setTab('Lectures');
          },
        }}
      />
      <TopTabs.Screen
        name="CourseStudentsScreen"
        component={CourseStudentsTab}
        options={{ title: t('other.students') }}
        listeners={{
          tabPress: () => {
            setShowPlusButton(false);
            setFormPage('Students');
            setTab('Students');
          },
          focus: () => {
            setShowPlusButton(false);
            setFormPage('Students');
            setTab('Students');
          },
        }}
      />
      <TopTabs.Screen
        name="CourseAssignmentsScreen"
        component={CourseAssignmentsTab}
        options={{ title: t('courseAssignmentsTab.title') }}
        listeners={{
          tabPress: () => {
            setShowPlusButton(false);
            setFormPage('');
            setTab('Assignments');
          },
          focus: () => {
            setShowPlusButton(false);
            setFormPage('');
            setTab('Assignments');
          },
        }}
      />
    </TopTabs.Navigator>
  );
};
