import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardTypeOptions,
  ScrollView,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CtaButton,
  SectionHeader,
  Theme,
  useHideTabs,
  useStylesheet,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import { ProfileFieldInput } from './ProfileFieldCard';
import { ProfileStackParamList } from './ProfileNavigator';

export type ProfileSectionKey = 'personalInfo' | 'contacts';

export type ProfileFieldKey =
  | 'domicilie'
  | 'taxDomicilie'
  | 'IBAN'
  | 'phone'
  | 'email'
  | 'privateMail';

type ProfileFieldConfig = {
  key: ProfileFieldKey;
  titleKey: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
};

export const profileSectionFields: Record<
  ProfileSectionKey,
  ProfileFieldConfig[]
> = {
  personalInfo: [
    { key: 'domicilie', titleKey: 'other.residence' },
    { key: 'taxDomicilie', titleKey: 'other.fiscalResidence' },
    { key: 'IBAN', titleKey: 'IBAN', autoCapitalize: 'characters' },
  ],
  contacts: [
    { key: 'phone', titleKey: 'other.telephone', keyboardType: 'phone-pad' },
    {
      key: 'email',
      titleKey: 'other.academicEmail',
      keyboardType: 'email-address',
      autoCapitalize: 'none',
    },
    {
      key: 'privateMail',
      titleKey: 'other.privateMail',
      keyboardType: 'email-address',
      autoCapitalize: 'none',
    },
  ],
};

const sectionTitleKeys: Record<ProfileSectionKey, string> = {
  personalInfo: 'other.personalInfo',
  contacts: 'other.contacts',
};

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileForm'>;

export const ProfileForm = ({ navigation, route }: Props) => {
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { user, setUser } = useCourses();
  const { bottom } = useSafeAreaInsets();
  const { section, field } = route.params ?? {};
  const sections: ProfileSectionKey[] = section
    ? [section]
    : ['personalInfo', 'contacts'];
  const [values, setValues] = useState<Record<ProfileFieldKey, string>>({
    domicilie: user.domicilie,
    taxDomicilie: user.taxDomicilie,
    IBAN: user.IBAN,
    phone: user.phone,
    email: user.email,
    privateMail: user.privateMail,
  });
  const [focusedField, setFocusedField] = useState<ProfileFieldKey>(
    field ?? profileSectionFields[sections[0]][0].key,
  );
  const inputRefs = useRef<Partial<Record<ProfileFieldKey, TextInput | null>>>(
    {},
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t(
        section ? sectionTitleKeys[section] : 'other.modifyProfile',
      ),
    });
  }, [navigation, t, section]);

  useHideTabs();

  const focusField = (key: ProfileFieldKey) => {
    setFocusedField(key);
    inputRefs.current[key]?.focus();
  };

  const handleSave = () => {
    setUser({ ...user, ...values });
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        {sections.map(sectionKey => (
          <Fragment key={sectionKey}>
            {!section && (
              <SectionHeader
                title={t(sectionTitleKeys[sectionKey])}
                separator={false}
              />
            )}
            {profileSectionFields[sectionKey].map(
              ({ key, titleKey, keyboardType, autoCapitalize }) => (
                <ProfileFieldInput
                  key={key}
                  ref={ref => {
                    inputRefs.current[key] = ref;
                  }}
                  title={t(titleKey)}
                  value={values[key]}
                  focused={focusedField === key}
                  onPress={() => focusField(key)}
                  onChangeText={text =>
                    setValues(prev => ({ ...prev, [key]: text }))
                  }
                  autoFocus={key === field}
                  keyboardType={keyboardType}
                  autoCapitalize={autoCapitalize}
                  returnKeyType="done"
                />
              ),
            )}
          </Fragment>
        ))}
      </ScrollView>
      <View style={{ paddingBottom: bottom }}>
        <CtaButton
          title={t('other.saveAndExit')}
          action={handleSave}
          absolute={false}
          disabled={!values.domicilie}
        />
      </View>
    </View>
  );
};

const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      padding: spacing[5],
      gap: spacing[2.5],
    },
  });
