import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import { ListItem } from '../../ui/components/ListItem';
import { MetricCard } from '../../ui/components/MetricCard';
import { Section } from '../../ui/components/Section';
import { SectionHeader } from '../../ui/components/SectionHeader';
import { SectionList } from '../../ui/components/SectionList';
import { useTheme } from '../../ui/hooks/useTheme';
import { useCourses } from '../../core/contexts/CoursesContext';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useBottomBarAwareStyles } from '../../core/hooks/useBottomBarAwareStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { Theme } from '../../ui/types/Theme';
import { Text } from '../../ui/components/Text';
import { Icon } from '../../ui/components/Icon';
import { faBank, faBookOpen, faEnvelope, faFileAlt, faHome, faPhone, faStar, faUser, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { Logo } from '../../core/components/Logo';
import { Row } from '../../ui/components/Row';
import { IconButton } from '../../ui/components/IconButton';
import { faBell, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Col } from '../../ui/components/Col';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { RoleListItem } from '../../ui/components/RoleListItem';
import { List } from '../../ui/components/List';




export const StudentContact = () => {
  const { t } = useTranslation();
  const { spacing, colors } = useTheme();
  const navigation = useNavigation();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { setOptions } = useNavigation();
  const { fontSizes } = useTheme();
  const { selectedStudent  } = useCourses();

if(!selectedStudent)return null

useLayoutEffect(() => {
    navigation.setOptions({
          headerTitle: () => (
            <Text variant="heading" style={{ textAlign: 'center', width: '100%', marginLeft : -25 }}>
              Contatto
            </Text>
          ),
          
    });
  }, [navigation, colors]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}
    >
      <Row style={{ alignItems: 'center', justifyContent: 'space-between', marginHorizontal: spacing[4] , marginTop : spacing[4]}}>
  <Text variant="title">
    {selectedStudent.name + ' ' + selectedStudent.surname}
  </Text>
  
</Row>
        <View style = {  {paddingBottom : spacing[5]}}></View>
                <Row style={styles.profileRow}>
        <View style={styles.avatarCircle}>
            <Icon icon={faUser} size={48} color="#fff" />
        </View>
        <Col style={styles.infoColumn}>
        <Text variant = 'heading' style={{ marginBottom: 4, marginLeft : 20 }} > Corso di laurea </Text>
        <Text style={{ marginBottom: 4 , marginLeft : 24}}>
            {selectedStudent.degreeCourse}
        </Text>
        
        </Col>
        </Row>     
            <View style = {  {paddingBottom : spacing[5]}}></View>
             

        <SectionHeader title={'Contatti'}></SectionHeader>
        <SectionList>
          <ListItem title= {"Telefono"} subtitle={"3667890543"} leadingItem={<Icon icon={faPhone} size={fontSizes['xl']}/>}></ListItem>
          <ListItem title= {"Email"} subtitle={selectedStudent.id + "@studenti.polito.it"} leadingItem={<Icon icon={faEnvelope} size={fontSizes['xl']}/>}></ListItem>

        </SectionList>
        <View style = {  {paddingBottom : spacing[5]}}></View>

        <SectionHeader title={"Esami superati"} />
<SectionList>
{selectedStudent.passedExams.map((exam, index) => (
  <ListItem
    key={index}
    title={exam}
    subtitle={selectedStudent.passedExamsDate[index]}
    leadingItem={<Icon icon={faBookOpen} size={fontSizes['xl']} />}
    multilineTitle={true}
  />
))}
   


            
</SectionList>
 
    </ScrollView>
  );
};


const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    heading: {
      paddingTop: spacing[5] ,
      paddingHorizontal: spacing[4] ,
      alignItems : 'center',
      justifyContent : 'space-between'
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
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: spacing[4],
        marginLeft : spacing[4]
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
