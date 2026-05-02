import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { OnboardingParamList } from '../../navigation/OnboardingNavigator';
import { colors, spacing, typography, radius, shadows } from '../../theme';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/common/ProgressBar';
import { useApp } from '../../context/AppContext';
import { SkinType, SkinConcern, Sensitivity } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingParamList, 'OnboardingStep3'>;
  route: RouteProp<OnboardingParamList, 'OnboardingStep3'>;
};

function ToggleRow({
  icon,
  label,
  sub,
  value,
  onToggle,
  premium,
}: {
  icon: string;
  label: string;
  sub?: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  premium?: boolean;
}) {
  return (
    <View style={tStyles.row}>
      <View style={tStyles.iconWrap}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Text style={[typography.headingSm, { color: colors.textPrimary }]}>{label}</Text>
          {premium && (
            <View style={tStyles.premiumBadge}>
              <Text style={[typography.caption, { color: colors.gold }]}>Optional</Text>
            </View>
          )}
        </View>
        {sub && <Text style={[typography.bodySm, { color: colors.textTertiary }]}>{sub}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : colors.surface}
      />
    </View>
  );
}

const tStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.goldLight,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.gold,
  },
});

type NotifKey = 'amReminder' | 'pmReminder' | 'weeklyCheckIn';
type LifestyleKey = 'sleepHours' | 'stressLevel' | 'cycleTracking';

export default function OnboardingStep3({ navigation, route }: Props) {
  const { dispatch } = useApp();
  const { selfieUri, skinType, sensitivities, primaryConcern } = route.params ?? {};

  const [locationEnabled, setLocationEnabled] = useState(true);
  const [lifestyle, setLifestyle] = useState<Record<LifestyleKey, boolean>>({
    sleepHours: false,
    stressLevel: false,
    cycleTracking: false,
  });
  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>({
    amReminder: true,
    pmReminder: true,
    weeklyCheckIn: false,
  });
  const [loading, setLoading] = useState(false);

  function toggleLifestyle(key: LifestyleKey) {
    setLifestyle((p) => ({ ...p, [key]: !p[key] }));
  }

  function toggleNotif(key: NotifKey) {
    setNotifs((p) => ({ ...p, [key]: !p[key] }));
  }

  function handleFinish() {
    setLoading(true);
    setTimeout(() => {
      dispatch({
        type: 'COMPLETE_ONBOARDING',
        payload: {
          skinProfile: {
            skinType: skinType as SkinType,
            concerns: [primaryConcern as SkinConcern],
            sensitivities: sensitivities as Sensitivity[],
            selfieUri,
            baselinePhotoDate: new Date().toISOString(),
          },
          onboardingData: {
            selfieUri,
            skinType: skinType as SkinType,
            sensitivities: sensitivities as Sensitivity[],
            currentProducts: [],
            primaryConcern: primaryConcern as SkinConcern,
            locationEnabled,
            lifestyleTracking: lifestyle,
            notifications: notifs,
            amReminderTime: '07:00',
            pmReminderTime: '21:00',
          },
        },
      });
      setLoading(false);
    }, 1200);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <ProgressBar current={3} total={3} showLabel style={{ flex: 1, marginHorizontal: spacing.md }} />
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[typography.labelMd, styles.stepLabel]}>FINAL STEP</Text>
        <Text style={[typography.displaySm, styles.title]}>Personalize your{'\n'}context</Text>
        <Text style={[typography.bodyMd, styles.subtitle]}>
          Aura uses real-time signals to give you recommendations that adapt to your
          daily life — not generic advice.
        </Text>

        {/* Location section */}
        <View style={styles.section}>
          <Text style={[typography.labelLg, styles.sectionTitle]}>📍  Location & Weather</Text>
          <View style={styles.card}>
            <ToggleRow
              icon="partly-sunny-outline"
              label="Enable location"
              sub="Pulls weather, humidity & UV index daily"
              value={locationEnabled}
              onToggle={setLocationEnabled}
            />
          </View>
        </View>

        {/* Lifestyle section */}
        <View style={styles.section}>
          <Text style={[typography.labelLg, styles.sectionTitle]}>🌙  Lifestyle Check-in</Text>
          <View style={styles.card}>
            <ToggleRow
              icon="moon-outline"
              label="Track sleep hours"
              sub="Affects skin barrier & oil production"
              value={lifestyle.sleepHours}
              onToggle={() => toggleLifestyle('sleepHours')}
            />
            <ToggleRow
              icon="pulse-outline"
              label="Stress level check-in"
              sub="Cortisol triggers breakouts"
              value={lifestyle.stressLevel}
              onToggle={() => toggleLifestyle('stressLevel')}
            />
            <ToggleRow
              icon="flower-outline"
              label="Cycle tracking"
              sub="Hormonal phases affect skin"
              value={lifestyle.cycleTracking}
              onToggle={() => toggleLifestyle('cycleTracking')}
              premium
            />
          </View>
        </View>

        {/* Notifications section */}
        <View style={styles.section}>
          <Text style={[typography.labelLg, styles.sectionTitle]}>🔔  Reminders</Text>
          <View style={styles.card}>
            <ToggleRow
              icon="sunny-outline"
              label="AM routine reminder"
              sub="Remind me every morning"
              value={notifs.amReminder}
              onToggle={() => toggleNotif('amReminder')}
            />
            <ToggleRow
              icon="moon-outline"
              label="PM routine reminder"
              sub="Remind me every evening"
              value={notifs.pmReminder}
              onToggle={() => toggleNotif('pmReminder')}
            />
            <ToggleRow
              icon="calendar-outline"
              label="Weekly check-in"
              sub="Rate your skin every 7 days"
              value={notifs.weeklyCheckIn}
              onToggle={() => toggleNotif('weeklyCheckIn')}
            />
          </View>
        </View>

        {/* Ready callout */}
        <LinearGradient
          colors={[colors.primary, colors.primaryDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.readyCard}
        >
          <Ionicons name="sparkles" size={28} color="#fff" />
          <Text style={[typography.headingMd, { color: '#fff', marginTop: spacing.sm }]}>
            Your profile is ready!
          </Text>
          <Text style={[typography.bodyMd, { color: 'rgba(255,255,255,0.82)', textAlign: 'center', marginTop: spacing.xs }]}>
            Aura will generate your first personalized nudge as soon as you enter the app.
          </Text>
        </LinearGradient>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={loading ? 'Setting up your profile...' : 'Enter Aura →'}
          onPress={handleFinish}
          size="lg"
          fullWidth
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  stepLabel: {
    color: colors.primaryLight,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  readyCard: {
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
