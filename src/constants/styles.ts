import { StyleSheet } from 'react-native';

import { colors } from './colors';

export const globalStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  textPrimary: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  textSecondary: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  textTertiary: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  primaryButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  flex: {
    flex: 1,
  },
  gapSmall: {
    gap: 8,
  },
  gapMedium: {
    gap: 16,
  },
  paddingHorizontal: {
    paddingHorizontal: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  errorText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
