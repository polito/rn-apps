import { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  faArrowRightArrowLeft,
  faCircleDot,
  faCircleExclamation,
  faCircleInfo,
  faEllipsisVertical,
  faFlagCheckered,
} from '@fortawesome/free-solid-svg-icons';
import { BottomSheetTextField } from '@polito/lib/ui';
import { Icon } from '@polito/lib/ui';
import { useStylesheet } from '@polito/lib/ui';
import { useTheme } from '@polito/lib/ui';
import { Theme } from '@polito/lib/ui';
import { PlaceOverview } from '@polito/student-api-client';

import { Checkbox } from '../../../../../students/src/core/components/Checkbox';
import { PlacesContext } from '../contexts/PlacesContext';
import { NavField } from '../types';
import { ItineraryButton } from './ItineraryButton';
//MOMENTANEO
//import { Checkbox } from '../../../core/components/Checkbox';      non è stato ancora fatto il componente, prendilo o da prenotazione aula o da prenotazione esame
import { StatisticsContainer } from './StatisticsContainer';

interface ItineraryPlannerProps {
  searchStart: string;
  searchDest: string;
  distance: number;
  stairs: number;
  elevators: number;
  steps: number;
  privatePaths: boolean;
  avoidStairs: boolean;
  isLoadingPath: boolean;
  dark: boolean;

  setSearchStart: (text: string) => void;
  setSearchDest: (text: string) => void;
  handleRoom: (room: PlaceOverview | undefined, navField: NavField) => void;
  handleSwitchRooms: () => void;
  handleDebouncedSearch: (text: string) => void;
  setAvoidStairs: (value: boolean) => void;

  triggerSearch: (searchTerm: string) => void;

  clearStatistics: () => void;

  showItinerary: () => void;
}

const ItineraryPlannerComponent = ({
  searchStart,
  searchDest,
  distance,
  stairs,
  elevators,
  steps,
  privatePaths,
  avoidStairs,
  isLoadingPath,
  setSearchStart,
  setSearchDest,
  handleRoom,
  handleSwitchRooms,
  handleDebouncedSearch,
  setAvoidStairs,
  triggerSearch,
  clearStatistics,
  showItinerary,
}: ItineraryPlannerProps) => {
  const { dark, palettes } = useTheme();
  const styles = useStylesheet(createStyles);
  const { t } = useTranslation();

  const { navSelectorRoom, setNavSelectorRoom } = useContext(PlacesContext);

  const rotationAnim = useRef(new Animated.Value(0)).current;

  const animateSwitch = () => {
    handleSwitchRooms();

    Animated.timing(rotationAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      rotationAnim.setValue(0);
    });
  };

  const spin = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['90deg', '270deg'],
  });

  return (
    <View style={styles.bottomSheetContent}>
      <View style={styles.selector}>
        <View style={styles.grid}>
          <View style={styles.inputs}>
            {navSelectorRoom !== 'destination' && (
              <View style={styles.inputRoom}>
                <Icon
                  icon={faCircleDot}
                  color={palettes.gray[dark ? 300 : 600]}
                />
                <BottomSheetTextField
                  label={t('indicationsScreen.fromPlaceLabel')}
                  onBlur={() => triggerSearch(searchStart)}
                  returnKeyType="search"
                  onSubmitEditing={() => {
                    triggerSearch(searchStart);
                  }}
                  value={searchStart}
                  isClearable={!!searchStart}
                  onChangeText={(text: string) => {
                    setNavSelectorRoom('start');
                    setSearchStart(text);
                    triggerSearch(text);
                  }}
                  onClear={() => {
                    handleRoom(undefined, 'start');
                    setSearchStart('');
                    handleDebouncedSearch('');
                    setNavSelectorRoom(null);
                    clearStatistics();
                    if (Keyboard.isVisible()) Keyboard.dismiss();
                  }}
                  onFocus={() => {
                    setNavSelectorRoom('start');
                  }}
                  //hitSlop={{ top: 44, bottom: 44, left: 44, right: 44 }}
                />
              </View>
            )}
            {!navSelectorRoom && (
              <View style={styles.ellipsis}>
                <Icon
                  icon={faEllipsisVertical}
                  color={palettes.gray[dark ? 300 : 600]}
                />
              </View>
            )}
            {navSelectorRoom !== 'start' && (
              <View style={styles.inputRoom}>
                <Icon
                  icon={faFlagCheckered}
                  color={palettes.gray[dark ? 300 : 600]}
                />
                <BottomSheetTextField
                  label={t('indicationsScreen.toPlaceLabel')}
                  onBlur={() => triggerSearch(searchDest)}
                  returnKeyType="search"
                  onSubmitEditing={() => {
                    triggerSearch(searchDest);
                  }}
                  value={searchDest}
                  isClearable={!!searchDest}
                  onChangeText={(text: string) => {
                    setNavSelectorRoom('destination');
                    setSearchDest(text);
                    triggerSearch(searchDest);
                  }}
                  onClear={() => {
                    handleRoom(undefined, 'destination'); //#TODO fix any
                    setSearchDest('');
                    handleDebouncedSearch('');
                    setNavSelectorRoom(null);
                    clearStatistics();
                    if (Keyboard.isVisible()) Keyboard.dismiss();
                  }}
                  onFocus={() => {
                    setNavSelectorRoom('destination');
                  }}
                  //hitSlop={{ top: 44, bottom: 44, left: 44, right: 44 }}
                />
                {!navSelectorRoom && (
                  <TouchableOpacity
                    onPress={animateSwitch}
                    hitSlop={{ top: 44, bottom: 44, left: 24, right: 24 }}
                  >
                    <Animated.View
                      style={{
                        transform: [{ rotate: spin }],
                      }}
                    >
                      <Icon
                        icon={faArrowRightArrowLeft}
                        color={palettes.gray[dark ? 300 : 600]}
                      />
                    </Animated.View>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          {!navSelectorRoom && (
            <View style={styles.stairsButtonContainer}>
              <View style={styles.checkBox}>
                <Checkbox
                  onPress={() => {
                    setAvoidStairs(!avoidStairs);
                  }}
                  isChecked={avoidStairs}
                />
              </View>
              <Text
                style={[
                  styles.textStairsButton,
                  {
                    color: dark ? palettes.primary[200] : palettes.primary[600],
                  },
                ]}
              >
                {t('indicationsScreen.avoidStairs')}
              </Text>
            </View>
          )}
        </View>
      </View>
      {!isLoadingPath && !navSelectorRoom && (
        <View style={styles.infoAndstats}>
          {distance > 0 && (
            <View style={styles.statisticsContainer}>
              <StatisticsContainer
                totDistance={distance}
                stairs={stairs}
                elevators={elevators}
              />
            </View>
          )}
          {steps > 0 ? (
            <View style={styles.pathInfo}>
              <Icon
                icon={faCircleInfo}
                color={dark ? palettes.primary[200] : palettes.primary[600]}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.textStairsButton,
                  {
                    color: dark ? palettes.primary[200] : palettes.primary[600],
                  },
                ]}
              >
                {t('indicationsScreen.stepsInfo')}
              </Text>
            </View>
          ) : null}
          {privatePaths ? (
            <View style={styles.pathInfo}>
              <Icon
                icon={faCircleExclamation}
                color={dark ? palettes.warning[500] : palettes.warning[600]}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.textStairsButton,
                  {
                    color: dark ? palettes.warning[500] : palettes.warning[600],
                  },
                ]}
              >
                {t('indicationsScreen.privateInfo')}
              </Text>
            </View>
          ) : null}
          {!navSelectorRoom && !isLoadingPath && distance > 0 && (
            <View style={styles.buttonContainer}>
              <ItineraryButton showItinerary={showItinerary} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const createStyles = ({ spacing }: Theme) =>
  StyleSheet.create({
    bottomSheetContent: {
      display: 'flex',
      width: '100%',
      paddingVertical: spacing[4],
      flexDirection: 'column',
      alignItems: 'center',
      gap: spacing[4],
    },
    selector: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    grid: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      alignItems: 'flex-start',
      paddingHorizontal: spacing[4],
      gap: 20,
      alignSelf: 'stretch',
    },
    inputs: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    switchButton: {
      padding: 12,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoom: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      alignSelf: 'stretch',
    },
    ellipsis: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    filter: {
      display: 'flex',
      paddingVertical: '1.5%',
      alignSelf: 'stretch',
      borderRadius: 6,
    },
    text: {
      overflow: 'hidden',
      fontFamily: 'Montserrat',
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 21,
    },
    stairsButtonContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      paddingStart: 10,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    textStairsButton: {
      fontFamily: 'Montserrat',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: 21,
    },
    checkBox: {
      display: 'flex',
      width: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    infoAndstats: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      gap: spacing[2],
    },
    statisticsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: '100%',
      paddingStart: 20,
      gap: 20,
    },
    pathInfo: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
      paddingStart: 20,
      gap: 8,
    },
    icon: {
      display: 'flex',
      width: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      display: 'flex',
      width: '100%',
    },
  });
export const ItineraryPlanner = ItineraryPlannerComponent;
