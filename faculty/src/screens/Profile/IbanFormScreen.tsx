import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  faCalendar,
  faIdCard,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import { CtaButton, Theme, useHideTabs, useStylesheet } from '@polito/lib/ui';
import { types } from '@react-native-documents/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useCourses } from '../../core/contexts/CoursesContext';
import {
  FormNote,
  ProfileFieldDate,
  ProfileFieldInput,
  ProfileFieldRow,
  ProfileFieldSelect,
  UploadRow,
  confirmAlert,
  countries,
  pickFileName,
} from './ProfileFormFields';
import { ProfileStackParamList } from './ProfileNavigator';

type Circuit = 'SEPA' | 'OTHER';

const italianBanks: Record<string, string> = {
  '03069': 'Intesa Sanpaolo',
  '02008': 'UniCredit',
  '05034': 'Banco BPM',
};

const ITALIAN_IBAN = /^IT\d{2}[A-Z]\d{10}[0-9A-Z]{12}$/;
const FOREIGN_IBAN = /^[A-Z]{2}\d{2}[0-9A-Z]{11,30}$/;

type Props = NativeStackScreenProps<ProfileStackParamList, 'IbanForm'>;

export const IbanFormScreen = ({ navigation }: Props) => {
  const { t, i18n } = useTranslation();
  const styles = useStylesheet(createStyles);
  const { bottom } = useSafeAreaInsets();
  const { user, setUser } = useCourses();
  const [circuit, setCircuit] = useState<Circuit>('SEPA');
  const [validFrom, setValidFrom] = useState<Date>();
  const [account, setAccount] = useState('');
  const [nationId, setNationId] = useState<string>();
  const [bic, setBic] = useState('');
  const [bankDescription, setBankDescription] = useState('');
  const [document, setDocument] = useState<string>();

  useHideTabs();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('personalInfoScreen.edit', { field: 'IBAN' }),
    });
  }, [navigation, t]);

  const lang = i18n.language === 'it' ? 'it' : 'en';
  const normalized = account.replace(/\s/g, '').toUpperCase();
  const isSepa = circuit === 'SEPA';
  const isItalian = isSepa && ITALIAN_IBAN.test(normalized);
  const isForeignIban =
    isSepa && !normalized.startsWith('IT') && FOREIGN_IBAN.test(normalized);
  const ibanNationCode = normalized.slice(0, 2);
  const ibanNation =
    countries.find(n => n.id === ibanNationCode)?.[lang] ?? ibanNationCode;
  const italianBank = isItalian
    ? italianBanks[normalized.slice(5, 10)]
    : undefined;
  const needsBankDetails = !isSepa || isForeignIban;
  const needsItalianBankDescription = isItalian && !italianBank;
  const accountLabel = isSepa ? 'IBAN' : t('personalInfoForm.accountNumber');

  const isValid =
    !!validFrom &&
    !!document &&
    (isSepa
      ? (isItalian && (!!italianBank || !!bankDescription.trim())) ||
        (isForeignIban && !!bic.trim() && !!bankDescription.trim())
      : !!normalized && !!nationId && !!bic.trim() && !!bankDescription.trim());

  const pickDocument = async () => {
    const name = await pickFileName([types.pdf, types.images]);
    if (name) setDocument(name);
  };

  const save = () => {
    setUser({
      ...user,
      IBAN: normalized,
      bankDescription: italianBank ?? bankDescription.trim(),
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
            label={t('personalInfoForm.circuit')}
            required
            icon={faLocationDot}
            value={isSepa ? 'IBAN/SEPA' : t('personalInfoForm.circuitOther')}
            selectedId={circuit}
            options={[
              { id: 'SEPA', title: 'IBAN/SEPA' },
              { id: 'OTHER', title: t('personalInfoForm.circuitOther') },
            ]}
            onSelect={id => setCircuit(id as Circuit)}
          />
          <ProfileFieldDate
            label={t('personalInfoForm.validityDate')}
            required
            icon={faCalendar}
            value={validFrom}
            onChange={setValidFrom}
          />
        </ProfileFieldRow>
        <ProfileFieldInput
          label={accountLabel}
          required
          value={account}
          onChangeText={setAccount}
          onClear={() => setAccount('')}
          autoCapitalize="characters"
          autoCorrect={false}
          hint={t(
            isSepa
              ? 'personalInfoForm.ibanHint'
              : 'personalInfoForm.accountNumberHint',
          )}
          autoFocus
        />
        {italianBank && (
          <ProfileFieldSelect
            label={t('personalInfoForm.bankDescription')}
            value={italianBank}
          />
        )}
        {needsItalianBankDescription && (
          <ProfileFieldInput
            label={t('personalInfoForm.bankDescription')}
            required
            placeholder="-"
            value={bankDescription}
            onChangeText={setBankDescription}
          />
        )}
        {needsBankDetails && (
          <>
            <ProfileFieldRow>
              {isSepa ? (
                <ProfileFieldSelect
                  label={t('personalInfoForm.nation')}
                  value={ibanNation}
                />
              ) : (
                <ProfileFieldSelect
                  label={t('personalInfoForm.nation')}
                  required
                  placeholder={t('personalInfoForm.select')}
                  value={countries.find(n => n.id === nationId)?.[lang]}
                  selectedId={nationId}
                  options={countries.map(n => ({ id: n.id, title: n[lang] }))}
                  onSelect={setNationId}
                />
              )}
              <ProfileFieldInput
                label={t('personalInfoForm.bic')}
                required
                placeholder="-"
                value={bic}
                onChangeText={setBic}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </ProfileFieldRow>
            <ProfileFieldInput
              label={t('personalInfoForm.bankDescription')}
              required
              placeholder="-"
              value={bankDescription}
              onChangeText={setBankDescription}
            />
            <FormNote>{t('personalInfoForm.bankNotes')}</FormNote>
          </>
        )}
        <View style={styles.upload}>
          <UploadRow
            icon={faIdCard}
            title={`${t('personalInfoForm.idDocument')}*`}
            subtitle={document ?? t('personalInfoForm.idDocumentFormats')}
            uploaded={!!document}
            onPress={pickDocument}
          />
        </View>
        <FormNote>{t('personalInfoForm.ibanNote')}</FormNote>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: bottom }]}>
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

const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      padding: spacing[4],
      gap: spacing[2.5],
    },
    upload: {
      marginTop: spacing[2],
    },
    footer: {
      backgroundColor: colors.background,
    },
  });
