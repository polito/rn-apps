import { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  faBookOpen,
  faEnvelope,
  faPhone,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

import { useCourses } from '../../core/contexts/CoursesContext';
import { useBottomBarAwareStyles } from '../../core/hooks/useBottomBarAwareStyles';
import { Col } from '../../ui/components/Col';
import { Icon } from '../../ui/components/Icon';
import { ListItem } from '../../ui/components/ListItem';
import { Row } from '../../ui/components/Row';
import { SectionHeader } from '../../ui/components/SectionHeader';
import { SectionList } from '../../ui/components/SectionList';
import { Text } from '../../ui/components/Text';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { useTheme } from '../../ui/hooks/useTheme';
import { Theme } from '../../ui/types/Theme';

export const StudentContact = () => {
  const { spacing, colors } = useTheme();
  const navigation = useNavigation();
  const bottomBarAwareStyles = useBottomBarAwareStyles();
  const styles = useStylesheet(createStyles);
  const { fontSizes } = useTheme();
  const { selectedStudent } = useCourses();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          variant="heading"
          style={{ textAlign: 'center', width: '100%', marginLeft: -25 }}
        >
          Contatto
        </Text>
      ),
    });
  }, [navigation, colors]);

  if (!selectedStudent) return null;
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
          {selectedStudent.name + ' ' + selectedStudent.surname}
        </Text>
      </Row>
      <View style={{ paddingBottom: spacing[5] }}></View>
      <Row style={styles.profileRow}>
        <View style={styles.avatarCircle}>
          <Icon icon={faUser} size={48} color="#fff" />
        </View>
        <Col style={styles.infoColumn}>
          <Text variant="heading" style={{ marginBottom: 4, marginLeft: 20 }}>
            {' '}
            Corso di laurea{' '}
          </Text>
          <Text style={{ marginBottom: 4, marginLeft: 24 }}>
            {selectedStudent.degreeCourse}
          </Text>
        </Col>
      </Row>
      <View style={{ paddingBottom: spacing[5] }}></View>

      <SectionHeader title="Contatti"></SectionHeader>
      <SectionList>
        <ListItem
          title="Telefono"
          subtitle="3667890543"
          leadingItem={<Icon icon={faPhone} size={fontSizes.xl} />}
        ></ListItem>
        <ListItem
          title="Email"
          subtitle={selectedStudent.id + '@studenti.polito.it'}
          leadingItem={<Icon icon={faEnvelope} size={fontSizes.xl} />}
        ></ListItem>
      </SectionList>
      <View style={{ paddingBottom: spacing[5] }}></View>

      <SectionHeader title="Esami superati" />
      <SectionList>
        {selectedStudent.passedExams.map((exam, index) => (
          <ListItem
            key={index}
            title={exam}
            subtitle={selectedStudent.passedExamsDate[index]}
            leadingItem={<Icon icon={faBookOpen} size={fontSizes.xl} />}
            multilineTitle={true}
          />
        ))}
      </SectionList>
    </ScrollView>
  );
};

const createStyles = ({ spacing }: Theme) =>
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
      backgroundColor: '#ccc',
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
