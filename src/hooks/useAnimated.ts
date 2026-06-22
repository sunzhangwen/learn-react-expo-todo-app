import { useCallback } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  interpolate,
  Extrapolation,
  type SharedValue,
  type AnimatedStyle,
  type BaseAnimationBuilder,
  type EntryExitAnimationFunction,
} from 'react-native-reanimated';

import { animation } from '@/constants/designTokens';

/** 弹簧动画配置 */
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

/** 轻量弹簧配置 */
const LIGHT_SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.8,
};

/** 卡片悬浮动画 Hook */
export function useCardHover() {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.06);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
    boxShadow: `0px ${4 + translateY.value * 2}px ${12 + translateY.value * 4}px rgba(0, 0, 0, ${0.06 + shadowOpacity.value})`,
  }));

  const onPressIn = useCallback(() => {
    'worklet';
    scale.value = withSpring(0.98, LIGHT_SPRING_CONFIG);
    translateY.value = withTiming(-2, { duration: animation.fast });
    shadowOpacity.value = withTiming(0.06, { duration: animation.fast });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, LIGHT_SPRING_CONFIG);
    translateY.value = withTiming(0, { duration: animation.normal });
    shadowOpacity.value = withTiming(0, { duration: animation.normal });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    animatedStyle,
    onPressIn,
    onPressOut,
  };
}

/** 按钮点击动画 Hook */
export function useButtonPress() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    'worklet';
    scale.value = withSpring(0.96, LIGHT_SPRING_CONFIG);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, LIGHT_SPRING_CONFIG);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    animatedStyle,
    onPressIn,
    onPressOut,
  };
}

/** 淡入动画 Hook */
export function useFadeIn(duration: number = animation.normal, delay: number = 0) {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const start = useCallback(() => {
    'worklet';
    opacity.value = withDelay(delay, withTiming(1, { duration }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, delay]);

  return {
    animatedStyle,
    start,
    opacity,
  };
}

/** 滑入动画 Hook */
export function useSlideIn(
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  distance: number = 20,
  duration: number = animation.normal,
  delay: number = 0,
) {
  const progress = useSharedValue(0);

  const getTransform = useCallback(() => {
    const translateX =
      direction === 'left' ? -distance : direction === 'right' ? distance : 0;
    const translateY =
      direction === 'up' ? distance : direction === 'down' ? -distance : 0;

    return {
      transform: [
        {
          translateX: interpolate(
            progress.value,
            [0, 1],
            [translateX, 0],
            Extrapolation.CLAMP,
          ),
        },
        {
          translateY: interpolate(
            progress.value,
            [0, 1],
            [translateY, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
      opacity: progress.value,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, distance]);

  const animatedStyle = useAnimatedStyle(getTransform);

  const start = useCallback(() => {
    'worklet';
    progress.value = withDelay(delay, withTiming(1, { duration }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, delay]);

  return {
    animatedStyle,
    start,
    progress,
  };
}

/** 缩放动画 Hook */
export function useScaleIn(duration: number = animation.normal, delay: number = 0) {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(progress.value, [0, 1], [0.8, 1], Extrapolation.CLAMP),
      },
    ],
    opacity: progress.value,
  }));

  const start = useCallback(() => {
    'worklet';
    progress.value = withDelay(delay, withTiming(1, { duration }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, delay]);

  return {
    animatedStyle,
    start,
    progress,
  };
}

/** 抖动动画 Hook */
export function useShake() {
  const offset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const start = useCallback(() => {
    'worklet';
    offset.value = withTiming(10, { duration: 50 }, () => {
      offset.value = withTiming(-10, { duration: 50 }, () => {
        offset.value = withTiming(8, { duration: 50 }, () => {
          offset.value = withTiming(-8, { duration: 50 }, () => {
            offset.value = withTiming(4, { duration: 50 }, () => {
              offset.value = withTiming(-4, { duration: 50 }, () => {
                offset.value = withTiming(0, { duration: 50 });
              });
            });
          });
        });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    animatedStyle,
    start,
  };
}

/** 脉冲动画 Hook */
export function usePulse(minScale: number = 0.95, maxScale: number = 1.05) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const start = useCallback(() => {
    'worklet';
    scale.value = withTiming(maxScale, { duration: 300 }, () => {
      scale.value = withTiming(minScale, { duration: 300 }, () => {
        scale.value = withTiming(1, { duration: 300 });
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minScale, maxScale]);

  return {
    animatedStyle,
    start,
    scale,
  };
}

/** 渐变进度动画 Hook */
export function useProgressAnimation(targetValue: number, duration: number = animation.slow) {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progress.value, [0, 1], [0, targetValue], Extrapolation.CLAMP)}%`,
  }));

  const start = useCallback(() => {
    'worklet';
    progress.value = withTiming(targetValue / 100, { duration });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetValue, duration]);

  return {
    animatedStyle,
    start,
    progress,
  };
}

/** 列表项交错动画 Hook - 单个项 */
export function useStaggeredItem(index: number, staggerDelay: number = 50) {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [20, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const start = useCallback(() => {
    'worklet';
    progress.value = withDelay(
      index * staggerDelay,
      withTiming(1, { duration: animation.normal }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, staggerDelay]);

  return {
    animatedStyle,
    start,
    progress,
  };
}

/** 导出 Animated 组件 */
export { Animated };

/** 导出动画工具 */
export const AnimationUtils = {
  /** 创建弹簧动画 */
  spring: (toValue: number, config?: Partial<typeof SPRING_CONFIG>) =>
    withSpring(toValue, { ...SPRING_CONFIG, ...config }),

  /** 创建时序动画 */
  timing: (toValue: number, duration: number = animation.normal) =>
    withTiming(toValue, { duration }),

  /** 插值计算 */
  interpolate: (
    value: number,
    inputRange: number[],
    outputRange: number[],
    extrapolation?: Extrapolation,
  ) => interpolate(value, inputRange, outputRange, extrapolation),
};

export type { SharedValue, AnimatedStyle, BaseAnimationBuilder, EntryExitAnimationFunction };
