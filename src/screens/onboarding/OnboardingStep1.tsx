import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingParamList } from '../../navigation/OnboardingNavigator';
import { colors, spacing, typography, radius, shadows } from '../../theme';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/common/ProgressBar';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<OnboardingParamList, 'OnboardingStep1'>;
};

export default function OnboardingStep1({ navigation }: Props) {
  const [selfieUri, setSelfieUri] = useState<string | undefined>();
  const [analyzing, setAnalyzing] = useState(false);

  async function handlePickImage(source: 'camera' | 'library') {
    const permFn =
      source === 'camera'
        ? ImagePicker.requestCameraPermissionsAsync
        : ImagePicker.requestMediaLibraryPermissionsAsync;

    const { status } = await permFn();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to continue.');
      return;
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85,
          });

    if (!result.canceled && result.assets[0]) {
      setSelfieUri(result.assets[0].uri);
    }
  }

  function handleAnalyze() {
    setAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      setAnalyzing(false);
      navigation.navigate('OnboardingStep2', { selfieUri });
    }, 1800);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoContainer}
        >
          <Text style={styles.logoText}>A</Text>
        </LinearGradient>
        <Text style={[typography.displaySm, styles.appName]}>aura</Text>
        <ProgressBar current={1} total={3} showLabel style={styles.progress} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[typography.displayMd, styles.title]}>Let's start with{'\n'}your selfie</Text>
        <Text style={[typography.bodyMd, styles.subtitle]}>
          Take a photo in natural light with no filter. Aura will analyze your skin tone,
          texture, and facial features to personalize your experience.
        </Text>

        {/* Selfie placeholder / preview */}
        {selfieUri ? (
          <View style={styles.selfieWrapper}>
            <Image source={{ uri: selfieUri }} style={styles.selfieImage} />
            <TouchableOpacity style={styles.retakeBtn} onPress={() => setSelfieUri(undefined)}>
              <Ionicons name="refresh" size={18} color="#fff" />
              <Text style={styles.retakeBtnText}>Retake</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadArea}>
            <LinearGradient
              colors={[colors.primaryPale, colors.surfaceAlt]}
              style={styles.uploadCircle}
            >
              <Ionicons name="camera-outline" size={52} color={colors.primaryLight} />
            </LinearGradient>
            <Text style={[typography.bodyMd, { color: colors.textSecondary, marginTop: spacing.md }]}>
              Face forward, good lighting
            </Text>
          </View>
        )}

        {/* Hints */}
        <View style={styles.hintsRow}>
          {['☀️  Natural light', '😐  Neutral expression', '🚫  No filter'].map((hint) => (
            <View key={hint} style={styles.hintChip}>
              <Text style={[typography.labelSm, { color: colors.textSecondary }]}>{hint}</Text>
            </View>
          ))}
        </View>

        {/* Buttons */}
        {!selfieUri && (
          <View style={styles.buttonGroup}>
            <Button
              label="Take Selfie"
              onPress={() => handlePickImage('camera')}
              size="lg"
              fullWidth
              style={styles.btn}
            />
            <Button
              label="Choose from Library"
              onPress={() => handlePickImage('library')}
              variant="secondary"
              size="lg"
              fullWidth
              style={styles.btn}
            />
          </View>
        )}

        {selfieUri && (
          <Button
            label={analyzing ? 'Analyzing...' : 'Analyze My Skin →'}
            onPress={handleAnalyze}
            size="lg"
            fullWidth
            loading={analyzing}
            style={styles.btn}
          />
        )}
      </View>

      {/* Note */}
      <View style={styles.noteContainer}>
        <Ionicons name="lock-closed-outline" size={13} color={colors.textTertiary} />
        <Text style={[typography.caption, styles.noteText]}>
          Your photo is stored securely and used only for personalization.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoText: {
    ...typography.headingLg,
    color: '#fff',
    fontWeight: '800',
  },
  appName: {
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  progress: {
    width: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  title: {
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  subtitle: {
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  uploadArea: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  uploadCircle: {
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: (width * 0.55) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primaryPale,
    borderStyle: 'dashed',
  },
  selfieWrapper: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  selfieImage: {
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: (width * 0.55) / 2,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    marginTop: spacing.md,
  },
  retakeBtnText: {
    ...typography.labelMd,
    color: '#fff',
  },
  hintsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
    marginBottom: spacing.xxl,
  },
  hintChip: {
    backgroundColor: colors.surfaceAlt,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonGroup: {
    gap: spacing.md,
  },
  btn: {
    marginBottom: spacing.xs,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    justifyContent: 'center',
  },
  noteText: {
    color: colors.textTertiary,
  },
});
