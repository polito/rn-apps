import { ReactElement, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faAddressCard,
  faCircleQuestion,
  faCreditCard,
  faEnvelope,
  faFile,
} from '@fortawesome/free-regular-svg-icons';
import {
  faBuildingColumns,
  faHouse,
  faMobileScreen,
  faPaperclip,
  faPen,
  faPhone,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { RTFTrans } from '@polito/lib/features/auth';
import {
  Badge,
  BottomModal,
  Icon,
  IconButton,
  ListItem,
  OverviewList,
  Row,
  Section,
  SectionHeader,
  StatefulMenuView,
  Text,
  Theme,
  useBottomBarAwareStyles,
  useBottomModal,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { types } from '@react-native-documents/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { DateTime } from 'luxon';

import { User, useCourses } from '../../core/contexts/CoursesContext';
import { ContactKind, ContactSheet, InfoSheet } from './ContactSheet';
import { confirmAlert, pickFileName } from './ProfileFormFields';
import { ProfileStackParamList } from './ProfileNavigator';

type Props = NativeStackScreenProps<ProfileStackParamList, 'PersonalInfo'>;

type OptionalContactKey = 'pec' | 'homePhone' | 'residencePhone';

const optionalContacts: {
  key: OptionalContactKey;
  kind: ContactKind;
  icon: IconDefinition;
}[] = [
  { key: 'pec', kind: 'email', icon: faEnvelope },
  { key: 'homePhone', kind: 'phone', icon: faPhone },
  { key: 'residencePhone', kind: 'phone', icon: faPhone },
];

const formatDate = (iso: string) =>
  DateTime.fromISO(iso).toFormat('dd/MM/yyyy');

export const PersonalInfoScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const { colors, palettes, fontSizes } = useTheme();
  const styles = useStylesheet(createStyles);
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const { user, setUser } = useCourses();
  const { open, close, modal } = useBottomModal();

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: t('other.personalInfo') });
  }, [navigation, t]);

  const updateUser = (patch: Partial<User>) => setUser({ ...user, ...patch });

  const leading = (icon: IconDefinition) => (
    <Icon icon={icon} size={fontSizes.xl} color={colors.title} />
  );

  const trailing = (icon: IconDefinition) => (
    <Icon icon={icon} size={fontSizes.md} color={colors.secondaryText} />
  );

  const editableItem = ({
    title,
    subtitle,
    icon,
    onPress,
    trailingIcon = faPen,
  }: {
    title: string;
    subtitle?: string;
    icon: IconDefinition;
    onPress?: () => void;
    trailingIcon?: IconDefinition;
  }): ReactElement => (
    <ListItem
      key={title}
      title={title}
      subtitle={subtitle || '-'}
      subtitleProps={{ numberOfLines: 2 }}
      leadingItem={leading(icon)}
      trailingItem={onPress ? trailing(trailingIcon) : undefined}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${title}, ${subtitle || t('common.noValue')}`}
      accessibilityHint={
        onPress
          ? t(
              trailingIcon === faPen
                ? 'personalInfoScreen.edit'
                : 'personalInfoScreen.upload',
              { field: title },
            )
          : undefined
      }
    />
  );

  const openContactSheet = ({
    title,
    label,
    kind,
    value,
    confirmMessage,
    onConfirm,
    onDelete,
  }: {
    title: string;
    label: string;
    kind: ContactKind;
    value?: string;
    confirmMessage?: string;
    onConfirm: (value: string) => void;
    onDelete?: () => void;
  }) =>
    open(
      <ContactSheet
        title={title}
        label={label}
        kind={kind}
        initialValue={value}
        confirmMessage={confirmMessage}
        onConfirm={onConfirm}
        onDelete={onDelete}
        close={close}
      />,
    );

  const editContact = (
    key: 'website' | 'privateMail' | 'phone' | OptionalContactKey,
    labelKey: string,
    kind: ContactKind,
    options: { removable?: boolean; confirmMessage?: string } = {},
  ) => {
    const label = t(labelKey);
    const isNew = !user[key];
    openContactSheet({
      title:
        key === 'website'
          ? label
          : t(
              isNew
                ? 'personalInfoScreen.addContact'
                : 'personalInfoScreen.updateContact',
            ),
      label: key === 'website' ? t('personalInfoScreen.websiteUrl') : label,
      kind,
      value: user[key],
      confirmMessage: options.confirmMessage,
      onConfirm: value => updateUser({ [key]: value }),
      onDelete:
        options.removable && !isNew
          ? () => updateUser({ [key]: undefined })
          : undefined,
    });
  };

  const uploadCv = async (key: 'cvIt' | 'cvEn') => {
    const name = await pickFileName([types.pdf]);
    if (!name) return;
    confirmAlert(t, t('personalInfoScreen.cvAlert'), () =>
      updateUser({
        [key]: { name, uploadedAt: DateTime.now().toISODate()! },
      }),
    );
  };

  const infoButton = (section: string, content: ReactElement) => (
    <IconButton
      icon={faCircleQuestion}
      size={fontSizes.md}
      color={colors.link}
      accessibilityLabel={t('personalInfoScreen.sectionInfo', { section })}
      onPress={() =>
        open(
          <InfoSheet title={section} close={close}>
            {content}
          </InfoSheet>,
        )
      }
      adjustSpacing="right"
    />
  );

  const registryTitle = t('personalInfoScreen.registry');
  const institutionalTitle = t('personalInfoScreen.institutionalContacts');
  const missingOptionalContacts = optionalContacts.filter(c => !user[c.key]);

  const registryRows = [
    { label: t('personalInfoScreen.serialNumber'), value: user.serialNumber },
    { label: t('personalInfoScreen.fiscalCode'), value: user.fiscalCode },
    {
      label: t('personalInfoScreen.birth'),
      value:
        user.birthDate && user.birthPlace
          ? t('personalInfoScreen.birthValue', {
              date: formatDate(user.birthDate),
              place: user.birthPlace,
              interpolation: { escapeValue: false },
            })
          : user.birthDate
            ? formatDate(user.birthDate)
            : user.birthPlace,
    },
    {
      label: t('personalInfoScreen.civilStatus'),
      value: user.civilStatus,
    },
  ];

  return (
    <>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[bottomBarAwareStyles, styles.container]}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Section>
          <SectionHeader
            title={registryTitle}
            trailingItem={infoButton(
              registryTitle,
              <RTFTrans
                i18nKey="personalInfoScreen.registryInfo"
                style={styles.infoText}
              />,
            )}
          />
          <OverviewList indented dividers={false}>
            {registryRows.map(row => (
              <Row
                key={row.label}
                justify="space-between"
                gap={4}
                style={styles.registryRow}
                accessible
                accessibilityLabel={`${row.label}: ${row.value || t('common.noValue')}`}
              >
                <Text style={styles.registryLabel}>{row.label}</Text>
                <Text weight="semibold" style={styles.registryValue}>
                  {row.value || '-'}
                </Text>
              </Row>
            ))}
          </OverviewList>
          <View style={styles.residence}>
            <OverviewList indented>
              {editableItem({
                title: t('personalInfoScreen.residence'),
                subtitle: user.domicilie,
                icon: faHouse,
              })}
            </OverviewList>
          </View>
        </Section>

        <Section>
          <SectionHeader title={t('personalInfoScreen.websiteAndCv')} />
          <OverviewList indented>
            {editableItem({
              title: t('personalInfoScreen.website'),
              subtitle: user.website,
              icon: faEnvelope,
              onPress: () =>
                editContact('website', 'personalInfoScreen.website', 'url', {
                  confirmMessage: t('personalInfoScreen.websiteAlert'),
                }),
            })}
            {(['cvIt', 'cvEn'] as const).map(key =>
              editableItem({
                title: t(`personalInfoScreen.${key}`),
                subtitle: user[key]
                  ? t('personalInfoScreen.uploadedOn', {
                      date: formatDate(user[key]!.uploadedAt),
                      interpolation: { escapeValue: false },
                    })
                  : t('personalInfoScreen.notUploaded'),
                icon: faFile,
                trailingIcon: faPaperclip,
                onPress: () => uploadCv(key),
              }),
            )}
          </OverviewList>
        </Section>

        <Section>
          <SectionHeader
            title={institutionalTitle}
            trailingItem={infoButton(
              institutionalTitle,
              <>
                <Text style={styles.infoText}>
                  {t('personalInfoScreen.institutionalInfo')}
                </Text>
                {(['Mobile', 'Phone', 'Email'] as const).map(kind => (
                  <Text key={kind} style={styles.infoText}>
                    {'• '}
                    <RTFTrans
                      i18nKey={`personalInfoScreen.institutionalInfo${kind}`}
                      style={styles.infoText}
                    />
                  </Text>
                ))}
              </>,
            )}
          />
          <OverviewList indented>
            {user.institutionalContacts.map(contact => {
              const title = t(
                contact.type === 'email'
                  ? 'personalInfoScreen.institutionalEmail'
                  : 'personalInfoScreen.institutionalPhone',
              );
              const visibility = t(
                contact.isPublic
                  ? 'personalInfoScreen.public'
                  : 'personalInfoScreen.hidden',
              );
              return (
                <ListItem
                  key={contact.id}
                  title={title}
                  subtitle={contact.value || '-'}
                  leadingItem={leading(
                    contact.type === 'email' ? faEnvelope : faPhone,
                  )}
                  accessibilityLabel={`${title}, ${contact.value || t('common.noValue')}, ${visibility}`}
                  trailingItem={
                    <Badge
                      text={visibility}
                      backgroundColor={
                        contact.isPublic
                          ? palettes.success[100]
                          : palettes.danger[100]
                      }
                      foregroundColor={
                        contact.isPublic
                          ? palettes.success[700]
                          : palettes.danger[700]
                      }
                    />
                  }
                />
              );
            })}
          </OverviewList>
        </Section>

        <Section>
          <SectionHeader
            title={t('personalInfoScreen.personalContacts')}
            trailingItem={
              missingOptionalContacts.length > 0 ? (
                <StatefulMenuView
                  actions={missingOptionalContacts.map(c => ({
                    id: c.key,
                    title: t(`personalInfoScreen.${c.key}`),
                  }))}
                  onPressAction={({ nativeEvent: { event } }) => {
                    const contact = optionalContacts.find(c => c.key === event);
                    if (!contact) return;
                    editContact(
                      contact.key,
                      `personalInfoScreen.${contact.key}`,
                      contact.kind,
                    );
                  }}
                >
                  <Row
                    align="center"
                    gap={1}
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={t('personalInfoScreen.add')}
                    accessibilityHint={t('personalInfoScreen.addContactHint')}
                  >
                    <Text variant="link">{t('personalInfoScreen.add')}</Text>
                    <Icon
                      icon={faPlus}
                      size={fontSizes.sm}
                      color={colors.link}
                    />
                  </Row>
                </StatefulMenuView>
              ) : undefined
            }
          />
          <OverviewList indented>
            {editableItem({
              title: t('personalInfoScreen.privateMail'),
              subtitle: user.privateMail,
              icon: faEnvelope,
              onPress: () =>
                editContact(
                  'privateMail',
                  'personalInfoScreen.privateMail',
                  'email',
                ),
            })}
            {editableItem({
              title: t('personalInfoScreen.mobile'),
              subtitle: user.phone,
              icon: faMobileScreen,
              onPress: () =>
                editContact('phone', 'personalInfoScreen.mobile', 'phone'),
            })}
            {editableItem({
              title: t('personalInfoScreen.mailingAddress'),
              subtitle: user.mailingAddress,
              icon: faAddressCard,
              onPress: () =>
                navigation.navigate('AddressForm', { target: 'mailing' }),
            })}
            {optionalContacts
              .filter(c => !!user[c.key])
              .map(c =>
                editableItem({
                  title: t(`personalInfoScreen.${c.key}`),
                  subtitle: user[c.key],
                  icon: c.icon,
                  onPress: () =>
                    editContact(c.key, `personalInfoScreen.${c.key}`, c.kind, {
                      removable: true,
                    }),
                }),
              )}
          </OverviewList>
        </Section>

        <Section>
          <SectionHeader title={t('personalInfoScreen.taxData')} />
          <OverviewList indented>
            {editableItem({
              title: t('personalInfoScreen.iban'),
              subtitle: user.IBAN,
              icon: faCreditCard,
            })}
            {editableItem({
              title: t('personalInfoScreen.taxDomicile'),
              subtitle: user.taxDomicilie,
              icon: faBuildingColumns,
            })}
          </OverviewList>
        </Section>
      </ScrollView>
      <BottomModal dismissable {...modal} />
    </>
  );
};

const createStyles = ({ colors, spacing, fontSizes, fontFamilies }: Theme) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    container: {
      paddingTop: spacing[3],
    },
    registryRow: {
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[1.5],
    },
    registryLabel: {
      color: colors.secondaryText,
      fontSize: fontSizes.sm,
    },
    registryValue: {
      flex: 1,
      textAlign: 'right',
      fontSize: fontSizes.sm,
    },
    residence: {
      marginTop: spacing[4],
    },
    infoText: {
      color: colors.prose,
      fontFamily: fontFamilies.body,
      fontSize: fontSizes.sm,
    },
  });
