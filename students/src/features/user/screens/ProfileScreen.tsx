import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, View } from 'react-native';

import {
  faAngleDown,
  faBell,
  faCog,
  faMessage,
  faSignOut,
} from '@fortawesome/free-solid-svg-icons';
import { useOfflineDisabled } from '@polito/lib/core';
import {
  BottomBarSpacer,
  CtaButton,
  Icon,
  ListItem,
  OverviewList,
  RefreshControl,
  Row,
  Section,
  SectionHeader,
  StatefulMenuView,
  Text,
  UnreadBadge,
  useTheme,
} from '@polito/lib/ui';
import { AuthProfile } from '@polito/student-api-client';
import { MenuAction, NativeActionEvent } from '@react-native-menu/menu';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';

import {
  filterUnread,
  hasUnreadMessages,
} from '../../../../src/utils/messages';
import { CardSwiper } from '../../../core/components/CardSwiper';
import {
  useLogout,
  useMfaChallengeHandler,
  useSwitchCareer,
} from '../../../core/queries/authHooks';
import { useEscGet } from '../../../core/queries/escHooks';
import {
  MESSAGES_QUERY_KEY,
  useGetMessages,
  useGetProfile,
  useGetSmartCard,
  useGetStudent,
} from '../../../core/queries/studentHooks';
import { CareerStatus } from '../components/CareerStatus';
import { UserStackParamList } from '../components/UserNavigator';

type Props = NativeStackScreenProps<UserStackParamList, 'Profile'>;

type UserDetailsProps = {
  profile?: AuthProfile;
};

const UserDetails = ({ profile }: UserDetailsProps) => {
  const { t } = useTranslation();
  const { spacing, fontSizes } = useTheme();

  return (
    <Section accessible={false} style={{ marginTop: spacing[3] }}>
      <SectionHeader
        title={profile?.lastName + ' ' + profile?.firstName}
        subtitle={t('common.shortUsername') + ' ' + profile?.username}
        titleStyle={{ fontSize: fontSizes.xl }}
        subtitleStyle={{ fontSize: fontSizes.lg }}
      />
    </Section>
  );
};

const HeaderRightDropdown = ({
  profile,
  isOffline,
}: {
  profile?: AuthProfile;
  isOffline: boolean;
}) => {
  const { mutate } = useSwitchCareer();
  const { t } = useTranslation();
  const { palettes, spacing } = useTheme();
  const username = profile?.username || '';
  const allCareerIds = useMemo(
    () => profile?.allUsernames ?? [],
    [profile?.allUsernames],
  );
  const canSwitchCareer = allCareerIds.length > 1 && !isOffline;
  const actions = useMemo((): MenuAction[] => {
    if (!canSwitchCareer) return [];

    return allCareerIds.map(careerId => {
      return {
        id: careerId,
        title: careerId,
        state: careerId === username ? 'on' : undefined,
      };
    });
  }, [canSwitchCareer, allCareerIds, username]);

  const onPressAction = ({ nativeEvent: { event } }: NativeActionEvent) => {
    if (event === username) return;
    mutate({ username: event });
  };

  return (
    <View
      style={{ padding: spacing[2] }}
      accessible={true}
      accessibilityRole={canSwitchCareer ? 'button' : 'text'}
      accessibilityLabel={`${t('common.username')} ${username} ${
        canSwitchCareer ? t('common.switchCareerLabel') : ''
      }`}
    >
      <StatefulMenuView actions={actions} onPressAction={onPressAction}>
        <Row>
          <Text variant="link" style={{ marginRight: 5 }}>
            {username}
          </Text>
          {canSwitchCareer && (
            <Icon icon={faAngleDown} color={palettes.primary[500]} />
          )}
        </Row>
      </StatefulMenuView>
    </View>
  );
};

export const ProfileScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const { firstRequest } = route.params;
  const { fontSizes } = useTheme();
  const { mutate: handleLogout } = useLogout();
  const profileQuery = useGetProfile();
  const profile = profileQuery.data;
  const studentQuery = useGetStudent();
  const student = studentQuery.data;
  const escQuery = useEscGet();
  const esc = escQuery.data;
  const smartCardQuery = useGetSmartCard();
  const smartCardUrl = smartCardQuery.data?.url;
  const queryClient = useQueryClient();
  const messages = useGetMessages();
  const mfaChallengeQuery = useMfaChallengeHandler();

  const enrollmentYear = useMemo(() => {
    if (!student) return '...';
    return `${student.firstEnrollmentYear - 1}/${student.firstEnrollmentYear}`;
  }, [student]);

  const areMessagesMissing = useCallback(
    () => queryClient.getQueryData(MESSAGES_QUERY_KEY) === undefined,
    [queryClient],
  );
  const areMessagesDisabled = useOfflineDisabled(areMessagesMissing);

  const isOffline = useOfflineDisabled();

  const headerRight = useCallback(
    () => <HeaderRightDropdown profile={profile} isOffline={isOffline} />,
    [isOffline, profile],
  );

  useEffect(() => {
    navigation.setOptions({ headerRight });
  }, [headerRight, navigation]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl
          manual
          queries={[profileQuery, studentQuery, escQuery, mfaChallengeQuery]}
        />
      }
    >
      <SafeAreaView>
        <View
          accessible={true}
          accessibilityLabel={`${t('profileScreen.smartCard')}. ${t(
            'common.username',
          )} ${profile?.username?.substring(1, profile?.username?.length)}, ${
            profile?.firstName
          } ${profile?.lastName}`}
        >
          {!profile ||
          smartCardQuery.isLoading ||
          escQuery.isLoading ? null : smartCardUrl ||
            (esc && (esc.canBeRequested || esc.details)) ? (
            <CardSwiper
              firstName={profile.firstName}
              lastName={profile.lastName}
              username={profile.username}
              smartCardUrl={smartCardUrl}
              europeanStudentCard={esc}
              firstRequest={firstRequest}
            />
          ) : (
            <UserDetails profile={profile} />
          )}
        </View>
        <Section accessible={false}>
          <SectionHeader
            title={t('common.career')}
            trailingItem={
              student?.status && <CareerStatus status={student?.status} />
            }
          />
          <OverviewList>
            <ListItem
              title={student?.degreeName ?? ''}
              subtitle={student?.degreeLevel + ' - ' + enrollmentYear}
              linkTo={{
                screen: 'Degree',
                params: {
                  id: student?.degreeId,
                  year: student?.firstEnrollmentYear,
                },
              }}
            />
          </OverviewList>
          <OverviewList indented>
            <ListItem
              title={t('notificationsScreen.title')}
              leadingItem={<Icon icon={faBell} size={fontSizes.xl} />}
              linkTo="Notifications"
            />
            <ListItem
              title={t('profileScreen.settings')}
              leadingItem={<Icon icon={faCog} size={fontSizes.xl} />}
              linkTo="Settings"
            />
            <ListItem
              title={t('messagesScreen.title')}
              leadingItem={<Icon icon={faMessage} size={fontSizes.xl} />}
              linkTo="Messages"
              disabled={areMessagesDisabled}
              trailingItem={
                messages.data && hasUnreadMessages(messages.data) ? (
                  <UnreadBadge text={filterUnread(messages.data).length} />
                ) : undefined
              }
            />
          </OverviewList>
          <CtaButton
            absolute={false}
            disabled={isOffline}
            title={t('common.logout')}
            action={handleLogout}
            icon={faSignOut}
          />
        </Section>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};
