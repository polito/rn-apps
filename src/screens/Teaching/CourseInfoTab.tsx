import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
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
import { OverviewList } from '../../ui/components/OverviewList';
import { PersonListItem } from '../../ui/components/PersonListItem';
import { ExamListItem } from '../../ui/components/ExamListItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { Theme } from '../../ui/types/Theme';
import { Card } from '../../ui/components/Card';
import { Grid } from '../../ui/components/Grid';
import { GlobalStyles } from '../../core/components/GlobalStyles';
import { BottomBarSpacer } from '../../core/components/BottomBarSpacer';
import { Icon } from '../../ui/components/Icon';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { Metric } from '../../ui/components/Metric';
import { Row } from '../../ui/components/Row';

export const CourseInfoTab = () => {
  const { t } = useTranslation();
  const { spacing, colors } = useTheme();
  const { selectedCourse, setSelectedProfile, getProfileById, setSelectedExam, getExamFromId , fakeExams} = useCourses();
  const navigation = useNavigation();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { setOptions } = useNavigation();
  const { fontSizes } = useTheme();

useEffect(() => {
    const headerTitle = selectedCourse?.title || 'Course';
    setOptions({
      headerTitle,
      headerBackTitleVisible: headerTitle.length <= 20,
    });
  }, [selectedCourse?.title, selectedCourse]);

useEffect(() => {
  const unsubscribe = navigation.addListener('beforeRemove', (e) => {
    e.preventDefault();
    navigation.navigate('Incarichi');
  });

  return unsubscribe; 
}, [navigation]);

  const pictureStyle = {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 20,
  };
  // Se nessun corso è selezionato, mostra un messaggio di errore
  if (!selectedCourse) {
    return (
      <View style={{ padding: spacing[5]  }}>
        <Text style={{ textAlign: 'center', fontSize: 16, color: 'red' }}>
          No course selected
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={bottomBarAwareStyles}
      contentInsetAdjustmentBehavior="automatic"
      bounces={false}
    >

      


      <Section>
      <View style={{ marginTop : spacing[10]  }}>

      <Card style={styles.metricsCard} accessible={true}>
        <Grid numColumns={2} gap={16}>
          <View style={GlobalStyles.grow}>
              <Row justify="flex-start" align="center">
                  <Metric title={t('other.period')} value={selectedCourse.registered} style={styles.periodMetric}/>
              </Row>
          </View>
          <View style={GlobalStyles.grow}>
              <Row justify="flex-start" align="center">
                  <Metric title={t('courseInfoTab.creditsLabel')} value={`${selectedCourse.cfu} cfu`} style={styles.periodMetric}/>
              </Row>
         </View>
        </Grid>
      </Card>
      </View>
      </Section>
      {/* Sezione per lo staff */}
      <Section>
        {selectedCourse.managed ? <SectionHeader title={t('other.managingAccesses')} linkTo='Staff' linkname={t('other.modify')}/> : <SectionHeader title={"Staff"} />}
        
          
             <OverviewList
                indented
              >
            {selectedCourse.staff.map(staff => (
                  
                <ListItem
                key={staff.id}
                      leadingItem={<Icon icon={faUser} size={fontSizes['2xl']}/>}
                      title={staff.name}
                      subtitle={staff.role === 'Titolare' ? t('other.owner') : t('other.collaborator')}
                     
                        onPress={() =>{
                          if(staff.idProfile){
                            const profile = getProfileById(staff.idProfile)
                            setSelectedProfile(profile ?? null)
                                         navigation.navigate('Contatto');

                          }
          
        } }
                     
                    />
             ))}  
             </OverviewList>
         
      </Section> 
      
      {/* Sezione per gli appelli */}
      <Section>
        <SectionHeader title={t('examsScreen.title')} />
        <OverviewList
        indented>
          {selectedCourse.examcalls.map(call => (
            <ListItem
            key={`${call.id}`}
            title={call.name}
            subtitle={call.date === 'Oggi' ? t('other.today') : call.date}
            onPress={()=>{
              console.log('pressed')
              const exam = getExamFromId(call.idExam, fakeExams)
              if(exam){
                navigation.navigate('Exam3')
              setSelectedExam(exam)
              }
              
            }}
          />
            ))}
        </OverviewList>
      </Section>
      
      
      {/* Sezione per altro */}
      <Section>
        <SectionHeader title={t('other.other')} linkTo="" />
        <OverviewList>
          <ListItem title={t('courseGuideScreen.title')} linkTo="CourseGuide" />
        </OverviewList> 
      </Section> 
      <BottomBarSpacer />
    </ScrollView>
  );
};


const createStyles = ({ colors, spacing }: Theme) =>
  StyleSheet.create({
    heading: {
      paddingTop: spacing[5] ,
      paddingHorizontal: spacing[4] ,
    },
    metricsCard: {
      justifyContent: 'space-between',
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[4],
      marginTop: 0,
      marginBottom: spacing[7],
    },
    periodMetric: {
      marginRight: spacing[2] ,
    },
    periodDropdownIcon: {
      color: colors.secondary['500'],
    },
    dotIcon: {
      marginBottom: spacing[2] ,
      color: colors.prose['600'],
    },
  });


