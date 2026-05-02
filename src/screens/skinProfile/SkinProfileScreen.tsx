import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadows } from '../../theme';
import Card from '../../components/common/Card';
import Tag from '../../components/common/Tag';
import Button from '../../components/common/Button';
import Chip from '../../components/common/Chip';
import { useApp } from '../../context/AppContext';
import { ReactionTag, RoutineStep } from '../../types';

const { width } = Dimensions.get('window');

const MOCK_PROGRESS_PHOTOS = [
  { week: 0, label: 'Week 0', date: 'Apr 1', emoji: '📸' },
  { week: 2, label: 'Week 2', date: 'Apr 15', emoji: '📸' },
  { week: 4, label: 'Week 4', date: 'Apr 29', emoji: '📸' },
];

const MOCK_PRODUCTS = [
  { id: '1', name: 'CeraVe Moisturizing Cream', brand: 'CeraVe', reaction: 'works_well' as ReactionTag, days: 42, notes: 'Great for AM routine' },
  { id: '2', name: 'Paula\'s Choice BHA', brand: "Paula's Choice", reaction: 'mild_purge' as ReactionTag, days: 14, notes: 'Mild purging for 1 week then cleared' },
  { id: '3', name: 'Anessa Sunscreen', brand: 'Anessa', reaction: 'works_well' as ReactionTag, days: 60, notes: 'Best SPF I\'ve tried' },
];

const REACTION_LABELS: Record<ReactionTag, { label: string; color: string; emoji: string }> = {
  no_reaction: { label: 'No Reaction', color: colors.success, emoji: '✅' },
  mild_purge: { label: 'Mild Purge', color: colors.warning, emoji: '⚠️' },
  breakout: { label: 'Breakout', color: colors.error, emoji: '❌' },
  works_well: { label: 'Works Well', color: colors.success, emoji: '🌟' },
  discontinued: { label: 'Discontinued', color: colors.textTertiary, emoji: '🚫' },
};

const MOCK_AM_STEPS: RoutineStep[] = [
  { id: '1', productName: 'CeraVe Hydrating Cleanser', brand: 'CeraVe', order: 1, completed: false },
  { id: '2', productName: 'Niacinamide 10% Serum', brand: "Paula's Choice", order: 2, completed: false },
  { id: '3', productName: 'CeraVe Moisturizing Cream', brand: 'CeraVe', order: 3, completed: false },
  { id: '4', productName: 'Anessa Sunscreen SPF 50+', brand: 'Anessa', order: 4, completed: false },
];

const MOCK_PM_STEPS: RoutineStep[] = [
  { id: '5', productName: 'Cerave Foaming Cleanser', brand: 'CeraVe', order: 1, completed: false },
  { id: '6', productName: 'Retinol 0.3%', brand: 'The Ordinary', order: 2, completed: false },
  { id: '7', productName: 'Barrier Repair Moisturizer', brand: 'Cocoon', order: 3, completed: false },
];

export default function SkinProfileScreen() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<'progress' | 'routine' | 'products'>('progress');
  const [amSteps, setAmSteps] = useState(MOCK_AM_STEPS);
  const [pmSteps, setPmSteps] = useState(MOCK_PM_STEPS);
  const [amStreak, setAmStreak] = useState(5);
  const [pmStreak, setPmStreak] = useState(3);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInQ, setCheckInQ] = useState(0);
  const [skinLook, setSkinLook] = useState(0);

  const profile = state.skinProfile;

  function toggleStep(period: 'am' | 'pm', id: string) {
    if (period === 'am') {
      setAmSteps((prev) => prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)));
    } else {
      setPmSteps((prev) => prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s)));
    }
  }

  const skinScore = 76;
  const skinScoreDelta = '+8';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[typography.displaySm, { color: colors.textPrimary }]}>Skin Profile</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => setShowCheckIn(true)}>
          <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Skin Score Hero */}
      <LinearGradient
        colors={[colors.primaryPale, colors.surfaceAlt]}
        style={styles.scoreHero}
      >
        <View style={styles.scoreLeft}>
          <Text style={[typography.displayLg, { color: colors.primary }]}>{skinScore}</Text>
          <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>Skin Score</Text>
          <View style={styles.scoreDelta}>
            <Ionicons name="trending-up" size={14} color={colors.success} />
            <Text style={[typography.labelMd, { color: colors.success }]}>{skinScoreDelta} this week</Text>
          </View>
        </View>
        <View style={styles.scoreRight}>
          <View style={styles.scoreBar}>
            {Array.from({ length: 10 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.scoreBarSegment,
                  { backgroundColor: i < Math.round(skinScore / 10) ? colors.primary : colors.border },
                ]}
              />
            ))}
          </View>
          <Text style={[typography.bodySm, { color: colors.textTertiary, marginTop: spacing.sm }]}>
            Based on 4-week trend
          </Text>
          <TouchableOpacity style={styles.checkInBtn} onPress={() => setShowCheckIn(true)}>
            <Text style={[typography.labelMd, { color: colors.primary }]}>Weekly Check-in →</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(['progress', 'routine', 'products'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, activeTab === t && styles.tabActive]}
            onPress={() => setActiveTab(t)}
          >
            <Text
              style={[
                typography.labelLg,
                { color: activeTab === t ? colors.primary : colors.textTertiary },
              ]}
            >
              {t === 'progress' ? '📈 Progress' : t === 'routine' ? '⏰ Routine' : '🧴 Products'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ── Progress Tab ── */}
        {activeTab === 'progress' && (
          <View>
            <Text style={[typography.headingMd, styles.sectionTitle]}>Photo Timeline</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
              {MOCK_PROGRESS_PHOTOS.map((p) => (
                <View key={p.week} style={styles.photoCard}>
                  <View style={styles.photoPlaceholder}>
                    {state.skinProfile.selfieUri && p.week === 0 ? (
                      <Image source={{ uri: state.skinProfile.selfieUri }} style={styles.photoImg} />
                    ) : (
                      <Text style={{ fontSize: 36 }}>{p.emoji}</Text>
                    )}
                  </View>
                  <Text style={[typography.labelMd, { color: colors.textPrimary, marginTop: spacing.sm }]}>{p.label}</Text>
                  <Text style={[typography.caption, { color: colors.textTertiary }]}>{p.date}</Text>
                </View>
              ))}
              <View style={styles.addPhotoCard}>
                <Ionicons name="camera-outline" size={28} color={colors.primaryLight} />
                <Text style={[typography.labelMd, { color: colors.primary, marginTop: spacing.sm, textAlign: 'center' }]}>
                  Add Photo
                </Text>
              </View>
            </ScrollView>

            {/* Skin profile summary */}
            <Text style={[typography.headingMd, styles.sectionTitle]}>Your Skin Profile</Text>
            <Card variant="outlined" style={styles.profileCard}>
              {[
                { label: 'Skin Type', value: profile.skinType ? profile.skinType.charAt(0).toUpperCase() + profile.skinType.slice(1) : 'Not set', emoji: '🧴' },
                { label: 'Primary Concern', value: profile.concerns[0] ? profile.concerns[0].replace('_', ' ') : 'Not set', emoji: '🎯' },
                { label: 'Sensitivities', value: profile.sensitivities.join(', ') || 'None', emoji: '⚠️' },
                { label: 'Undertone', value: profile.undertone ?? 'Warm (estimated)', emoji: '🎨' },
              ].map((item) => (
                <View key={item.label} style={styles.profileRow}>
                  <Text style={styles.profileEmoji}>{item.emoji}</Text>
                  <Text style={[typography.bodyMd, { color: colors.textSecondary, flex: 1 }]}>{item.label}</Text>
                  <Text style={[typography.labelMd, { color: colors.textPrimary }]}>{item.value}</Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* ── Routine Tab ── */}
        {activeTab === 'routine' && (
          <View>
            {(['AM', 'PM'] as const).map((period) => {
              const steps = period === 'AM' ? amSteps : pmSteps;
              const streak = period === 'AM' ? amStreak : pmStreak;
              const allDone = steps.every((s) => s.completed);

              return (
                <View key={period} style={styles.routineSection}>
                  <View style={styles.routineHeader}>
                    <Text style={styles.routineEmoji}>{period === 'AM' ? '☀️' : '🌙'}</Text>
                    <Text style={[typography.headingMd, { color: colors.textPrimary }]}>
                      {period === 'AM' ? 'Morning' : 'Evening'} Routine
                    </Text>
                    <View style={styles.streakBadge}>
                      <Text style={styles.streakFire}>🔥</Text>
                      <Text style={[typography.labelMd, { color: colors.primary }]}>{streak}</Text>
                    </View>
                  </View>

                  <Card variant="outlined" style={styles.routineCard}>
                    {steps.map((step, idx) => (
                      <View key={step.id}>
                        <TouchableOpacity
                          style={styles.stepRow}
                          onPress={() => toggleStep(period === 'AM' ? 'am' : 'pm', step.id)}
                          activeOpacity={0.75}
                        >
                          <View style={[styles.stepCheck, step.completed && styles.stepCheckDone]}>
                            {step.completed && <Ionicons name="checkmark" size={14} color="#fff" />}
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[typography.bodyMd, { color: step.completed ? colors.textTertiary : colors.textPrimary, textDecorationLine: step.completed ? 'line-through' : 'none' }]}>
                              {step.productName}
                            </Text>
                            {step.brand && (
                              <Text style={[typography.bodySm, { color: colors.textTertiary }]}>{step.brand}</Text>
                            )}
                          </View>
                          <Text style={[typography.labelSm, { color: colors.textTertiary }]}>Step {idx + 1}</Text>
                        </TouchableOpacity>
                        {idx < steps.length - 1 && <View style={styles.stepDivider} />}
                      </View>
                    ))}
                  </Card>

                  {allDone && (
                    <View style={styles.routineComplete}>
                      <Text style={{ fontSize: 18 }}>🎉</Text>
                      <Text style={[typography.labelMd, { color: colors.success }]}>
                        {period} routine complete! Streak: {streak} days
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* ── Products Tab ── */}
        {activeTab === 'products' && (
          <View>
            <View style={styles.productsHeader}>
              <Text style={[typography.headingMd, { color: colors.textPrimary }]}>Product Log</Text>
              <TouchableOpacity style={styles.addProductBtn}>
                <Ionicons name="add" size={16} color={colors.primary} />
                <Text style={[typography.labelMd, { color: colors.primary }]}>Add</Text>
              </TouchableOpacity>
            </View>

            {MOCK_PRODUCTS.map((product) => {
              const rx = REACTION_LABELS[product.reaction];
              return (
                <Card key={product.id} variant="outlined" style={styles.productCard}>
                  <View style={styles.productHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={[typography.headingSm, { color: colors.textPrimary }]}>{product.name}</Text>
                      <Text style={[typography.bodySm, { color: colors.textTertiary }]}>{product.brand}</Text>
                    </View>
                    <View style={[styles.reactionBadge, { borderColor: rx.color, backgroundColor: rx.color + '20' }]}>
                      <Text style={{ fontSize: 12 }}>{rx.emoji}</Text>
                      <Text style={[typography.labelSm, { color: rx.color }]}>{rx.label}</Text>
                    </View>
                  </View>
                  <View style={styles.productMeta}>
                    <Text style={[typography.bodySm, { color: colors.textSecondary }]}>
                      Used for {product.days} days
                    </Text>
                    {product.notes && (
                      <Text style={[typography.bodySm, { color: colors.textTertiary, marginTop: 2 }]}>
                        "{product.notes}"
                      </Text>
                    )}
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Weekly Check-in Modal */}
      <Modal visible={showCheckIn} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[typography.headingMd, { color: colors.textPrimary, marginBottom: spacing.sm }]}>
              Weekly Check-in
            </Text>
            <Text style={[typography.bodyMd, { color: colors.textSecondary, marginBottom: spacing.xl }]}>
              Quick 3-question skin check — takes 30 seconds.
            </Text>

            <Text style={[typography.labelLg, { color: colors.textPrimary, marginBottom: spacing.md }]}>
              How does your skin look today?
            </Text>
            <View style={styles.ratingRow}>
              {['😞', '😐', '🙂', '😊', '🌟'].map((e, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSkinLook(i + 1)}
                  style={[styles.ratingBtn, skinLook === i + 1 && styles.ratingBtnActive]}
                >
                  <Text style={{ fontSize: 24 }}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              label="Submit Check-in"
              onPress={() => setShowCheckIn(false)}
              fullWidth
              size="lg"
              disabled={skinLook === 0}
              style={{ marginTop: spacing.xl }}
            />
            <TouchableOpacity onPress={() => setShowCheckIn(false)} style={{ marginTop: spacing.md, alignItems: 'center' }}>
              <Text style={[typography.labelMd, { color: colors.textTertiary }]}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerBtn: { padding: spacing.xs },
  scoreHero: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLeft: { alignItems: 'center', marginRight: spacing.xl },
  scoreDelta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  scoreRight: { flex: 1 },
  scoreBar: { flexDirection: 'row', gap: 3 },
  scoreBarSegment: { height: 8, flex: 1, borderRadius: 4 },
  checkInBtn: { marginTop: spacing.sm },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
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
  sectionTitle: { color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.md },
  photoScroll: { marginBottom: spacing.md },
  photoCard: {
    width: 100,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primaryLight,
    overflow: 'hidden',
  },
  photoImg: { width: 100, height: 100 },
  addPhotoCard: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  profileCard: { marginBottom: spacing.lg },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileEmoji: { fontSize: 16, width: 24, textAlign: 'center' },
  routineSection: { marginBottom: spacing.xl },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  routineEmoji: { fontSize: 22 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primaryPale,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    marginLeft: 'auto',
  },
  streakFire: { fontSize: 12 },
  routineCard: { marginBottom: spacing.sm },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  stepCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCheckDone: { backgroundColor: colors.success, borderColor: colors.success },
  stepDivider: { height: 1, backgroundColor: colors.border, marginLeft: 38 },
  routineComplete: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.successLight,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addProductBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryPale,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
  },
  productCard: { marginBottom: spacing.md },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  reactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  productMeta: {},
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: spacing.xxl,
    paddingBottom: spacing.huge,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  ratingBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ratingBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryPale },
});
