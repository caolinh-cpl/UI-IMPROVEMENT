import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { OnboardingParamList } from '../../navigation/OnboardingNavigator';
import { colors, spacing, typography, radius } from '../../theme';
import Button from '../../components/common/Button';
import Chip from '../../components/common/Chip';
import ProgressBar from '../../components/common/ProgressBar';
import { SkinType, SkinConcern, Sensitivity } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingParamList, 'OnboardingStep2'>;
  route: RouteProp<OnboardingParamList, 'OnboardingStep2'>;
};

const SKIN_TYPES: { key: SkinType; label: string; emoji: string; desc: string }[] = [
  { key: 'oily', label: 'Oily', emoji: '💧', desc: 'Shiny, large pores' },
  { key: 'combination', label: 'Combination', emoji: '⚖️', desc: 'Oily T-zone, dry cheeks' },
  { key: 'dry', label: 'Dry', emoji: '🌵', desc: 'Tight, flaky patches' },
  { key: 'normal', label: 'Normal', emoji: '✨', desc: 'Balanced, smooth' },
];

const SENSITIVITIES: { key: Sensitivity; label: string; emoji: string }[] = [
  { key: 'fragrance', label: 'Fragrance', emoji: '🌸' },
  { key: 'retinol', label: 'Retinol', emoji: '🔬' },
  { key: 'alcohol', label: 'Alcohol', emoji: '⚗️' },
  { key: 'none', label: 'None', emoji: '✅' },
];

const CONCERNS: { key: SkinConcern; label: string; emoji: string }[] = [
  { key: 'acne', label: 'Acne', emoji: '🔴' },
  { key: 'dullness', label: 'Dullness', emoji: '🌑' },
  { key: 'dryness', label: 'Dryness', emoji: '🏜️' },
  { key: 'aging', label: 'Aging', emoji: '⏳' },
  { key: 'uneven_tone', label: 'Uneven Tone', emoji: '🎨' },
];

export default function OnboardingStep2({ navigation, route }: Props) {
  const { selfieUri } = route.params ?? {};

  const [skinType, setSkinType] = useState<SkinType | undefined>();
  const [sensitivities, setSensitivities] = useState<Sensitivity[]>([]);
  const [concern, setConcern] = useState<SkinConcern | undefined>();
  const [productInput, setProductInput] = useState('');
  const [products, setProducts] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);

  const canProceed =
    currentQ === 0
      ? !!skinType
      : currentQ === 1
      ? sensitivities.length > 0
      : currentQ === 2
      ? true
      : !!concern;

  function toggleSensitivity(key: Sensitivity) {
    if (key === 'none') {
      setSensitivities(['none']);
      return;
    }
    setSensitivities((prev) => {
      const filtered = prev.filter((s) => s !== 'none');
      return filtered.includes(key) ? filtered.filter((s) => s !== key) : [...filtered, key];
    });
  }

  function addProduct() {
    if (productInput.trim()) {
      setProducts((p) => [...p, productInput.trim()]);
      setProductInput('');
    }
  }

  function handleNext() {
    if (currentQ < 3) {
      setCurrentQ(currentQ + 1);
    } else {
      navigation.navigate('OnboardingStep3', {
        selfieUri,
        skinType: skinType!,
        sensitivities,
        primaryConcern: concern!,
      });
    }
  }

  const questions = [
    {
      q: 'What is your skin type?',
      sub: 'How does your skin typically feel by midday?',
    },
    {
      q: 'Any known sensitivities?',
      sub: 'Select everything that causes redness or reactions.',
    },
    {
      q: "What products do you currently use?",
      sub: 'Type the product name or skip if none.',
    },
    {
      q: "What's your primary skin concern?",
      sub: "We'll focus Aura's recommendations on this.",
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => currentQ > 0 ? setCurrentQ(currentQ - 1) : navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <ProgressBar current={2} total={3} showLabel style={{ flex: 1, marginHorizontal: spacing.md }} />
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Question counter */}
        <Text style={[typography.labelMd, styles.qCounter]}>
          Question {currentQ + 1} of 4
        </Text>

        <Text style={[typography.displaySm, styles.question]}>
          {questions[currentQ].q}
        </Text>
        <Text style={[typography.bodyMd, styles.subText]}>
          {questions[currentQ].sub}
        </Text>

        {/* Q1: Skin Type */}
        {currentQ === 0 && (
          <View style={styles.optionGrid}>
            {SKIN_TYPES.map((st) => (
              <TouchableOpacity
                key={st.key}
                onPress={() => setSkinType(st.key)}
                style={[
                  styles.typeCard,
                  skinType === st.key && styles.typeCardSelected,
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.typeEmoji}>{st.emoji}</Text>
                <Text style={[typography.headingSm, { color: skinType === st.key ? colors.primary : colors.textPrimary }]}>
                  {st.label}
                </Text>
                <Text style={[typography.bodySm, { color: colors.textTertiary, textAlign: 'center' }]}>
                  {st.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Q2: Sensitivities */}
        {currentQ === 1 && (
          <View style={styles.chipRow}>
            {SENSITIVITIES.map((s) => (
              <Chip
                key={s.key}
                label={s.label}
                emoji={s.emoji}
                selected={sensitivities.includes(s.key)}
                onPress={() => toggleSensitivity(s.key)}
                size="lg"
                style={styles.chip}
              />
            ))}
          </View>
        )}

        {/* Q3: Current Products */}
        {currentQ === 2 && (
          <View>
            <View style={styles.productInputRow}>
              <TextInput
                value={productInput}
                onChangeText={setProductInput}
                placeholder="e.g. CeraVe Moisturizing Cream"
                placeholderTextColor={colors.textTertiary}
                style={styles.textInput}
                onSubmitEditing={addProduct}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={addProduct} style={styles.addBtn}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            {products.length > 0 && (
              <View style={styles.productTags}>
                {products.map((p, i) => (
                  <View key={i} style={styles.productTag}>
                    <Text style={[typography.labelMd, { color: colors.primary }]}>{p}</Text>
                    <TouchableOpacity onPress={() => setProducts(products.filter((_, j) => j !== i))}>
                      <Ionicons name="close" size={14} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            <Text style={[typography.bodySm, { color: colors.textTertiary, marginTop: spacing.md }]}>
              You can also add products later in your Skin Profile tab.
            </Text>
          </View>
        )}

        {/* Q4: Primary Concern */}
        {currentQ === 3 && (
          <View style={styles.chipColumn}>
            {CONCERNS.map((c) => (
              <TouchableOpacity
                key={c.key}
                onPress={() => setConcern(c.key)}
                style={[styles.concernRow, concern === c.key && styles.concernRowSelected]}
                activeOpacity={0.8}
              >
                <Text style={styles.typeEmoji}>{c.emoji}</Text>
                <Text style={[typography.bodyLg, { color: concern === c.key ? colors.primary : colors.textPrimary, fontWeight: concern === c.key ? '600' : '400' }]}>
                  {c.label}
                </Text>
                {concern === c.key && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} style={{ marginLeft: 'auto' }} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={currentQ < 3 ? 'Continue →' : 'Almost done →'}
          onPress={handleNext}
          disabled={!canProceed}
          size="lg"
          fullWidth
        />
        {currentQ === 2 && (
          <TouchableOpacity onPress={handleNext} style={{ marginTop: spacing.md, alignItems: 'center' }}>
            <Text style={[typography.labelMd, { color: colors.textTertiary }]}>
              Skip — I'll add products later
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

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
  qCounter: {
    color: colors.primaryLight,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  question: {
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subText: {
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  typeCard: {
    width: (width - spacing.xl * 2 - spacing.md) / 2,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 2,
    borderColor: colors.border,
  },
  typeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryPale,
  },
  typeEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  chip: {
    marginBottom: spacing.xs,
  },
  chipColumn: {
    gap: spacing.sm,
  },
  concernRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  concernRowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryPale,
  },
  productInputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.bodyMd,
    color: colors.textPrimary,
  },
  addBtn: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  productTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryPale,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
