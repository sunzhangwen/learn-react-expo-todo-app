import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PANEL_HEIGHT = Math.round(SCREEN_HEIGHT / 6);
const ITEM_HEIGHT = 56;
const VISIBLE_ITEMS = 5;

type Props = {
  visible: boolean;
  initialHour?: string;
  initialMinute?: string;
  onConfirm: (hour: string, minute: string) => void;
  onCancel: () => void;
};

function padZero(n: number): string {
  return n.toString().padStart(2, '0');
}

const HOURS = Array.from({ length: 24 }, (_, i) => padZero(i));
const MINUTES = Array.from({ length: 60 }, (_, i) => padZero(i));

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<string>);

function WheelColumn({
  data,
  value,
  onSelect,
}: {
  data: string[];
  value: string;
  onSelect: (v: string) => void;
}) {
  const flatRef = useRef<FlatList<string>>(null);
  const isInitialScroll = useRef(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  const initialIndex = useMemo(() => data.indexOf(value), [data, value]);

  useEffect(() => {
    if (isInitialScroll.current && flatRef.current) {
      const timer = setTimeout(() => {
        flatRef.current?.scrollToIndex({
          index: initialIndex >= 0 ? initialIndex : 0,
          animated: false,
        });
        isInitialScroll.current = false;
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [initialIndex]);

  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: false,
      }),
    [scrollY],
  );

  const onMomentumScrollEnd = useCallback(
    (e: any) => {
      const y = e?.contentOffset?.y ?? e?.nativeEvent?.contentOffset?.y ?? 0;
      const index = Math.round(y / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(data.length - 1, index));
      onSelect(data[clamped]);
      Haptics.selectionAsync();
      if (index !== clamped && flatRef.current) {
        flatRef.current.scrollToIndex({ index: clamped, animated: true });
      }
    },
    [data, onSelect],
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => {
      return <WheelItem item={item} index={index} scrollY={scrollY} />;
    },
    [scrollY],
  );

  const keyExtractor = useCallback((item: string) => item, []);

  return (
    <View style={wheelStyles.container}>
      <AnimatedFlatList
        ref={flatRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        bounces={false}
        windowSize={VISIBLE_ITEMS + 2}
        maxToRenderPerBatch={VISIBLE_ITEMS + 2}
        removeClippedSubviews
        initialNumToRender={VISIBLE_ITEMS + 2}
        style={wheelStyles.list}
        contentContainerStyle={wheelStyles.content}
      />
    </View>
  );
}

function WheelItem({
  item,
  index,
  scrollY,
}: {
  item: string;
  index: number;
  scrollY: Animated.Value;
}) {
  const itemCenter = index * ITEM_HEIGHT;

  const opacity = scrollY.interpolate({
    inputRange: [
      itemCenter - ITEM_HEIGHT * 2,
      itemCenter - ITEM_HEIGHT,
      itemCenter,
      itemCenter + ITEM_HEIGHT,
      itemCenter + ITEM_HEIGHT * 2,
    ],
    outputRange: [0.15, 0.4, 1, 0.4, 0.15],
    extrapolate: 'clamp',
  });

  const scale = scrollY.interpolate({
    inputRange: [
      itemCenter - ITEM_HEIGHT * 2,
      itemCenter - ITEM_HEIGHT,
      itemCenter,
      itemCenter + ITEM_HEIGHT,
      itemCenter + ITEM_HEIGHT * 2,
    ],
    outputRange: [0.8, 0.9, 1.1, 0.9, 0.8],
    extrapolate: 'clamp',
  });

  const fontSize = scrollY.interpolate({
    inputRange: [itemCenter - ITEM_HEIGHT, itemCenter, itemCenter + ITEM_HEIGHT],
    outputRange: [20, 32, 20],
    extrapolate: 'clamp',
  });

  const color = scrollY.interpolate({
    inputRange: [itemCenter - ITEM_HEIGHT, itemCenter, itemCenter + ITEM_HEIGHT],
    outputRange: ['#bbb', '#333', '#bbb'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        wheelStyles.item,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      <Animated.Text style={[wheelStyles.text, { fontSize, color }]}>{item}</Animated.Text>
    </Animated.View>
  );
}

export function TimePickerModal({
  visible,
  initialHour = '08',
  initialMinute = '00',
  onConfirm,
  onCancel,
}: Props) {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);

  useEffect(() => {
    if (visible) {
      setHour(initialHour);
      setMinute(initialMinute);
    }
  }, [visible, initialHour, initialMinute]);

  const handleConfirm = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onConfirm(hour, minute);
  }, [hour, minute, onConfirm]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onCancel} />

        <View style={styles.panel}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel} hitSlop={8}>
              <Text style={styles.cancelText}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.title}>选择时间</Text>
            <TouchableOpacity onPress={handleConfirm} hitSlop={8}>
              <Text style={styles.confirmText}>确定</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickerArea}>
            <View style={styles.highlightBox} />

            <View style={styles.wheelRow}>
              <View style={styles.wheelWrapper}>
                <WheelColumn data={HOURS} value={hour} onSelect={setHour} />
              </View>
              <Text style={styles.separator}>:</Text>
              <View style={styles.wheelWrapper}>
                <WheelColumn data={MINUTES} value={minute} onSelect={setMinute} />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.confirmButtonText}>确认</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  panel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  cancelText: {
    fontSize: 15,
    color: '#999',
  },
  confirmText: {
    fontSize: 15,
    color: '#4080FF',
    fontWeight: '600',
  },
  pickerArea: {
    height: PANEL_HEIGHT,
    marginHorizontal: 20,
    marginTop: 4,
    position: 'relative',
  },
  highlightBox: {
    position: 'absolute',
    top: (PANEL_HEIGHT - ITEM_HEIGHT) / 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: '#F0F6FF',
    borderRadius: 12,
  },
  wheelRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  wheelWrapper: {
    flex: 1,
  },
  separator: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    width: 40,
    textAlign: 'center',
    lineHeight: ITEM_HEIGHT,
  },
  confirmButton: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 10,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#4080FF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

const wheelStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  content: {
    paddingVertical: (PANEL_HEIGHT - ITEM_HEIGHT) / 2,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 26,
    color: '#333',
    textAlign: 'center',
  },
});
