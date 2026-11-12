import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { faCalendar, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import {
  CtaButton,
  Text,
  Theme,
  useHideTabs,
  useStylesheet,
} from '@polito/lib/ui';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import {
  CheckboxRow,
  FormNote,
  ProfileFieldDate,
  ProfileFieldInput,
  ProfileFieldRow,
  ProfileFieldSelect,
  confirmAlert,
  countries,
} from './ProfileFormFields';
import { ProfileStackParamList } from './ProfileNavigator';

const ITALY = 'IT';

const municipalities = [
  { id: 'Torino', province: 'TO', postalCodes: ['10121', '10123', '10129'] },
  { id: 'Milano', province: 'MI', postalCodes: ['20121', '20122', '20133'] },
  { id: 'Roma', province: 'RM', postalCodes: ['00118', '00184', '00185'] },
];

export type AddressTarget = 'residence' | 'mailing' | 'tax';

const targetTitleKeys: Record<AddressTarget, string> = {
  residence: 'personalInfoScreen.residence',
  mailing: 'personalInfoScreen.mailingAddress',
  tax: 'personalInfoScreen.taxDomicile',
};

const targetUserKeys = {
  residence: 'domicilie',
  mailing: 'mailingAddress',
  tax: 'taxDomicilie',
} as const;

type Props = NativeStackScreenProps<ProfileStackParamList, 'AddressForm'>;

export const AddressFormScreen = ({ navigation, route }: Props) => {
  const { target } = route.params;
  const { t, i18n } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { bottom } = useSafeAreaInsets();
  const { user, setUser } = useCourses();
  const [countryId, setCountryId] = useState(ITALY);
  const [validFrom, setValidFrom] = useState<Date>();
  const [street, setStreet] = useState('');
  const [municipalityId, setMunicipalityId] = useState<string>();
  const [district, setDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [useForMailing, setUseForMailing] = useState(false);
  const [useForTax, setUseForTax] = useState(false);
  const [declared, setDeclared] = useState(false);

  useHideTabs();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('personalInfoScreen.edit', {
        field: t(targetTitleKeys[target]).toLowerCase(),
      }),
    });
  }, [navigation, t, target]);

  const isResidence = target === 'residence';
  const needsDeclaration = target !== 'mailing';

  const isItaly = countryId === ITALY;
  const lang = i18n.language === 'it' ? 'it' : 'en';
  const country = countries.find(c => c.id === countryId)!;
  const municipality = municipalities.find(m => m.id === municipalityId);
  const select = t('personalInfoForm.select');

  const isValid =
    !!street.trim() &&
    !!postalCode.trim() &&
    (isItaly ? !!municipality : !!city.trim()) &&
    (!needsDeclaration || (!!validFrom && declared));

  const save = () => {
    const address = isItaly
      ? [
          street,
          district,
          postalCode,
          `${municipality!.id} (${municipality!.province})`,
        ]
      : [street, postalCode, city, country[lang]];
    const formatted = address.filter(Boolean).join(', ');
    setUser({
      ...user,
      [targetUserKeys[target]]: formatted,
      ...(isResidence && useForMailing && { mailingAddress: formatted }),
      ...(isResidence && useForTax && { taxDomicilie: formatted }),
    });
    navigation.goBack();
  };

  const confirmSave = () =>
    confirmAlert(t, t('personalInfoScreen.requestAlert'), save);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
      >
        <ProfileFieldRow>
          <ProfileFieldSelect
            label={t('personalInfoForm.country')}
            required
            icon={faLocationDot}
            value={country[lang]}
            selectedId={countryId}
            options={countries.map(c => ({ id: c.id, title: c[lang] }))}
            onSelect={id => {
              setCountryId(id);
              setMunicipalityId(undefined);
              setPostalCode('');
            }}
          />
          <ProfileFieldDate
            label={t('personalInfoForm.validityDate')}
            required={needsDeclaration}
            icon={faCalendar}
            value={validFrom}
            onChange={setValidFrom}
          />
        </ProfileFieldRow>
        <ProfileFieldInput
          label={t('personalInfoForm.address')}
          required
          placeholder={t('personalInfoForm.addressPlaceholder')}
          value={street}
          onChangeText={setStreet}
          autoFocus
        />
        {isItaly ? (
          <>
            <ProfileFieldRow>
              <ProfileFieldSelect
                label={t('personalInfoForm.municipality')}
                required
                placeholder={select}
                value={municipality?.id}
                selectedId={municipalityId}
                options={municipalities.map(m => ({ id: m.id, title: m.id }))}
                onSelect={id => {
                  setMunicipalityId(id);
                  setPostalCode('');
                }}
              />
              <ProfileFieldInput
                label={t('personalInfoForm.district')}
                placeholder="-"
                value={district}
                onChangeText={setDistrict}
              />
            </ProfileFieldRow>
            <ProfileFieldRow>
              <ProfileFieldSelect
                label={t('personalInfoForm.province')}
                required
                value={municipality?.province}
              />
              <ProfileFieldSelect
                label={t('personalInfoForm.postalCode')}
                required
                placeholder={municipality ? select : undefined}
                value={postalCode}
                selectedId={postalCode}
                options={(municipality?.postalCodes ?? []).map(code => ({
                  id: code,
                  title: code,
                }))}
                onSelect={setPostalCode}
              />
            </ProfileFieldRow>
          </>
        ) : (
          <ProfileFieldRow>
            <ProfileFieldInput
              label={t('personalInfoForm.city')}
              required
              placeholder="-"
              value={city}
              onChangeText={setCity}
            />
            <ProfileFieldInput
              label={t('personalInfoForm.postalCode')}
              required
              placeholder="-"
              value={postalCode}
              onChangeText={setPostalCode}
              autoCapitalize="characters"
            />
          </ProfileFieldRow>
        )}

        {isResidence && (
          <>
            <Text style={styles.alsoUse}>
              {t('personalInfoForm.alsoUseFor')}
            </Text>
            <View style={styles.checkboxes}>
              <CheckboxRow
                label={t('personalInfoScreen.mailingAddress')}
                checked={useForMailing}
                onToggle={() => setUseForMailing(prev => !prev)}
              />
              <CheckboxRow
                label={t('personalInfoForm.useForTax')}
                checked={useForTax}
                onToggle={() => setUseForTax(prev => !prev)}
              />
            </View>
            <FormNote>{t('personalInfoForm.alsoUseNote')}</FormNote>
          </>
        )}
        {target !== 'mailing' && (
          <>
            <FormNote>{t('personalInfoForm.taxNote')}</FormNote>
            {!isItaly && (
              <FormNote>{t('personalInfoForm.taxNoteAbroad')}</FormNote>
            )}
          </>
        )}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: bottom }]}>
        {needsDeclaration && (
          <View style={styles.declaration}>
            <CheckboxRow
              i18nKey="personalInfoForm.declaration"
              checked={declared}
              onToggle={() => setDeclared(prev => !prev)}
            />
          </View>
        )}
        <CtaButton
          title={t('other.saveAndExit')}
          action={confirmSave}
          absolute={false}
          disabled={!isValid}
        />
      </View>
    </View>
  );
};

const createStyles = ({ colors, spacing, shapes, fontSizes }: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      padding: spacing[4],
      gap: spacing[2.5],
    },
    alsoUse: {
      marginTop: spacing[2],
      fontSize: fontSizes.md,
    },
    checkboxes: {
      paddingHorizontal: spacing[3],
    },
    footer: {
      backgroundColor: colors.background,
    },
    declaration: {
      marginHorizontal: spacing[4],
      marginTop: spacing[2],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
      borderRadius: shapes.lg,
      backgroundColor: colors.surface,
    },
  });
