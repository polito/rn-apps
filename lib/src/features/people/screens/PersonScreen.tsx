import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import {
  faEnvelope,
  faLink,
  faPhone,
  faStar,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { PersonCourse, PhoneNumber } from '@polito/student-api-client';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { usePreferencesContext } from '../../../core/contexts/PreferencesContext';
import { useAccessibility } from '../../../core/hooks/useAccessibility';
import { useOfflineDisabled } from '../../../core/hooks/useOfflineDisabled';
import { useOpenInAppLink } from '../../../core/hooks/useOpenInAppLink';
import { notNullish } from '../../../core/utils/predicates';
import { BottomBarSpacer } from '../../../ui/components/BottomBarSpacer';
import { Col } from '../../../ui/components/Col';
import { Icon } from '../../../ui/components/Icon';
import { IconButton } from '../../../ui/components/IconButton';
import { ListItem } from '../../../ui/components/ListItem';
import { Metric } from '../../../ui/components/Metric';
import { OverviewList } from '../../../ui/components/OverviewList';
import { RefreshControl } from '../../../ui/components/RefreshControl';
import { Row } from '../../../ui/components/Row';
import { Section } from '../../../ui/components/Section';
import { SectionHeader } from '../../../ui/components/SectionHeader';
import { Text } from '../../../ui/components/Text';
import { useStylesheet } from '../../../ui/hooks/useStylesheet';
import { useTheme } from '../../../ui/hooks/useTheme';
import { Theme } from '../../../ui/types/Theme';
import { useGetPerson } from '../queries/peopleHooks';
import { PeoplePreferences, PeopleStackParamList } from '../types';
import {
  isPersonPreferred,
  toPersonOverview,
  togglePersonPreferred,
} from '../utils/peoplePreferences';

type Props = NativeStackScreenProps<PeopleStackParamList, 'Person'> & {
  /** Whether to show the preferred/favorite contact toggle. */
  showPreferredContacts?: boolean;
};

const profileImageSize = 120;

export const PersonScreen = ({
  route,
  showPreferredContacts = true,
}: Props) => {
  const { id } = route.params;
  const { t } = useTranslation();
  const { colors, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);
  const personQuery = useGetPerson(id);
  const { peoplePreferred = [], updatePreference } =
    usePreferencesContext<PeoplePreferences>();
  const { accessibilityListLabel } = useAccessibility();
  const openInAppLink = useOpenInAppLink();
  const person = personQuery.data;
  const isPreferred = person
    ? isPersonPreferred(peoplePreferred, person.id)
    : false;

  const onTogglePreferred = useCallback(() => {
    if (!person) return;
    updatePreference(
      'peoplePreferred',
      togglePersonPreferred(peoplePreferred, toPersonOverview(person)),
    );
  }, [person, peoplePreferred, updatePreference]);
  const fullName = [person?.firstName, person?.lastName]
    .filter(notNullish)
    .join(' ');
  const courses = person?.courses ?? [];
  const phoneNumbers = person?.phoneNumbers;

  const isOffline = useOfflineDisabled();

  const header = (
    <Col ph={5} gap={6} mb={6}>
      <Row align="center" justify="space-between">
        <Text weight="bold" variant="title" style={styles.title}>
          {fullName}
        </Text>
        {person && showPreferredContacts && (
          <IconButton
            icon={isPreferred ? faStar : faStarRegular}
            size={22}
            onPress={onTogglePreferred}
            accessibilityLabel={t(
              isPreferred
                ? 'contactsScreen.removePreferred'
                : 'contactsScreen.addPreferred',
            )}
          />
        )}
      </Row>
      {(!person ||
        person?.picture ||
        person?.role ||
        person?.facilityShortName ||
        person?.profileUrl) && (
        <Row gap={6}>
          <View accessible={true} accessibilityLabel={t('common.profilePic')}>
            {person?.picture ? (
              <Image
                source={{ uri: person.picture }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon
                  icon={faUser}
                  size={fontSizes['3xl']}
                  color={colors.title}
                />
              </View>
            )}
          </View>
          <Col style={styles.info}>
            {person?.role && (
              <Metric
                title={t('personScreen.role')}
                value={person.role}
                style={styles.spaceBottom}
                accessible={true}
              />
            )}
            {person?.facilityShortName && (
              <Metric
                title={t('personScreen.department')}
                value={person.facilityShortName}
                style={styles.spaceBottom}
                accessible={true}
              />
            )}

            {person?.profileUrl && (
              <TouchableOpacity
                onPress={() => openInAppLink(person.profileUrl)}
                accessible={true}
                accessibilityRole="link"
              >
                <Row align="center">
                  <Icon
                    icon={faLink}
                    size={20}
                    color={colors.link}
                    style={styles.linkIcon}
                  />
                  <Text variant="link">{t('personScreen.moreInfo')}</Text>
                </Row>
              </TouchableOpacity>
            )}
          </Col>
        </Row>
      )}
    </Col>
  );

  const renderPhoneNumber = (phoneNumber: PhoneNumber, index: number) => {
    return (
      <ListItem
        key={index}
        isAction
        leadingItem={<Icon icon={faPhone} size={fontSizes.xl} />}
        title={t('common.phone')}
        subtitle={[phoneNumber.full, phoneNumber?.internal]
          .filter(notNullish)
          .join(' / ')}
        onPress={() => Linking.openURL(`tel:${phoneNumber.full}`)}
      />
    );
  };

  interface RenderedCourseProps {
    course: PersonCourse;
    index: number;
    disabled: boolean;
  }

  const RenderedCourse = ({ course, index, disabled }: RenderedCourseProps) => {
    const role = course.role === 'Titolare' ? 'roleHolder' : 'roleCollaborator';

    return (
      <ListItem
        title={course.name}
        subtitle={`${course.year} - ${t('common.' + role)}`}
        isAction
        accessibilityLabel={`${accessibilityListLabel(
          index,
          courses?.length || 0,
        )}. ${course.name}, ${course.year} -${t('common.' + role)}`}
        linkTo={{
          screen: 'DegreeCourse',
          params: {
            courseShortcode: course.shortcode,
            year: course.year,
          },
        }}
        disabled={disabled}
      />
    );
  };

  return (
    <ScrollView
      refreshControl={<RefreshControl queries={[personQuery]} manual />}
      contentInsetAdjustmentBehavior="automatic"
    >
      <SafeAreaView>
        <Col pv={5}>
          {header}
          <Section>
            <SectionHeader
              title={t('personScreen.contacts')}
              accessibilityLabel={`${t('personScreen.contacts')}. ${
                phoneNumbers?.length && t('common.phoneContacts')
              }. ${t('personScreen.sentEmail')}`}
            />
            <OverviewList indented loading={personQuery.isLoading}>
              {phoneNumbers?.map(renderPhoneNumber)}
              <ListItem
                isAction
                leadingItem={<Icon icon={faEnvelope} size={fontSizes.xl} />}
                title={t('common.email')}
                subtitle={person?.email}
                onPress={() => Linking.openURL(`mailto:${person?.email}`)}
              />
            </OverviewList>
          </Section>
          {courses.length > 0 && (
            <Section>
              <SectionHeader
                title={t('common.course_plural')}
                accessible={true}
                accessibilityLabel={`${t('personScreen.coursesLabel')}. ${t(
                  'personScreen.totalCourses',
                  { total: courses.length },
                )}`}
              />
              <OverviewList>
                {courses.map((course, index) => (
                  <RenderedCourse
                    key={course.id}
                    course={course}
                    index={index}
                    disabled={isOffline}
                  />
                ))}
              </OverviewList>
            </Section>
          )}
        </Col>
        <BottomBarSpacer />
      </SafeAreaView>
    </ScrollView>
  );
};

const createStyles = ({ spacing, colors, fontSizes }: Theme) => {
  const profileImage = {
    width: profileImageSize,
    height: profileImageSize,
    borderRadius: profileImageSize,
  };
  return StyleSheet.create({
    title: {
      fontSize: fontSizes['2xl'],
    },
    info: {
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'column',
    },
    profileImage,
    profileImagePlaceholder: {
      ...profileImage,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    spaceBottom: {
      marginBottom: spacing[2],
    },
    linkIcon: {
      marginRight: spacing[2],
    },
  });
};
