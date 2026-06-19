import { Alert, Platform } from 'react-native';

/**
 * 跨平台确认弹窗。
 * 移动端使用 Alert.alert，网页端使用 window.confirm。
 * 返回 true 表示用户确认，false 表示取消。
 */
export function confirm(title: string, message: string): boolean {
  if (Platform.OS === 'web') {
    return window.confirm(message);
  }
  // 同步版本无法直接获取 Alert 结果，此函数仅供网页端使用。
  // 移动端请继续使用 Alert.alert + onPress 回调。
  return true;
}

/**
 * 跨平台提示弹窗。
 * 移动端使用 Alert.alert，网页端使用 window.alert。
 */
export function alert(title: string, message?: string): void {
  if (Platform.OS === 'web') {
    window.alert(message ?? title);
  } else {
    Alert.alert(title, message);
  }
}

/**
 * 跨平台确认弹窗（异步版，统一移动端与网页端行为）。
 * 确认后执行 onConfirm，取消则什么都不做。
 */
export function confirmAsync(
  title: string,
  message: string,
  onConfirm: () => void,
): void {
  if (Platform.OS === 'web') {
    if (window.confirm(message)) {
      onConfirm();
    }
  } else {
    Alert.alert(title, message, [
      { text: '取消', style: 'cancel' },
      { text: '确定', style: 'destructive', onPress: onConfirm },
    ]);
  }
}
