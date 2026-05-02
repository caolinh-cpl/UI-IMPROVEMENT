import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadows } from '../../theme';
import Card from '../../components/common/Card';
import Tag from '../../components/common/Tag';
import Button from '../../components/common/Button';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

const LOOK_OF_DAY = {
  name: 'Fresh Dewy Look',
  occasion: 'Work / Daytime',
  description: 'Light coverage, glowing finish — perfect for your combination skin. Elongate your eye with a flick at the outer corner to complement your almond eye shape.',
  palette: ['#F5D6CE', '#E8A59A', '#C96B6B', '#8B4513', '#FFF8F0'],
  paletteNames: ['Blush', 'Lip', 'Cheek', 'Brow', 'Highlight'],
  tips: [
    'Apply foundation from center out',
    'Peach-toned blush for warm undertone',
    'Soft brown liner instead of black',
    'Elongate eye with outer corner flick',
  ],
};

const SHADE_MATCHES = [
  { brand: 'Laneige', shade: 'N23 Natural Beige', color: '#E8C4A0', match: '97%' },
  { brand: 'Maybelline', shade: 'W21 Warm Nude', color: '#DBBF99', match: '94%' },
  { brand: "L'Oreal", shade: 'Beige Ivoire', color: '#F0D5B8', match: '91%' },
  { brand: 'Hera', shade: '21N Neutral', color: '#E6C9A8', match: '89%' },
];

const FACE_ANALYSIS = {
  faceShape: 'Oval',
  eyeType: 'Almond',
  undertone: 'Warm',
  contouring: 'Light temple shadow, highlight on brow bone',
  lipShape: 'Full with defined cupid\'s bow',
};

const MAKEUP_PRODUCTS = [
  { id: '1', name: 'Laneige Neo Cushion', brand: 'Laneige', category: 'Foundation', price: 620000, safe: true, spf: 'SPF 50+' },
  { id: '2', name: 'Peripera Ink Velvet', brand: 'Peripera', category: 'Lip', price: 145000, safe: true, shade: '#5 All That Coral' },
  { id: '3', name: 'Romand Juicy Lasting Tint', brand: 'Romand', category: 'Lip', price: 165000, safe: true, shade: '#12 Petal Juice' },
  { id: '4', name: '3CE Mood Recipe Blush', brand: '3CE', category: 'Blush', price: 280000, safe: true, shade: 'Pink Cheeky' },
];

const COLOR_SEASONS = [
  { key: 'spring', label: 'Spring', emoji: '🌸', desc: 'Light warm' },
  { key: 'summer', label: 'Summer', emoji: '🌊', desc: 'Light cool' },
  { key: 'autumn', label: 'Autumn', emoji: '🍂', desc: 'Deep warm' },
  { key: 'winter', label: 'Winter', emoji: '❄️', desc: 'Deep cool' },
];

export default function MakeupScreen() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'look' | 'analysis' | 'shades' | 'premium'>('look');
  const [acneSafeFilter, setAcneSafeFilter] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[typography.displaySm, { color: colors.textPrimary }]}>Makeup</Text>
        <View style={styles.filterRow}>
          <Text style={[typography.labelMd, { color: colors.textSecondary }]}>Acne-safe</Text>
          <Switch
            value={acneSafeFilter}
            onValueChange={setAcneSafeFilter}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={acneSafeFilter ? colors.primary : colors.surface}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(['look', 'analysis', 'shades', 'premium'] as const).map((t) => {
          const labels = { look: '💄 Look', analysis: '🔍 Analysis', shades: '🎨 Shades', premium: '👑 Color' };
          return (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === t && styles.tabActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[typography.labelMd, { color: activeTab === t ? colors.primary : colors.textTertiary }]}>
                {labels[t]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ── Look of the Day ── */}
        {activeTab === 'look' && (
          <View>
            {/* Date / occasion */}
            <LinearGradient colors={[colors.primaryPale, '#FAEAE4']} style={styles.lookHero}>
              <View>
                <Text style={[typography.labelMd, { color: colors.primaryDeep }]}>{LOOK_OF_DAY.occasion}</Text>
                <Text style={[typography.displaySm, { color: colors.textPrimary, marginTop: 4 }]}>
                  {LOOK_OF_DAY.name}
                </Text>
                <Text style={[typography.bodyMd, { color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 21 }]}>
                  {LOOK_OF_DAY.description}
                </Text>
              </View>

              {/* Palette swatches */}
              <View style={styles.paletteRow}>
                {LOOK_OF_DAY.palette.map((c, i) => (
                  <View key={i} style={styles.swatchWrap}>
                    <View style={[styles.swatch, { backgroundColor: c }]} />
                    <Text style={[typography.caption, { color: colors.textTertiary, marginTop: 3, textAlign: 'center' }]}>
                      {LOOK_OF_DAY.paletteNames[i]}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>

            {/* Tips */}
            <Text style={[typography.headingMd, styles.sectionTitle]}>Technique Tips</Text>
            {LOOK_OF_DAY.tips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={styles.tipDot} />
                <Text style={[typography.bodyMd, { color: colors.textSecondary, flex: 1 }]}>{tip}</Text>
              </View>
            ))}

            {/* Product picks */}
            <Text style={[typography.headingMd, styles.sectionTitle]}>Products for This Look</Text>
            {MAKEUP_PRODUCTS.filter((p) => !acneSafeFilter || p.safe).map((p) => (
              <Card key={p.id} variant="outlined" style={styles.productCard}>
                <View style={styles.productRow}>
                  <View style={styles.productIcon}>
                    <Text style={{ fontSize: 22 }}>{p.category === 'Foundation' ? '🧴' : p.category === 'Lip' ? '💋' : '🌸'}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={[typography.headingSm, { color: colors.textPrimary }]}>{p.name}</Text>
                    <Text style={[typography.bodySm, { color: colors.textTertiary }]}>{p.brand} · {p.category}</Text>
                    {'shade' in p && p.shade && (
                      <Text style={[typography.bodySm, { color: colors.primary }]}>{p.shade}</Text>
                    )}
                  </View>
                  <View style={styles.productRight}>
                    <Text style={[typography.labelLg, { color: colors.textPrimary }]}>
                      {(p.price / 1000).toFixed(0)}K
                    </Text>
                    {p.safe && <Tag label="✓ Safe" variant="safe" />}
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* ── Face Analysis ── */}
        {activeTab === 'analysis' && (
          <View>
            <LinearGradient colors={[colors.primaryPale, colors.surfaceAlt]} style={styles.analysisHero}>
              <View style={styles.faceIcon}>
                <Text style={{ fontSize: 52 }}>👤</Text>
              </View>
              <Text style={[typography.headingMd, { color: colors.textPrimary, marginTop: spacing.md }]}>
                Your Face Analysis
              </Text>
              <Text style={[typography.bodyMd, { color: colors.textSecondary, textAlign: 'center' }]}>
                Based on your onboarding selfie
              </Text>
            </LinearGradient>

            <View style={styles.analysisGrid}>
              {[
                { label: 'Face Shape', value: FACE_ANALYSIS.faceShape, emoji: '💎', desc: 'Suits most styles' },
                { label: 'Eye Type', value: FACE_ANALYSIS.eyeType, emoji: '👁️', desc: 'Natural elongation works well' },
                { label: 'Undertone', value: FACE_ANALYSIS.undertone, emoji: '🎨', desc: 'Gold & peach tones suit you' },
                { label: 'Lip Shape', value: 'Full', emoji: '💋', desc: FACE_ANALYSIS.lipShape },
              ].map((item) => (
                <Card key={item.label} variant="outlined" style={styles.analysisCard}>
                  <Text style={{ fontSize: 28, marginBottom: spacing.xs }}>{item.emoji}</Text>
                  <Text style={[typography.labelMd, { color: colors.textTertiary }]}>{item.label}</Text>
                  <Text style={[typography.headingSm, { color: colors.primary, marginTop: 2 }]}>{item.value}</Text>
                  <Text style={[typography.bodySm, { color: colors.textTertiary, marginTop: spacing.xs, textAlign: 'center' }]}>
                    {item.desc}
                  </Text>
                </Card>
              ))}
            </View>

            <Card variant="filled" style={styles.contourCard}>
              <Text style={[typography.headingSm, { color: colors.textPrimary, marginBottom: spacing.sm }]}>
                ✨ Highlight & Contour Placement
              </Text>
              <Text style={[typography.bodyMd, { color: colors.textSecondary, lineHeight: 21 }]}>
                {FACE_ANALYSIS.contouring}. For your oval face, minimal contouring is needed — focus on a subtle highlight on the bridge of the nose and cupid's bow.
              </Text>
            </Card>
          </View>
        )}

        {/* ── Shade Finder ── */}
        {activeTab === 'shades' && (
          <View>
            <View style={styles.shadeHero}>
              <Text style={{ fontSize: 32 }}>🎨</Text>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={[typography.headingMd, { color: colors.textPrimary }]}>Your Shade Matches</Text>
                <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
                  Based on Warm undertone · Light-medium depth
                </Text>
              </View>
            </View>

            {SHADE_MATCHES.map((s) => (
              <Card key={s.brand} variant="outlined" style={styles.shadeCard}>
                <View style={styles.shadeRow}>
                  <View style={[styles.shadeSwatch, { backgroundColor: s.color }]} />
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={[typography.headingSm, { color: colors.textPrimary }]}>{s.brand}</Text>
                    <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>{s.shade}</Text>
                  </View>
                  <View style={styles.matchBadge}>
                    <Text style={[typography.labelLg, { color: colors.success }]}>{s.match}</Text>
                    <Text style={[typography.caption, { color: colors.textTertiary }]}>match</Text>
                  </View>
                </View>
              </Card>
            ))}

            <Card variant="filled" style={styles.shadeNote}>
              <Text style={[typography.bodyMd, { color: colors.textSecondary, lineHeight: 21 }]}>
                💡 Shade matches are based on your analyzed skin tone from your onboarding selfie. Try in-store before purchasing when possible.
              </Text>
            </Card>
          </View>
        )}

        {/* ── Premium: Color Analysis ── */}
        {activeTab === 'premium' && (
          <View>
            {!state.isPremium ? (
              <View>
                <LinearGradient
                  colors={[colors.goldLight, '#FDF5DC']}
                  style={styles.premiumBanner}
                >
                  <Text style={{ fontSize: 40 }}>👑</Text>
                  <Text style={[typography.displaySm, { color: colors.gold, marginTop: spacing.md, textAlign: 'center' }]}>
                    Personal Color Analysis
                  </Text>
                  <Text style={[typography.bodyMd, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 21 }]}>
                    Unlock your seasonal color season (Spring / Summer / Autumn / Winter) and get a full palette of recommended clothing, accessories, and makeup colors.
                  </Text>

                  <View style={styles.seasonGrid}>
                    {COLOR_SEASONS.map((s) => (
                      <View key={s.key} style={styles.seasonCard}>
                        <Text style={{ fontSize: 26 }}>{s.emoji}</Text>
                        <Text style={[typography.labelLg, { color: colors.textPrimary }]}>{s.label}</Text>
                        <Text style={[typography.bodySm, { color: colors.textTertiary }]}>{s.desc}</Text>
                      </View>
                    ))}
                  </View>

                  <Button
                    label="Unlock for 49,000 VND/mo"
                    onPress={() => {}}
                    size="lg"
                    fullWidth
                    style={{ marginTop: spacing.xl }}
                  />
                  <Text style={[typography.bodyMd, { color: colors.textTertiary, textAlign: 'center', marginTop: spacing.sm }]}>
                    Cancel anytime · One-time analysis included
                  </Text>
                </LinearGradient>
              </View>
            ) : (
              <View>
                <Text style={[typography.headingMd, { color: colors.textPrimary }]}>Your Color Season: Autumn 🍂</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.primary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.huge },
  lookHero: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  paletteRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  swatchWrap: { alignItems: 'center' },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    ...shadows.sm,
  },
  sectionTitle: { color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.md },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  productCard: { marginBottom: spacing.md },
  productRow: { flexDirection: 'row', alignItems: 'center' },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productRight: { alignItems: 'flex-end', gap: spacing.xs },
  analysisHero: {
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  faceIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  analysisCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    alignItems: 'center',
    padding: spacing.lg,
  },
  contourCard: { marginBottom: spacing.lg },
  shadeHero: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shadeCard: { marginBottom: spacing.md },
  shadeRow: { flexDirection: 'row', alignItems: 'center' },
  shadeSwatch: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: colors.border,
  },
  matchBadge: { alignItems: 'center' },
  shadeNote: { marginTop: spacing.sm },
  premiumBanner: {
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  seasonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.xl,
    justifyContent: 'center',
  },
  seasonCard: {
    width: (width - spacing.xxl * 2 - spacing.lg * 4) / 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
});
