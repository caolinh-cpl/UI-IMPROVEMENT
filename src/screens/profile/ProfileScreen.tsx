import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  Dimensions,
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

const FREE_FEATURES = [
  { icon: 'chatbubble-ellipses-outline', label: 'AI chatbot + suggested questions' },
  { icon: 'camera-outline', label: 'Skin profile builder (photo + quiz)' },
  { icon: 'sunny-outline', label: 'AM/PM routine scheduler' },
  { icon: 'list-outline', label: 'Product log & reaction tracker' },
  { icon: 'flask-outline', label: 'Ingredient decoder' },
  { icon: 'people-outline', label: 'Community reviews feed' },
  { icon: 'bag-outline', label: 'Affiliate product recommendations' },
];

const PREMIUM_FEATURES = [
  { icon: 'scan-outline', label: 'Skin photo CV analysis (deep skin report)' },
  { icon: 'color-palette-outline', label: 'Personal color analysis (seasonal system)' },
  { icon: 'leaf-outline', label: 'Supplement & diet guide for your skin' },
  { icon: 'person-outline', label: 'Expert chat — verified dermatologist access' },
];

const SETTINGS_SECTIONS = [
  {
    title: 'Reminders',
    items: [
      { key: 'amReminder', label: 'AM routine reminder', icon: 'sunny-outline', sub: '7:00 AM' },
      { key: 'pmReminder', label: 'PM routine reminder', icon: 'moon-outline', sub: '9:00 PM' },
      { key: 'weeklyCheckIn', label: 'Weekly check-in', icon: 'calendar-outline', sub: 'Every Sunday' },
    ],
  },
];

export default function ProfileScreen() {
  const { state, dispatch } = useApp();
  const [amReminder, setAmReminder] = useState(true);
  const [pmReminder, setPmReminder] = useState(true);
  const [weeklyCheckIn, setWeeklyCheckIn] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

  const skin = state.skinProfile;
  const streak = state.currentStreak || 5;
  const isPremium = state.isPremium;

  function handleUpgrade() {
    dispatch({ type: 'SET_PREMIUM', payload: true });
    setShowPremium(false);
    Alert.alert('Welcome to Aura Premium! 👑', 'Your premium features are now unlocked.');
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Profile card */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileHero}
        >
          <View style={styles.avatarCircle}>
            <Text style={{ fontSize: 36 }}>👤</Text>
          </View>
          <Text style={[typography.displaySm, { color: '#fff', marginTop: spacing.md }]}>Linh</Text>
          <Text style={[typography.bodyMd, { color: 'rgba(255,255,255,0.8)' }]}>
            Aura member since April 2025
          </Text>

          {isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={{ fontSize: 14 }}>👑</Text>
              <Text style={[typography.labelMd, { color: colors.gold }]}>Premium</Text>
            </View>
          )}

          {/* Stats row */}
          <View style={styles.statsRow}>
            {[
              { value: streak, label: 'Day Streak', icon: '🔥' },
              { value: 76, label: 'Skin Score', icon: '✨' },
              { value: state.productLog.length || 3, label: 'Products', icon: '🧴' },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={{ fontSize: 18 }}>{s.icon}</Text>
                <Text style={[typography.headingLg, { color: '#fff' }]}>{s.value}</Text>
                <Text style={[typography.caption, { color: 'rgba(255,255,255,0.7)' }]}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Skin profile summary */}
        <Card variant="outlined" style={styles.section}>
          <Text style={[typography.headingMd, styles.sectionTitle]}>Your Skin Profile</Text>
          <View style={styles.profileGrid}>
            {[
              { label: 'Skin Type', value: skin.skinType ? skin.skinType.charAt(0).toUpperCase() + skin.skinType.slice(1) : 'Combination' },
              { label: 'Concern', value: skin.concerns[0] ? skin.concerns[0].replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Acne' },
              { label: 'Undertone', value: skin.undertone ? skin.undertone.charAt(0).toUpperCase() + skin.undertone.slice(1) : 'Warm' },
              { label: 'Face Shape', value: skin.faceShape ? skin.faceShape.charAt(0).toUpperCase() + skin.faceShape.slice(1) : 'Oval' },
            ].map((item) => (
              <View key={item.label} style={styles.profileGridItem}>
                <Text style={[typography.labelMd, { color: colors.textTertiary }]}>{item.label}</Text>
                <Text style={[typography.headingSm, { color: colors.primary }]}>{item.value}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={[typography.labelMd, { color: colors.primary }]}>Edit skin profile →</Text>
          </TouchableOpacity>
        </Card>

        {/* Freemium card */}
        {!isPremium ? (
          <TouchableOpacity onPress={() => setShowPremium(true)} activeOpacity={0.9}>
            <LinearGradient
              colors={[colors.goldLight, '#FAEFD8']}
              style={styles.premiumTeaser}
            >
              <View style={styles.premiumTeaserLeft}>
                <Text style={{ fontSize: 28 }}>👑</Text>
              </View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={[typography.headingMd, { color: colors.gold }]}>Unlock Premium</Text>
                <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
                  Deep skin analysis, color season, expert chat
                </Text>
                <Text style={[typography.labelLg, { color: colors.gold, marginTop: spacing.xs }]}>
                  49,000 VND/month →
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <Card variant="outlined" style={[styles.section, { borderColor: colors.gold }]}>
            <View style={styles.premiumActiveRow}>
              <Text style={{ fontSize: 24 }}>👑</Text>
              <Text style={[typography.headingMd, { color: colors.gold, flex: 1, marginLeft: spacing.md }]}>
                Aura Premium Active
              </Text>
              <Tag label="Active" variant="premium" />
            </View>
          </Card>
        )}

        {/* Feature list */}
        <Card variant="outlined" style={styles.section}>
          <Text style={[typography.headingMd, styles.sectionTitle]}>Free Features</Text>
          {FREE_FEATURES.map((f) => (
            <View key={f.label} style={styles.featureRow}>
              <Ionicons name={f.icon as any} size={18} color={colors.success} />
              <Text style={[typography.bodyMd, { color: colors.textSecondary, flex: 1 }]}>{f.label}</Text>
              <Ionicons name="checkmark" size={16} color={colors.success} />
            </View>
          ))}
        </Card>

        <Card variant="outlined" style={[styles.section, !isPremium && { opacity: 0.7 }]}>
          <View style={styles.premiumFeaturesHeader}>
            <Text style={[typography.headingMd, styles.sectionTitle]}>Premium Features</Text>
            {!isPremium && <Tag label="49K/mo" variant="premium" />}
          </View>
          {PREMIUM_FEATURES.map((f) => (
            <View key={f.label} style={styles.featureRow}>
              <Ionicons name={f.icon as any} size={18} color={isPremium ? colors.gold : colors.textTertiary} />
              <Text style={[typography.bodyMd, { color: isPremium ? colors.textSecondary : colors.textTertiary, flex: 1 }]}>
                {f.label}
              </Text>
              {isPremium ? (
                <Ionicons name="checkmark" size={16} color={colors.gold} />
              ) : (
                <Ionicons name="lock-closed-outline" size={16} color={colors.textTertiary} />
              )}
            </View>
          ))}
        </Card>

        {/* Reminders */}
        <Card variant="outlined" style={styles.section}>
          <Text style={[typography.headingMd, styles.sectionTitle]}>🔔 Reminders</Text>
          {[
            { label: 'AM routine reminder', sub: '7:00 AM daily', value: amReminder, set: setAmReminder, icon: 'sunny-outline' },
            { label: 'PM routine reminder', sub: '9:00 PM daily', value: pmReminder, set: setPmReminder, icon: 'moon-outline' },
            { label: 'Weekly check-in', sub: 'Every Sunday', value: weeklyCheckIn, set: setWeeklyCheckIn, icon: 'calendar-outline' },
          ].map((item) => (
            <View key={item.label} style={styles.settingRow}>
              <Ionicons name={item.icon as any} size={18} color={colors.primary} style={{ marginRight: spacing.md }} />
              <View style={{ flex: 1 }}>
                <Text style={[typography.bodyMd, { color: colors.textPrimary }]}>{item.label}</Text>
                <Text style={[typography.bodySm, { color: colors.textTertiary }]}>{item.sub}</Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={item.set}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={item.value ? colors.primary : colors.surface}
              />
            </View>
          ))}
        </Card>

        {/* Account actions */}
        <Card variant="outlined" style={styles.section}>
          {[
            { icon: 'person-outline', label: 'Edit Account', color: colors.textPrimary },
            { icon: 'shield-outline', label: 'Privacy Settings', color: colors.textPrimary },
            { icon: 'help-circle-outline', label: 'Help & Support', color: colors.textPrimary },
            { icon: 'star-outline', label: 'Rate Aura', color: colors.textPrimary },
            { icon: 'log-out-outline', label: 'Sign Out', color: colors.error },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuRow} onPress={() => {}}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
              <Text style={[typography.bodyMd, { color: item.color, flex: 1, marginLeft: spacing.md }]}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </Card>

        <Text style={[typography.caption, styles.versionText]}>Aura v1.0.0 · Made for your skin ✨</Text>
      </ScrollView>

      {/* Premium Modal */}
      <Modal visible={showPremium} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowPremium(false)}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>

            <Text style={{ fontSize: 44, textAlign: 'center' }}>👑</Text>
            <Text style={[typography.displaySm, { color: colors.gold, textAlign: 'center', marginTop: spacing.md }]}>
              Aura Premium
            </Text>
            <Text style={[typography.bodyMd, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 21 }]}>
              At 49,000 VND/month — just 10% of your monthly skincare spend — one avoided wrong purchase pays for 4–6 months.
            </Text>

            <View style={styles.premiumFeatureList}>
              {PREMIUM_FEATURES.map((f) => (
                <View key={f.label} style={styles.premiumFeatureItem}>
                  <View style={styles.premiumFeatureIcon}>
                    <Ionicons name={f.icon as any} size={18} color={colors.gold} />
                  </View>
                  <Text style={[typography.bodyMd, { color: colors.textPrimary, flex: 1 }]}>{f.label}</Text>
                </View>
              ))}
            </View>

            <Button
              label="Unlock Premium — 49,000 VND/mo"
              onPress={handleUpgrade}
              fullWidth
              size="lg"
              style={{ marginTop: spacing.xl }}
            />
            <Text style={[typography.bodyMd, { color: colors.textTertiary, textAlign: 'center', marginTop: spacing.md }]}>
              Cancel anytime. No commitment.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.huge },
  profileHero: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl,
    marginBottom: spacing.xl,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center', gap: spacing.xs },
  section: { marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionTitle: { color: colors.textPrimary, marginBottom: spacing.md },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  profileGridItem: {
    width: (width - spacing.lg * 2 - spacing.lg * 2 - spacing.md) / 2,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  editProfileBtn: { alignItems: 'center', paddingTop: spacing.sm },
  premiumTeaser: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  premiumTeaserLeft: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(212,168,67,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumActiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumFeaturesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  versionText: {
    textAlign: 'center',
    color: colors.textTertiary,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
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
  modalClose: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.xl,
    padding: spacing.xs,
    zIndex: 1,
  },
  premiumFeatureList: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  premiumFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  premiumFeatureIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
