import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadows } from '../../theme';
import Card from '../../components/common/Card';
import Chip from '../../components/common/Chip';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';

const { width } = Dimensions.get('window');

const NUDGE = {
  icon: '🌧️',
  message:
    'High humidity today — swap to a lighter moisturizer this morning. Your gel moisturizer will keep your skin balanced.',
  source: 'Based on Hanoi weather · 84% humidity',
};

const SUGGESTED_QUESTIONS: { category: string; emoji: string; items: string[] }[] = [
  {
    category: 'Skincare',
    emoji: '🧴',
    items: [
      'Can I mix niacinamide + vitamin C?',
      'Best SPF for oily skin?',
      'Should I add retinol?',
      'How often should I exfoliate?',
    ],
  },
  {
    category: 'Products',
    emoji: '🔬',
    items: [
      'Decode my product ingredients',
      'Find a dupe for my moisturizer',
      'Is this product safe for acne?',
      'Best drugstore toner for me?',
    ],
  },
  {
    category: 'Makeup',
    emoji: '💄',
    items: [
      'What makeup suits my face shape?',
      'Recommend a lip color for my undertone',
      'Best primer for oily skin?',
      'How to make my eyes look bigger?',
    ],
  },
  {
    category: 'Lifestyle',
    emoji: '🌿',
    items: [
      'How is stress affecting my skin?',
      'My cycle is affecting my skin this week',
      'Best foods for clear skin?',
      'Does lack of sleep cause breakouts?',
    ],
  },
];

const MOCK_RESPONSES: Record<string, string> = {
  default: "That's a great question! Based on your skin profile (combination skin, acne concern), here's what I recommend:\n\nYour skin will benefit most from a gentle, non-comedogenic approach. Avoid heavy occlusives and opt for lighter, water-based formulas. I'll keep an eye on your reaction log to refine this advice over time. 💙",
  niacinamide:
    "Yes! Niacinamide (B3) and Vitamin C are actually a great duo 🌟\n\nThe old myth about them canceling out comes from old, unstable Vitamin C forms. With modern L-ascorbic acid or ascorbyl glucoside, they work well together.\n\n✅ Use Vitamin C in the morning\n✅ Niacinamide can be used AM or PM\n✅ Both help with your uneven tone concern",
};

function getBotResponse(msg: string): string {
  if (msg.toLowerCase().includes('niacinamide') || msg.toLowerCase().includes('vitamin c')) {
    return MOCK_RESPONSES.niacinamide;
  }
  return MOCK_RESPONSES.default;
}

export default function HomeScreen() {
  const { state, dispatch } = useApp();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Skincare');
  const [showChat, setShowChat] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const messages = state.chatHistory;

  function sendMessage(text?: string) {
    const msg = text ?? inputText;
    if (!msg.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: msg.trim(),
      timestamp: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMsg });
    setInputText('');
    setIsTyping(true);
    setShowChat(true);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getBotResponse(msg),
        timestamp: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: botMsg });
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1500);
  }

  const firstName = 'Linh';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.topBar}>
          <View>
            <Text style={[typography.headingSm, { color: colors.textTertiary }]}>
              Good morning ☀️
            </Text>
            <Text style={[typography.headingLg, { color: colors.textPrimary }]}>
              Hi, {firstName}
            </Text>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <LinearGradient colors={[colors.primaryLight, colors.primary]} style={styles.avatarGrad}>
              <Text style={{ fontSize: 18 }}>👤</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Nudge Banner */}
          <LinearGradient
            colors={['#F5D6CE', '#E8C4BA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nudgeBanner}
          >
            <View style={styles.nudgeLeft}>
              <Text style={styles.nudgeEmoji}>{NUDGE.icon}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={[typography.labelLg, { color: colors.primaryDeep, marginBottom: 3 }]}>
                Today's Nudge
              </Text>
              <Text style={[typography.bodyMd, { color: colors.textPrimary, lineHeight: 20 }]}>
                {NUDGE.message}
              </Text>
              <Text style={[typography.caption, { color: colors.textTertiary, marginTop: spacing.xs }]}>
                {NUDGE.source}
              </Text>
            </View>
          </LinearGradient>

          {/* Chat history */}
          {showChat && messages.length > 0 && (
            <View style={styles.chatArea}>
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.bubble,
                    msg.role === 'user' ? styles.userBubble : styles.botBubble,
                  ]}
                >
                  {msg.role === 'assistant' && (
                    <View style={styles.botAvatar}>
                      <Text style={{ fontSize: 14 }}>✨</Text>
                    </View>
                  )}
                  <View style={[styles.bubbleContent, msg.role === 'user' ? styles.userContent : styles.botContent]}>
                    <Text
                      style={[
                        typography.bodyMd,
                        { color: msg.role === 'user' ? '#fff' : colors.textPrimary, lineHeight: 21 },
                      ]}
                    >
                      {msg.content}
                    </Text>
                  </View>
                </View>
              ))}
              {isTyping && (
                <View style={[styles.bubble, styles.botBubble]}>
                  <View style={styles.botAvatar}>
                    <Text style={{ fontSize: 14 }}>✨</Text>
                  </View>
                  <View style={[styles.bubbleContent, styles.botContent]}>
                    <Text style={[typography.bodyMd, { color: colors.textTertiary }]}>Aura is thinking...</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* AI Chat input */}
          <View style={styles.inputCard}>
            <View style={styles.inputRow}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask Aura anything..."
                placeholderTextColor={colors.textTertiary}
                style={styles.chatInput}
                multiline
                onSubmitEditing={() => sendMessage()}
                returnKeyType="send"
              />
              <TouchableOpacity
                onPress={() => sendMessage()}
                style={[styles.sendBtn, { opacity: inputText.trim() ? 1 : 0.4 }]}
                disabled={!inputText.trim()}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.placeholders}>
              {['My skin feels tight today', "Why am I breaking out?", 'Review my routine'].map((p) => (
                <TouchableOpacity
                  key={p}
                  style={styles.placeholderChip}
                  onPress={() => sendMessage(p)}
                >
                  <Text style={[typography.bodySm, { color: colors.textSecondary }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Suggested questions */}
          <View style={styles.section}>
            <Text style={[typography.headingMd, styles.sectionTitle]}>Ask Aura</Text>

            {/* Category tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {SUGGESTED_QUESTIONS.map((cat) => (
                <TouchableOpacity
                  key={cat.category}
                  onPress={() => setActiveCategory(cat.category)}
                  style={[styles.catTab, activeCategory === cat.category && styles.catTabActive]}
                >
                  <Text style={styles.catEmoji}>{cat.emoji}</Text>
                  <Text
                    style={[
                      typography.labelMd,
                      { color: activeCategory === cat.category ? colors.primary : colors.textSecondary },
                    ]}
                  >
                    {cat.category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Questions */}
            <View style={styles.questionGrid}>
              {SUGGESTED_QUESTIONS.find((c) => c.category === activeCategory)?.items.map((q) => (
                <TouchableOpacity
                  key={q}
                  style={styles.questionChip}
                  onPress={() => sendMessage(q)}
                  activeOpacity={0.75}
                >
                  <Text style={[typography.bodyMd, { color: colors.textPrimary, flex: 1 }]}>{q}</Text>
                  <Ionicons name="arrow-forward-circle-outline" size={18} color={colors.primaryLight} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Bottom input bar */}
        <View style={styles.bottomBar}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask Aura..."
            placeholderTextColor={colors.textTertiary}
            style={styles.bottomInput}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity
            style={[styles.sendBtn, styles.bottomSendBtn, { opacity: inputText.trim() ? 1 : 0.5 }]}
            onPress={() => sendMessage()}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={17} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  avatar: { borderRadius: radius.full, overflow: 'hidden' },
  avatarGrad: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingBottom: spacing.huge,
  },
  nudgeBanner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...shadows.sm,
  },
  nudgeLeft: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nudgeEmoji: { fontSize: 22 },
  chatArea: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  bubble: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  botBubble: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: spacing.xs,
  },
  bubbleContent: {
    maxWidth: width * 0.72,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  userContent: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  botContent: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    ...shadows.sm,
  },
  inputCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  chatInput: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.textPrimary,
    maxHeight: 80,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholders: {
    marginTop: spacing.md,
  },
  placeholderChip: {
    backgroundColor: colors.surfaceAlt,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xxl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  categoryScroll: {
    marginBottom: spacing.md,
  },
  catTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  catTabActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryPale,
  },
  catEmoji: { fontSize: 14 },
  questionGrid: {
    gap: spacing.sm,
  },
  questionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.md,
  },
  bottomInput: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.bodyMd,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bottomSendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
