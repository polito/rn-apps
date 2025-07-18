import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Button, TouchableOpacity } from 'react-native';
import { SectionHeader } from '../../ui/components/SectionHeader';
import { useStylesheet } from '../../ui/hooks/useStylesheet';
import { Theme } from '../../ui/types/Theme';
import { useCourses } from '../../core/contexts/CoursesContext';
import { Text } from '../../ui/components/Text';
import { Section } from '../../ui/components/Section';
import { Card } from '../../ui/components/Card';
import { OverviewList } from '../../ui/components/OverviewList';
import { ListItem } from '../../ui/components/ListItem';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircle, faEye, faEyeSlash, faHourglassEnd, faHourglassStart } from '@fortawesome/free-solid-svg-icons';
import { Switch } from '../../ui/components/Switch';
import { useTranslation } from 'react-i18next';

export const NoticeScreen = () => {
  const styles = useStylesheet(createStyles);
const { selectedNotice: originalNotice, setVisibilityOfNotice, selectedCourse } = useCourses();

const selectedNotice = selectedCourse?.notices.find(notice => notice.id === originalNotice?.id);  const [noticeVisibility, setNoticeVisibility] = useState(selectedNotice?.visible || false);
   const {t} = useTranslation();
  useEffect(() => {
    if (selectedNotice) {
      setNoticeVisibility(selectedNotice.visible);
    }
  }, [selectedNotice]);

  if (!selectedCourse || !selectedNotice) return null;

  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded(prev => !prev);

  const handleToggle = (value: boolean) => {
    setVisibilityOfNotice(selectedCourse.id, selectedNotice.id, value);
    setNoticeVisibility(value);
  };

  const settings = [
    {
      id: 1,
      content: t('newsScreen.createdAt'),
      subtitle: `${selectedNotice.startDate}`,
      icon: <FontAwesomeIcon icon={faHourglassStart} size={24} />,
      trailingItem: null,
    },
    {
      id: 2,
      content: t('other.expiresOn'),
      subtitle: selectedNotice.endDate ? `${selectedNotice.endDate}` : t('other.never'),
      icon: <FontAwesomeIcon icon={faHourglassEnd} size={24} />,
      trailingItem: null,
    },
    {
      id: 3,
      content: t('other.visibility'),
      subtitle: noticeVisibility ? t('other.visibleToAll') : t('other.hiddenFromStudents'),
      icon: (
        <FontAwesomeIcon
          icon={noticeVisibility ? faEye : faEyeSlash}
          size={24}
        />
      ),
      trailingItem: (
        <Switch
          value={noticeVisibility}
          onValueChange={handleToggle}
        />
      ),
    }
  ];

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={{ marginTop :10  }}/>
      
        <Section>
          <Text variant='heading' style={styles.TitleText}>{selectedNotice.title}</Text>
          <Card>
            {!expanded ? (
              <Text style={styles.ContentText}>
                {selectedNotice.content.slice(0, 150)}...
                <Text onPress={toggleExpanded} style={styles.inlineShowMore}> Altro</Text>
              </Text>
            ) : (
              <>
                <Text style={styles.ContentText}>{selectedNotice.content}</Text>
                <TouchableOpacity onPress={toggleExpanded}>
                  <Text style={styles.ShowMore}>Mostra meno</Text>
                </TouchableOpacity>
              </>
            )}
          </Card>

          <Section>
            <OverviewList indented>
              {settings.map(setting => (
                <ListItem
                  key={`${setting.id}`}
                  title={setting.content}
                  subtitle={setting.subtitle}
                  leadingItem={setting.icon}
                  trailingItem={setting.trailingItem || <View />}
                />
              ))}
            </OverviewList>
          </Section>
        </Section>
    </ScrollView>
  );
};
const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    container: {
      marginVertical: spacing[5] ,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: spacing[4] ,
    },
    dateText: {
      fontSize: 16,
      color: 'gray',
      marginTop: spacing[1] ,
      marginLeft: spacing[4] ,
    },
    ContentText: {
      fontSize: 16,
      marginTop: spacing[4] ,
      marginLeft: spacing[4] ,
      marginBottom : spacing[4]
    },
    TitleText: {
      fontSize: 16,
      marginLeft: spacing[4] ,
    },
    ShowMore: {
      marginLeft : spacing[4],
      marginBottom : spacing[4],
      marginTop: 8,
      color: '#007AFF', // blu tipo link
      fontWeight: '500',
    },
    inlineShowMore: {
      color: '#007AFF',
      fontWeight: '500',
    },
  });
