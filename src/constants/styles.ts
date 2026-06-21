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
    borderRadius: 16,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.06)',
  },
  cardElevated: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  textPrimary: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  textSecondary: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  textTertiary: {
    fontSize: 12,
    color: colors.textTertiary,
    lineHeight: 16,
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(64, 128, 255, 0.3)',
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.3,
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
