import React, { useLayoutEffect, useState, useTransition } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../../ui/components/Card';
import { Select } from '../../ui/components/Select';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../ui/hooks/useTheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { IconButton } from '../../ui/components/IconButton';
import { faArrowLeft, faEnvelope, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { useCourses } from '../../core/contexts/CoursesContext';
import { Text } from '../../ui/components/Text';
import { CtaButton } from '../../ui/components/CtaButton';
import { useTranslation } from 'react-i18next';

export const ProfileForm = () => {
const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { colors, spacing } = useTheme();
  const { user, setUser } = useCourses();
  const [domicilie, setDomicilie] = useState(user.domicilie);
  const [tdomicilie, setTdomicilie] = useState(user.taxDomicilie);
  const [iban, setIban] = useState(user.IBAN);
  const [phone, setPhone] = useState(user.phone);
  const [mail, setMail] = useState(user.email);
  const [pmail, setPmail] = useState(user.privateMail);

  const handlePublish = () => {
    setUser({
      ...user,
      domicilie,
      taxDomicilie: tdomicilie,
      IBAN: iban,
      phone,
      email: mail,
      privateMail: pmail,
    });
  
    navigation.goBack();
  };
 useLayoutEffect(() => {
  const marginLeft = i18n.language === 'en' ? 80 : 65;

  navigation.setOptions({
    headerTitle: () => (
      <Text variant='heading' style={{ marginLeft }}>
        {t('other.modifyProfile')}
      </Text>
    ),
    headerLeft: () => (
      <IconButton icon={faArrowLeft} size={22} onPress={() => navigation.goBack()} />
    ),
  });
}, [navigation, i18n.language, t]);



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text variant ='title' style={{ marginLeft: spacing[4] }}>{t('other.personalInfo')}</Text>
        <Card>
                  <Text 
                  variant='heading'
                  style ={{
                    marginLeft: 15,marginTop: 5,color : colors.formTitle
                  }}>
                    {t('other.residence')}
                  </Text>
                  <TextInput
                    placeholder={t('other.enterResidence')}
                    value={domicilie}
                    onChangeText={setDomicilie}
                    style={{
                      borderBottomWidth: 0,
                      padding: spacing[2],
                      marginLeft: 10,
                      fontSize: 16,
                      color : colors.formPlaceHolder
                    }}
                  />
        </Card>
        <Card>
                  <Text 
                  variant='heading'
                  style ={{
                    marginLeft: 15,marginTop: 5,color : colors.formTitle
                  }}>
                    {t('other.fiscalResidence')}
                  </Text>
                  <TextInput
                    placeholder={t('other.enterFiscalResidence')}
                    value={tdomicilie}
                    onChangeText={setTdomicilie}
                    style={{
                      borderBottomWidth: 0,
                      padding: spacing[2],
                      marginLeft: 10,
                      fontSize: 16,
                      color : colors.formPlaceHolder
                    }}
                  />
        </Card>

        
        <Text variant ='title' style={{ marginLeft: spacing[4] }}>{t('other.contacts')}</Text>
        <Card>
  <Text
    variant='heading'
    style={{
      marginLeft: 15, marginTop: 5, color: colors.formTitle
    }}>
    {t('other.telephone')}
  </Text>
  <TextInput
    placeholder={t('other.enterTelephone')}
    value={phone}
    onChangeText={setPhone}
    style={{
      borderBottomWidth: 0,
      padding: spacing[2],
      marginLeft: 10,
      fontSize: 16,
      color: colors.formPlaceHolder
    }}
  />
</Card>

<Card>
  <Text
    variant='heading'
    style={{
      marginLeft: 15, marginTop: 5, color: colors.formTitle
    }}>
    Email
  </Text>
  <TextInput
    placeholder={t('other.enterMail')}
    value={mail}
    onChangeText={setMail}
    style={{
      borderBottomWidth: 0,
      padding: spacing[2],
      marginLeft: 10,
      fontSize: 16,
      color: colors.formPlaceHolder
    }}
  />
</Card>

<Card>
  <Text
    variant='heading'
    style={{
      marginLeft: 15, marginTop: 5, color: colors.formTitle
    }}>
    {t('other.privateMail')}
  </Text>
  <TextInput
    placeholder={t('other.enterPrivateMail')}
    value={pmail}
    onChangeText={setPmail}
    style={{
      borderBottomWidth: 0,
      padding: spacing[2],
      marginLeft: 10,
      fontSize: 16,
      color: colors.formPlaceHolder
    }}
  />
</Card>
        
      </View>
      <CtaButton
               title={t('other.refreshProfile')}
               action={() => {
                  handlePublish()
               }}
               absolute = {false}
               variant="filled"
               disabled = {!domicilie }
           />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
    paddingTop : 10
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 16,
  },
  blueButtonContainer: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 0,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
