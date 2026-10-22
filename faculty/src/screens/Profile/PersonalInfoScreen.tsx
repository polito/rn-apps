import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { faPen } from '@fortawesome/free-solid-svg-icons';
import {
  IconButton,
  ListItem,
  OverviewList,
  Section,
  Text,
  useBottomBarAwareStyles,
  useTheme,
} from '@polito/lib/ui';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import i18next from 'i18next';

import { useCourses } from '../../core/contexts/CoursesContext';
import { ProfileSectionKey, profileSectionFields } from './ProfileForm';
import { ProfileStackParamList } from './ProfileNavigator';

type Props = {
  section: ProfileSectionKey;
  titleKey: string;
};

const ProfileFieldsList = ({ section, titleKey }: Props) => {
  const { t } = useTranslation();
  const { colors, fontSizes, spacing } = useTheme();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const { user } = useCourses();

  useLayoutEffect(() => {
    const marginLeft = i18next.language === 'en' ? 80 : 65;
    navigation.setOptions({
      headerTitle: () => (
        <Text variant="heading" style={{ marginLeft }}>
          {t(titleKey)}
        </Text>
      ),
    });
  }, [navigation, t, titleKey]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}
    >
      <Section style={{ paddingTop: spacing[5] }}>
        <OverviewList indented>
          {profileSectionFields[section].map(field => {
            const title = t(field.titleKey);
            const onEdit = () =>
              navigation.navigate('ProfileForm', { section, field: field.key });

            return (
              <ListItem
                key={field.key}
                title={title}
                subtitle={user[field.key] || '-'}
                onPress={onEdit}
                trailingItem={
                  <IconButton
                    icon={faPen}
                    size={fontSizes.md}
                    color={colors.secondaryText}
                    onPress={onEdit}
                    accessibilityLabel={`${t('other.modify')} ${title}`}
                    adjustSpacing="right"
                  />
                }
              />
            );
          })}
        </OverviewList>
      </Section>
    </ScrollView>
  );
};

export const PersonalInfoScreen = () => (
  <ProfileFieldsList section="personalInfo" titleKey="other.personalInfo" />
);

export const ContactsScreen = () => (
  <ProfileFieldsList section="contacts" titleKey="contactsScreen.title" />
);
