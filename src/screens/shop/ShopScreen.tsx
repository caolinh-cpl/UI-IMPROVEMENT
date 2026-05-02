import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadows } from '../../theme';
import Card from '../../components/common/Card';
import Tag from '../../components/common/Tag';
import Chip from '../../components/common/Chip';
import { SafetyTag } from '../../types';

const { width } = Dimensions.get('window');

interface ShopProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  fitScore: number;
  safetyTag: SafetyTag;
  platform: 'shopee' | 'tiktok_shop';
  emoji: string;
  isRestock?: boolean;
  reviewCount: number;
  rating: number;
}

const PRODUCTS: ShopProduct[] = [
  { id: '1', name: 'Hydrating Facial Cleanser', brand: 'CeraVe', category: 'Cleanser', price: 275000, fitScore: 97, safetyTag: 'safe', platform: 'shopee', emoji: '🧼', reviewCount: 2847, rating: 4.8 },
  { id: '2', name: 'Skin Renewing Vitamin C Serum', brand: 'Cocoon', category: 'Serum', price: 399000, fitScore: 94, safetyTag: 'safe', platform: 'shopee', emoji: '✨', reviewCount: 1203, rating: 4.7 },
  { id: '3', name: 'Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', category: 'Serum', price: 285000, fitScore: 92, safetyTag: 'safe', platform: 'tiktok_shop', emoji: '🔬', reviewCount: 5612, rating: 4.6 },
  { id: '4', name: 'Moisturizing Cream', brand: 'CeraVe', category: 'Moisturizer', price: 320000, fitScore: 91, safetyTag: 'safe', platform: 'shopee', emoji: '💧', isRestock: true, reviewCount: 8934, rating: 4.9 },
  { id: '5', name: 'Perfect UV Sunscreen', brand: 'Anessa', category: 'Sunscreen', price: 520000, fitScore: 90, safetyTag: 'safe', platform: 'shopee', emoji: '☀️', reviewCount: 3421, rating: 4.8 },
  { id: '6', name: 'Gentle Micellar Water', brand: 'Bioderma', category: 'Cleanser', price: 235000, fitScore: 88, safetyTag: 'safe', platform: 'tiktok_shop', emoji: '💦', reviewCount: 2109, rating: 4.5 },
  { id: '7', name: 'Rose Hip Oil', brand: 'The Ordinary', category: 'Oil', price: 195000, fitScore: 72, safetyTag: 'patch_test', platform: 'shopee', emoji: '🌹', reviewCount: 876, rating: 4.3 },
  { id: '8', name: 'Retinol 0.5%', brand: 'Neutrogena', category: 'Treatment', price: 380000, fitScore: 45, safetyTag: 'not_suitable', platform: 'shopee', emoji: '⚗️', reviewCount: 1543, rating: 4.4 },
];

const COMMUNITY_REVIEWS = [
  {
    id: '1',
    productName: 'CeraVe Moisturizing Cream',
    user: 'Linh T. · Oily, Acne-prone',
    skin: 'Oily / Acne',
    rating: 5,
    text: 'Been using for 2 months, no breakouts at all. My skin barrier feels so much better!',
    helpful: 47,
  },
  {
    id: '2',
    productName: 'The Ordinary Niacinamide',
    user: 'Mai P. · Combination, Uneven tone',
    skin: 'Combination',
    rating: 4,
    text: 'Noticeable improvement in pore size after 3 weeks. Slight tingling but no real irritation.',
    helpful: 32,
  },
  {
    id: '3',
    productName: 'Anessa UV Sunscreen',
    user: 'Thu H. · Combination, Dullness',
    skin: 'Combination',
    rating: 5,
    text: 'Best sunscreen for our humid weather. No white cast, non-greasy. Daily use for 6 months.',
    helpful: 89,
  },
];

const CATEGORIES = ['All', 'Cleanser', 'Serum', 'Moisturizer', 'Sunscreen', 'Treatment', 'Oil'];

const SAFETY_TAG_CONFIG: Record<SafetyTag, { label: string; variant: 'safe' | 'patch_test' | 'not_suitable' }> = {
  safe: { label: '✓ Safe for you', variant: 'safe' },
  patch_test: { label: '⚠ Patch test', variant: 'patch_test' },
  not_suitable: { label: '✗ Not suitable', variant: 'not_suitable' },
};

function FitBar({ score }: { score: number }) {
  const color = score >= 85 ? colors.success : score >= 65 ? colors.warning : colors.error;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
      <View style={fitBarStyles.track}>
        <View style={[fitBarStyles.fill, { width: `${score}%`, backgroundColor: color }]} />
      </View>
      <Text style={[typography.labelSm, { color }]}>{score}%</Text>
    </View>
  );
}

const fitBarStyles = StyleSheet.create({
  track: { flex: 1, height: 5, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  fill: { height: 5, borderRadius: 3 },
});

export default function ShopScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'feed' | 'community' | 'brands'>('feed');
  const [sortBy, setSortBy] = useState<'fit' | 'price' | 'rating'>('fit');

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = search === '' || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'fit') return b.fitScore - a.fitScore;
    if (sortBy === 'price') return a.price - b.price;
    return b.rating - a.rating;
  });

  const restockProducts = PRODUCTS.filter((p) => p.isRestock);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[typography.displaySm, { color: colors.textPrimary }]}>Shop</Text>
        <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
          Filtered for your skin
        </Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.textTertiary} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search products or brands..."
            placeholderTextColor={colors.textTertiary}
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Restock reminder */}
      {restockProducts.length > 0 && (
        <LinearGradient colors={[colors.warningLight, '#FFF8EC']} style={styles.restockBanner}>
          <Text style={{ fontSize: 20 }}>⏰</Text>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={[typography.labelLg, { color: colors.warning }]}>Restock Reminder</Text>
            <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
              Your {restockProducts[0].name} should be running low this week.
            </Text>
          </View>
          <TouchableOpacity style={styles.restockBtn}>
            <Text style={[typography.labelMd, { color: colors.warning }]}>Buy →</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(['feed', 'community', 'brands'] as const).map((t) => {
          const labels = { feed: '🛍️ For You', community: '💬 Reviews', brands: '🇻🇳 Brands' };
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
        {/* ── Product Feed ── */}
        {activeTab === 'feed' && (
          <View>
            {/* Category filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {CATEGORIES.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  selected={activeCategory === c}
                  onPress={() => setActiveCategory(c)}
                  size="sm"
                  style={{ marginRight: spacing.sm }}
                />
              ))}
            </ScrollView>

            {/* Sort row */}
            <View style={styles.sortRow}>
              <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
                {filtered.length} products
              </Text>
              <View style={styles.sortBtns}>
                {(['fit', 'price', 'rating'] as const).map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setSortBy(s)}
                    style={[styles.sortBtn, sortBy === s && styles.sortBtnActive]}
                  >
                    <Text style={[typography.labelSm, { color: sortBy === s ? colors.primary : colors.textTertiary }]}>
                      {s === 'fit' ? '🎯 Fit' : s === 'price' ? '💰 Price' : '⭐ Rating'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {filtered.map((p) => {
              const safeCfg = SAFETY_TAG_CONFIG[p.safetyTag];
              return (
                <Card key={p.id} variant="elevated" style={styles.productCard}>
                  <View style={styles.productRow}>
                    <View style={[styles.productEmoji, { backgroundColor: p.safetyTag === 'not_suitable' ? colors.errorLight : colors.primaryPale }]}>
                      <Text style={{ fontSize: 26 }}>{p.emoji}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: spacing.md }}>
                      <View style={styles.productNameRow}>
                        <Text style={[typography.headingSm, { color: colors.textPrimary, flex: 1 }]} numberOfLines={1}>
                          {p.name}
                        </Text>
                        {p.isRestock && (
                          <View style={styles.restockTag}>
                            <Text style={[typography.caption, { color: colors.warning }]}>Restock</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[typography.bodySm, { color: colors.textTertiary }]}>
                        {p.brand} · {p.category}
                      </Text>
                      <View style={styles.fitRow}>
                        <Text style={[typography.caption, { color: colors.textTertiary, marginRight: spacing.xs }]}>Fit</Text>
                        <FitBar score={p.fitScore} />
                      </View>
                    </View>
                  </View>

                  <View style={styles.productFooter}>
                    <Tag label={safeCfg.label} variant={safeCfg.variant} />
                    <View style={styles.priceRow}>
                      <Text style={[typography.headingSm, { color: colors.textPrimary }]}>
                        {(p.price / 1000).toFixed(0)}K ₫
                      </Text>
                      <TouchableOpacity
                        style={[styles.buyBtn, p.safetyTag === 'not_suitable' && { opacity: 0.4 }]}
                        disabled={p.safetyTag === 'not_suitable'}
                        onPress={() => Alert.alert('Opening ' + p.platform + '...', p.name)}
                      >
                        <Text style={[typography.labelMd, { color: '#fff' }]}>
                          {p.platform === 'shopee' ? '🛒 Shopee' : '📱 TikTok'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        )}

        {/* ── Community Reviews ── */}
        {activeTab === 'community' && (
          <View>
            <View style={styles.communityHeader}>
              <Text style={[typography.headingMd, { color: colors.textPrimary }]}>
                Reviews from your skin twin
              </Text>
              <Text style={[typography.bodyMd, { color: colors.textSecondary, marginTop: spacing.xs }]}>
                Showing reviews from people with similar skin — combination, acne-prone, warm undertone.
              </Text>
            </View>

            {COMMUNITY_REVIEWS.map((r) => (
              <Card key={r.id} variant="outlined" style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={{ fontSize: 16 }}>👤</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={[typography.labelLg, { color: colors.textPrimary }]}>{r.user}</Text>
                    <Text style={[typography.bodySm, { color: colors.primary }]}>{r.productName}</Text>
                  </View>
                  <View style={styles.starRow}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Ionicons
                        key={i}
                        name={i < r.rating ? 'star' : 'star-outline'}
                        size={12}
                        color={i < r.rating ? colors.warning : colors.border}
                      />
                    ))}
                  </View>
                </View>
                <Text style={[typography.bodyMd, { color: colors.textSecondary, lineHeight: 21, marginTop: spacing.sm }]}>
                  "{r.text}"
                </Text>
                <TouchableOpacity style={styles.helpfulBtn}>
                  <Ionicons name="thumbs-up-outline" size={14} color={colors.textTertiary} />
                  <Text style={[typography.caption, { color: colors.textTertiary }]}>{r.helpful} helpful</Text>
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        )}

        {/* ── Vietnam Brands ── */}
        {activeTab === 'brands' && (
          <View>
            <Text style={[typography.headingMd, { color: colors.textPrimary, marginBottom: spacing.md }]}>
              Vietnam Brand Guide
            </Text>
            {[
              { brand: 'Cocoon', origin: '🇻🇳 Vietnam', desc: 'Local clean beauty brand. Vegan, cruelty-free.', emoji: '🥥', url: 'Shopee Official Store' },
              { brand: 'Bioderma VN', origin: '🇫🇷 France', desc: 'Dermatologist-tested. Widely available in Vietnam.', emoji: '🔬', url: 'Guardian / Watsons' },
              { brand: 'The Ordinary (Shopee)', origin: '🇨🇦 Canada', desc: 'Affordable actives. Buy from verified Shopee Mall seller.', emoji: '⚗️', url: 'Shopee Mall' },
              { brand: 'Anessa', origin: '🇯🇵 Japan', desc: 'Top-rated sunscreen for humid climates.', emoji: '☀️', url: 'Shopee / Lazada' },
              { brand: 'Cetaphil', origin: '🇺🇸 USA', desc: 'Gentle, dermatologist-recommended.', emoji: '💧', url: 'Watsons / Guardian' },
            ].map((b) => (
              <Card key={b.brand} variant="outlined" style={styles.brandCard}>
                <View style={styles.brandRow}>
                  <View style={styles.brandEmoji}>
                    <Text style={{ fontSize: 26 }}>{b.emoji}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <View style={styles.brandNameRow}>
                      <Text style={[typography.headingSm, { color: colors.textPrimary }]}>{b.brand}</Text>
                      <Text style={[typography.labelSm, { color: colors.textTertiary }]}>{b.origin}</Text>
                    </View>
                    <Text style={[typography.bodyMd, { color: colors.textSecondary, marginTop: 2 }]}>{b.desc}</Text>
                    <Text style={[typography.labelMd, { color: colors.primary, marginTop: spacing.xs }]}>
                      📍 {b.url}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  searchRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.textPrimary,
  },
  restockBanner: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  restockBtn: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
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
  catScroll: { marginBottom: spacing.md },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sortBtns: { flexDirection: 'row', gap: spacing.sm },
  sortBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  sortBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryPale },
  productCard: { marginBottom: spacing.md },
  productRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.md },
  productEmoji: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: 2 },
  restockTag: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  fitRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  productFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  buyBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  communityHeader: { marginBottom: spacing.lg },
  reviewCard: { marginBottom: spacing.md },
  reviewHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starRow: { flexDirection: 'row', gap: 2 },
  helpfulBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md },
  brandCard: { marginBottom: spacing.md },
  brandRow: { flexDirection: 'row', alignItems: 'flex-start' },
  brandEmoji: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
