export const colors = {
  // Primary palette — warm nude/rose
  primary: '#C96B6B',
  primaryLight: '#E8A598',
  primaryPale: '#F5D6CE',
  primaryDeep: '#A04848',

  // Neutrals
  background: '#FDF6F0',
  surface: '#FFFFFF',
  surfaceAlt: '#FDF0EA',
  border: '#F0E4DC',

  // Text
  textPrimary: '#2C1810',
  textSecondary: '#7A5C52',
  textTertiary: '#B8968A',
  textOnPrimary: '#FFFFFF',

  // Semantic
  success: '#7CB87A',
  successLight: '#D4EDD3',
  warning: '#E6B86A',
  warningLight: '#FAF0DC',
  error: '#D65C5C',
  errorLight: '#FADADD',
  info: '#6A9FE6',
  infoLight: '#D8E8FA',

  // Skin tone indicators
  skinWarm: '#E8C49A',
  skinCool: '#C4C9E8',
  skinNeutral: '#D4C0B4',

  // Tab bar
  tabActive: '#C96B6B',
  tabInactive: '#C4AEA6',

  // Overlay
  overlay: 'rgba(44, 24, 16, 0.5)',
  overlayLight: 'rgba(44, 24, 16, 0.12)',

  // Premium
  gold: '#D4A843',
  goldLight: '#FAF0D4',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  giant: 64,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const typography = {
  displayLg: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  displayMd: { fontSize: 26, fontWeight: '700' as const, lineHeight: 34 },
  displaySm: { fontSize: 22, fontWeight: '600' as const, lineHeight: 30 },
  headingLg: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  headingMd: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  headingSm: { fontSize: 16, fontWeight: '600' as const, lineHeight: 22 },
  bodyLg: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMd: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySm: { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
  labelLg: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  labelMd: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
  labelSm: { fontSize: 11, fontWeight: '500' as const, lineHeight: 14 },
  caption: { fontSize: 10, fontWeight: '400' as const, lineHeight: 14 },
};

export const shadows = {
  sm: {
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#2C1810',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};
