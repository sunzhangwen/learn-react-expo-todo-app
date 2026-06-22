import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { THEME_LIST, ThemeName } from '@/constants/themes';
import { useTheme } from '@/hooks/useTheme';

type ThemeSelectorProps = {
  visible: boolean;
  onClose: () => void;
};

/** 主题选择弹窗 */
export function ThemeSelector({ visible, onClose }: ThemeSelectorProps) {
  const { themeName, setTheme, colors, isDark } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(themeName);

  const handleSelect = async (name: ThemeName) => {
    setSelectedTheme(name);
    await setTheme(name);
  };

  const handleClose = () => {
    setSelectedTheme(themeName);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <View style={[styles.header, { borderBottomColor: colors.borderLight }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>选择主题</Text>
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.themeList}>
            {THEME_LIST.map((theme) => {
              const isSelected = selectedTheme === theme.name;
              const themeColors = isDark ? theme.darkColors : theme.colors;
              const themeGradient = themeColors.gradient.primary;
              return (
                <TouchableOpacity
                  key={theme.name}
                  style={[
                    styles.themeCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    isSelected && { borderColor: themeColors.primary, borderWidth: 2 },
                  ]}
                  onPress={() => handleSelect(theme.name)}
                  activeOpacity={0.7}
                >
                  <View style={styles.themePreview}>
                    <LinearGradient
                      colors={themeGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.previewHeader}
                    >
                      <View style={styles.previewBar} />
                      <View style={styles.previewContent}>
                        <View style={[styles.previewCard, { backgroundColor: 'rgba(255,255,255,0.9)' }]} />
                        <View style={[styles.previewCard, { backgroundColor: 'rgba(255,255,255,0.7)' }]} />
                      </View>
                    </LinearGradient>
                  </View>

                  <View style={styles.themeInfo}>
                    <View style={styles.themeNameRow}>
                      <Text style={[styles.themeLabel, { color: colors.textPrimary }]}>
                        {theme.label}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={20} color={themeColors.primary} />
                      )}
                    </View>
                    <Text style={[styles.themeDescription, { color: colors.textSecondary }]}>
                      {theme.description}
                    </Text>

                    <View style={styles.colorDots}>
                      <View style={[styles.colorDot, { backgroundColor: themeColors.primary }]} />
                      <View style={[styles.colorDot, { backgroundColor: themeColors.success }]} />
                      <View style={[styles.colorDot, { backgroundColor: themeColors.warning }]} />
                      <View style={[styles.colorDot, { backgroundColor: themeColors.danger }]} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  themeList: {
    padding: 16,
    gap: 12,
  },
  themeCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  themePreview: {
    width: 80,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewHeader: {
    flex: 1,
    padding: 8,
  },
  previewBar: {
    width: '60%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 3,
    marginBottom: 8,
  },
  previewContent: {
    gap: 4,
  },
  previewCard: {
    height: 12,
    borderRadius: 4,
  },
  themeInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  themeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  themeDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  colorDots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});
