import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { faCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import {
  BottomBarSpacer,
  CtaButton,
  CtaButtonContainer,
  Icon,
  IndentedDivider,
  ListItem,
  OverviewList,
  Section,
  SectionHeader,
  Text,
  Theme,
  TranslucentTextField,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { CourseSharedScreensParamList } from './CourseSharedScreens';

type EditRoomRouteProp = RouteProp<CourseSharedScreensParamList, 'EditRoom'>;

const AVAILABLE_ROOMS = [
  { site: 'Sede Centrale', rooms: ['7', '7D', '7A', '7B', '7C'] },
  { site: 'Sede Mirafiori', rooms: ['7'] },
];

export const ChooseRoomModal = () => {
  const route = useRoute<EditRoomRouteProp>();
  const onConfirm = route.params?.onConfirm;
  const navigation =
    useNavigation<NativeStackNavigationProp<CourseSharedScreensParamList>>();
  const { t } = useTranslation();
  const styles = useStylesheet(createStyles);
  const [searchRoom, setSearchRoom] = useState('');
  const [selectedRoomKey, setSelectedRoomKey] = useState<string | null>(null);
  const roomLabel = t('other.room');
  const { palettes } = useTheme();

  const handleConfirmSelection = () => {
    if (selectedRoomKey) {
      const parts = selectedRoomKey.split('-');
      const room = parts[parts.length - 1];
      const roomLabelText = `${roomLabel} ${room}`;
      onConfirm?.(roomLabelText);
    }

    return navigation.goBack();
  };
  const normalizedSearch = searchRoom.trim().toLowerCase();

  const filteredRooms = useMemo(() => {
    if (!normalizedSearch) {
      return AVAILABLE_ROOMS;
    }

    return AVAILABLE_ROOMS.map(site => ({
      ...site,
      rooms: site.rooms.filter(room =>
        `${roomLabel} ${room}`.toLowerCase().includes(normalizedSearch),
      ),
    })).filter(site => site.rooms.length > 0);
  }, [normalizedSearch, roomLabel]);

  const renderHighlightedRoomTitle = (room: string) => {
    const title = `${roomLabel} ${room}`;

    if (!normalizedSearch) {
      return title;
    }

    const matchIndex = title.toLowerCase().indexOf(normalizedSearch);
    if (matchIndex < 0) {
      return title;
    }

    const before = title.slice(0, matchIndex);
    const match = title.slice(matchIndex, matchIndex + normalizedSearch.length);
    const after = title.slice(matchIndex + normalizedSearch.length);

    return (
      <Text>
        {before}
        <Text style={styles.highlightedMatch}>{match}</Text>
        {after}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Section style={styles.section}>
          <TranslucentTextField
            type="text"
            label={t('common.searchRoom')}
            leadingIcon={faMagnifyingGlass}
            containerStyle={styles.searchField}
            isClearable
            value={searchRoom}
            onChangeText={setSearchRoom}
            onClear={() => setSearchRoom('')}
          />
        </Section>

        {filteredRooms.map(sites => {
          return (
            <Section key={sites.site} style={styles.section}>
              <SectionHeader
                titleStyle={styles.sectionHeader}
                separator={false}
                title={sites.site}
              />
              <OverviewList indented style={styles.listContainer}>
                {sites.rooms.map((room, index) => {
                  const roomKey = `${sites.site}-${room}`;

                  return (
                    <React.Fragment key={room}>
                      <ListItem
                        title={renderHighlightedRoomTitle(room)}
                        onPress={() => setSelectedRoomKey(roomKey)}
                        trailingItem={
                          selectedRoomKey === roomKey ? (
                            <Icon icon={faCheck} color={palettes.gray[500]} />
                          ) : undefined
                        }
                      />
                      {index < sites.rooms.length - 1 && <IndentedDivider />}
                    </React.Fragment>
                  );
                })}
              </OverviewList>
            </Section>
          );
        })}
        <BottomBarSpacer />
      </ScrollView>

      <CtaButtonContainer absolute>
        <CtaButton
          absolute={true}
          title={t('common.confirmSelection')}
          action={handleConfirmSelection}
          disabled={!selectedRoomKey}
        />
      </CtaButtonContainer>
    </SafeAreaView>
  );
};

const createStyles = ({
  spacing,
  colors,
  shapes,
  palettes,
  fontSizes,
  fontWeights,
}: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      paddingVertical: spacing[5],
      backgroundColor: colors.background,
    },
    section: {
      marginTop: 0,
      paddingTop: 0,
      marginBottom: 0,
    },
    listContainer: {
      marginTop: spacing[2.5],
      marginBottom: spacing[3],
      borderRadius: shapes.lg,
      elevation: 0,
      paddingTop: 0,
    },
    CTAbutton: {
      backgroundColor: colors.background,
    },
    searchField: {
      backgroundColor: palettes.gray[200],
      borderWidth: 1,
      borderColor: palettes.gray[300],
      margin: spacing[5],
      marginTop: 0,
    },
    sectionHeader: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      fontFamily: 'Montserrat-SemiBold',
    },
    highlightedMatch: {
      color: palettes.secondary[600],
      fontWeight: fontWeights.semibold,
    },
  });
