import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import { isTablet as isTabletHelper } from 'react-native-device-info';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { useDeviceOrientation } from '@polito/lib/core';
import {
  CtaButton,
  CtaButtonContainer,
  Theme,
  useStylesheet,
  useTheme,
} from '@polito/lib/ui';
import {
  EuropeanStudentCard,
  StudentCareerStatusEnum,
} from '@polito/student-api-client';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DateTime } from 'luxon';

import { UserStackParamList } from '../../features/user/components/UserNavigator.tsx';
import { EscCard } from './EscCard.tsx';
import { SmartCard } from './SmartCard.tsx';

/** Matches the SmartCard / EscCard design width; keeps iPad landscape from scaling too large. */
const MAX_CARD_WIDTH = 400;
const CARD_WIDTH_RATIO = 0.8;
const SPACING_RATIO = 0.02;

interface CardSwiperProps {
  firstName: string;
  lastName: string;
  username: string;
  degreeName?: string;
  status?: StudentCareerStatusEnum;
  picture?: string;
  hasSmartCard: boolean;
  europeanStudentCard?: EuropeanStudentCard;
  firstRequest?: boolean;
  onShowQr?: () => void;
}

type EscItem = {
  isESC: true;
  ESC: EuropeanStudentCard;
  firstRender?: boolean;
};

type SmartCardItem = {
  isESC: false;
};

type Item = EscItem | SmartCardItem;

type CarouselProps = {
  item: {
    name: string;
    lastname: string;
    username: string;
    degreeName?: string;
    status?: StudentCareerStatusEnum;
    picture?: string;
    card: Item;
  };
  index: number;
  scrollX: SharedValue<number>;
  isLast: boolean;
  scrollTo: (index: number, valInterval: number) => void;
  onShowQr?: () => void;
  cardLength: number;
  spacing: number;
  snapInterval: number;
};

const SlideItem = ({
  item,
  index,
  scrollX,
  isLast,
  scrollTo,
  onShowQr,
  cardLength,
  spacing,
  snapInterval,
}: CarouselProps) => {
  const styles = useStylesheet(createStyles);

  const navigation =
    useNavigation<NativeStackNavigationProp<UserStackParamList>>();

  const deviceOrientation = useDeviceOrientation();

  const rnAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [
              (index - 1) * snapInterval,
              index * snapInterval,
              (index + 1) * snapInterval,
            ],
            [-cardLength * 0.1, 0, cardLength * 0.1],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            [
              (index - 1) * snapInterval,
              index * snapInterval,
              (index + 1) * snapInterval,
            ],
            [0.8, 1, 0.8],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const { colors, palettes } = useTheme();

  return (
    <Animated.View
      style={[
        {
          width: cardLength,
          marginRight: isLast ? 0 : spacing,
          overflow: 'hidden',
          justifyContent: 'center',
        },
        deviceOrientation === 'portrait' ? [rnAnimatedStyle] : undefined,
      ]}
    >
      {!item.card.isESC ? (
        <SmartCard
          width={cardLength}
          firstName={item.name}
          lastName={item.lastname}
          username={item.username}
          degreeName={item.degreeName}
          status={item.status}
          picture={item.picture}
          onShowQr={onShowQr}
        />
      ) : (
        <View>
          <EscCard
            width={cardLength}
            height={cardLength * (207 / 328)}
            cognome={item.lastname.toUpperCase()}
            nome={item.name.toUpperCase()}
            matricola={item.username}
            qr={item.card.ESC.details?.qrCode ?? ''}
            cardStatus={
              item.card.ESC.canBeRequested && !item.card.ESC.details
                ? 'Requestable'
                : (item.card.ESC.details?.status ?? 'active')
            }
            expiresDate={
              item.card.ESC.details?.expiresAt
                ? DateTime.fromISO(item.card.ESC.details?.expiresAt).toFormat(
                    'dd/MM/yyyy',
                  )
                : '--/--/--'
            }
            inactiveStatusReason={item.card.ESC.details?.inactiveStatusReason}
            scrollTo={scrollTo}
          />
          {item.card.ESC.canBeRequested && !item.card.ESC.details && (
            <CtaButtonContainer absolute={true} style={styles.buttonContainer}>
              <CtaButton
                absolute={false}
                title="Request Card"
                action={() => navigation.navigate('RequestESC')}
                textStyle={{ color: colors.black, fontWeight: '600' }}
                style={styles.button}
                underlayColor={palettes.gray[200]}
                containerStyle={{
                  paddingHorizontal: isTabletHelper()
                    ? cardLength / 3
                    : cardLength / 6,
                }}
              />
            </CtaButtonContainer>
          )}
        </View>
      )}
    </Animated.View>
  );
};

export const CardSwiper = ({
  firstName,
  lastName,
  username,
  degreeName,
  status,
  picture,
  hasSmartCard,
  europeanStudentCard,
  firstRequest,
  onShowQr,
}: CardSwiperProps) => {
  const styles = useStylesheet(createStyles);
  const scrollX = useSharedValue(0);
  const snapIntervalSV = useSharedValue(0);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isFirstRequest, setIsFirstRequest] = useState<boolean>(
    firstRequest ?? false,
  );
  const { width: srcWidth } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const pageIndexRef = useRef(0);

  const { cardLength, spacing, sideCardLength, snapInterval } = useMemo(() => {
    const length = Math.min(srcWidth * CARD_WIDTH_RATIO, MAX_CARD_WIDTH);
    // Two side margins in the old layout → keep the same visual gap between cards.
    const gap = srcWidth * SPACING_RATIO * 2;
    return {
      cardLength: length,
      spacing: gap,
      sideCardLength: (srcWidth - length) / 2,
      snapInterval: length + gap,
    };
  }, [srcWidth]);

  snapIntervalSV.value = snapInterval;

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollX.value = e.contentOffset.x;
      const interval = snapIntervalSV.value || 1;
      const nextIndex = Math.round(e.contentOffset.x / interval);
      runOnJS(setCurrentPageIndex)(nextIndex);
    },
  });

  const { colors } = useTheme();

  const items: Item[] = [
    ...(hasSmartCard ? [{ isESC: false } as SmartCardItem] : []),
    ...(europeanStudentCard &&
    (europeanStudentCard.canBeRequested || europeanStudentCard.details)
      ? [
          {
            isESC: true,
            ESC: { ...europeanStudentCard },
            firstRender: isFirstRequest,
          } as EscItem,
        ]
      : []),
  ];

  const scrollToItem = useCallback(
    (index: number) => {
      flatListRef.current?.scrollToOffset({
        offset: index * snapInterval,
        animated: true,
      });
    },
    [snapInterval],
  );

  const scrollTo = useCallback(
    (index = 1, valInterval = 1000) => {
      let step = 0;
      const interval = setInterval(() => {
        if (step === 0) {
          scrollToItem(index);
        } else if (step === 1) {
          setIsFirstRequest(false);
          clearInterval(interval);
        }
        step++;
      }, valInterval);

      return () => clearInterval(interval);
    },
    [scrollToItem],
  );

  useEffect(() => {
    if (isFirstRequest) {
      scrollTo();
    }
  }, [isFirstRequest, scrollTo]);

  useEffect(() => {
    pageIndexRef.current = currentPageIndex;
  }, [currentPageIndex]);

  // Keep the active card centered after rotation / width changes.
  useEffect(() => {
    const index = pageIndexRef.current;
    flatListRef.current?.scrollToOffset({
      offset: index * snapInterval,
      animated: false,
    });
    scrollX.value = index * snapInterval;
  }, [snapInterval, scrollX]);

  return (
    <View style={styles.container}>
      <View style={{ width: '100%' }}>
        <Animated.FlatList
          ref={flatListRef}
          data={items}
          renderItem={({ item, index }) => (
            <SlideItem
              item={{
                name: firstName,
                username,
                lastname: lastName,
                degreeName,
                status,
                picture,
                card: item,
              }}
              index={index}
              scrollX={scrollX}
              isLast={index === items.length - 1}
              scrollTo={scrollTo}
              onShowQr={onShowQr}
              cardLength={cardLength}
              spacing={spacing}
              snapInterval={snapInterval}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={snapInterval}
          snapToAlignment="start"
          disableIntervalMomentum
          decelerationRate="fast"
          onScroll={onScrollHandler}
          initialNumToRender={3}
          disableScrollViewPanResponder={true}
          windowSize={10}
          contentContainerStyle={[
            styles.flatListContainer,
            { paddingHorizontal: sideCardLength },
          ]}
          automaticallyAdjustContentInsets={false}
          contentInsetAdjustmentBehavior="never"
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: index === items.length - 1 ? cardLength : snapInterval,
            offset: snapInterval * index,
            index,
          })}
        />
      </View>
      <View style={styles.dotsContainer}>
        <AnimatedDotsCarousel
          length={items.length > 1 ? items?.length : 0}
          currentIndex={currentPageIndex}
          maxIndicators={items?.length ?? 0}
          activeIndicatorConfig={{
            color: colors.link,
            margin: 3,
            opacity: 1,
            size: 6,
          }}
          inactiveIndicatorConfig={{
            color: colors.heading,
            margin: 3,
            opacity: 0.5,
            size: 6,
          }}
          decreasingDots={[
            {
              config: {
                color: colors.heading,
                margin: 3,
                opacity: 0.5,
                size: 5,
              },
              quantity: 1,
            },
            {
              config: {
                color: colors.heading,
                margin: 3,
                opacity: 0.5,
                size: 4,
              },
              quantity: 1,
            },
          ]}
        />
      </View>
    </View>
  );
};

const createStyles = ({ fontWeights, colors, spacing }: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
      marginBottom: 20,
    },
    titleText: {
      fontSize: 14,
      lineHeight: 24,
      fontWeight: 'bold',
    },
    boxText: {
      color: colors.white,
      fontWeight: fontWeights.bold,
      fontSize: 28,
    },
    box: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    flatListContainer: {
      paddingVertical: 16,
      alignItems: 'center',
    },
    dotsContainer: {
      alignItems: 'center',
      height: 6,
    },
    buttonContainer: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'center',
    },
    button: {
      borderColor: colors.white,
      backgroundColor: colors.white,
      paddingVertical: spacing[3],
    },
  });
