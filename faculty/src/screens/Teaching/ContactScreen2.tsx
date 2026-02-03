import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import {
  faBookOpen,
  faEnvelope,
  faFileAlt,
  faPhone,
  faStar,
  faUser,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';
import {
  Col,
  Icon,
  IconButton,
  ListItem,
  Row,
  SectionHeader,
  Text,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib';
import { useNavigation } from '@react-navigation/native';

import { RoleListItem } from '../../core/components/RoleListItem';
import { SectionList } from '../../core/components/SectionList';
import { useCourses } from '../../core/contexts/CoursesContext';
import { useBottomBarAwareStyles } from '../../core/hooks/useBottomBarAwareStyles';

export const ContactScreen2 = () => {
  const { t, i18n } = useTranslation();
  const { spacing, colors, fontSizes } = useTheme();
  const navigation = useNavigation();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { selectedProfile, toggleFavoriteProfile } = useCourses();

  const [isFavorite, setIsFavorite] = useState(selectedProfile?.preferred);

  useLayoutEffect(() => {
    const marginLeft = i18n.language === 'en' ? -80 : -25;

    navigation.setOptions({
      headerTitle: () => (
        <Text
          variant="heading"
          style={{ textAlign: 'center', width: '100%', marginLeft }}
        >
          {t('common.contact')}
        </Text>
      ),
    });
  }, [navigation, colors, i18n.language, t]);

  if (!selectedProfile) return null;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}
    >
      <Row
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: spacing[4],
          marginTop: spacing[4],
        }}
      >
        <Text variant="title">
          {selectedProfile.name + ' ' + selectedProfile.surname}
        </Text>
        <IconButton
          icon={isFavorite ? faStar : faStarRegular}
          size={22}
          onPress={() => {
            setIsFavorite(prev => !prev);
            toggleFavoriteProfile();
          }}
        />
      </Row>

      <View style={{ paddingBottom: spacing[5] }} />

      <Row style={styles.profileRow}>
        <View style={styles.avatarCircle}>
          <Icon icon={faUser} size={48} color="#fff" />
        </View>
        <Col style={styles.infoColumn}>
          <Text variant="heading" style={{ marginBottom: 4, marginLeft: 20 }}>
            {t('personScreen.role')}
          </Text>
          <Text style={{ marginBottom: 4, marginLeft: 24 }}>
            {selectedProfile.role}
          </Text>
          <Text variant="heading" style={{ marginBottom: 4, marginLeft: 20 }}>
            {t('common.department')}
          </Text>
          <Text style={{ marginBottom: 4, marginLeft: 24 }}>
            {selectedProfile.department}
          </Text>
        </Col>
      </Row>

      <View style={{ paddingBottom: spacing[5] }} />

      {selectedProfile.role2 ? (
        <>
          <SectionHeader title={t('other.otherInfo')} />
          <SectionList>
            <RoleListItem
              title={t('other.otherInstitutionalRoles')}
              subtitle={selectedProfile.role2}
              leadingItem={<Icon icon={faUserTie} size={fontSizes.xl} />}
            />
            {selectedProfile.role3 && (
              <RoleListItem
                subtitle={selectedProfile.role3}
                leadingItem={<Icon icon={faUserTie} size={fontSizes.xl} />}
              />
            )}
            <ListItem
              title={t('personScreen.sector')}
              subtitle={selectedProfile.sector}
              leadingItem={<Icon icon={faUserTie} size={fontSizes.xl} />}
            />
          </SectionList>
        </>
      ) : null}

      <View style={{ paddingBottom: spacing[5] }} />

      <SectionHeader title={t('contactsScreen.title')} />
      <SectionList>
        <ListItem
          title={t('other.telephone')}
          subtitle={selectedProfile.phoneNumber.toString()}
          leadingItem={<Icon icon={faPhone} size={fontSizes.xl} />}
        />
        <ListItem
          title={t('common.email')}
          subtitle={selectedProfile.mail}
          leadingItem={<Icon icon={faEnvelope} size={fontSizes.xl} />}
        />
      </SectionList>

      <View style={{ paddingBottom: spacing[5] }} />

      <SectionHeader title={t('other.currentYearCourses')} />
      <SectionList>
        {selectedProfile.heldCourses.map((course, index) => (
          <ListItem
            key={index}
            title={course}
            leadingItem={<Icon icon={faBookOpen} size={fontSizes.xl} />}
            multilineTitle={true}
          />
        ))}
        {selectedProfile.collaboratingCourses.map((course, index) => (
          <ListItem
            key={index}
            title={course}
            leadingItem={<Icon icon={faBookOpen} size={fontSizes.xl} />}
            multilineTitle={true}
          />
        ))}
      </SectionList>

      <View style={{ paddingBottom: spacing[5] }} />

      {selectedProfile.publications?.length > 0 && (
        <>
          <SectionHeader title={t('other.publications')} />
          <SectionList>
            {selectedProfile.publications.map((pub, index) => (
              <ListItem
                key={index}
                title={pub}
                leadingItem={<Icon icon={faFileAlt} size={fontSizes.xl} />}
                multilineTitle={true}
              />
            ))}
          </SectionList>
        </>
      )}
    </ScrollView>
  );
};

const createStyles = ({ palettes, spacing }: Theme) =>
  StyleSheet.create({
    heading: {
      paddingTop: spacing[5],
      paddingHorizontal: spacing[4],
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    smartcardImage: {
      width: '100%',
      height: 200,
      marginVertical: spacing[3],
      alignSelf: 'center',
    },
    avatarCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: palettes.gray[400],
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: spacing[4],
      marginLeft: spacing[4],
    },
    profileRow: {
      marginHorizontal: spacing[4],
      marginBottom: spacing[4],
      alignItems: 'center',
    },

    infoColumn: {
      marginLeft: spacing[3],
    },
  });
