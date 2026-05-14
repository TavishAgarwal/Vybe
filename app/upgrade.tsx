/**
 * Upgrade / paywall screen — shown to free users.
 *
 * To customize:
 *   1. Edit PRO_FEATURES array with your app's actual feature list
 *   2. Update the headline text (eyebrow, title, subtitle)
 *   3. RevenueCat offerings load automatically from your dashboard
 *
 * RevenueCat setup:
 *   1. Create products in App Store Connect / Google Play Console
 *   2. Add products to RevenueCat → Products
 *   3. Create an Offering in RevenueCat with your packages
 *   4. Set your entitlement to 'premium' (or update ENTITLEMENT_ID in lib/purchases.ts)
 */
import { View, StyleSheet, Pressable } from 'react-native'
import { router } from 'expo-router'
import { Text } from '@/components/ui/Text'
import { Ionicons } from '@expo/vector-icons'
import { BG, TEXT_TERTIARY } from '@/lib/theme'

// 🎨 BRAND: Customize your feature list
const PRO_FEATURES = [
  { icon: 'infinite-outline',       label: 'Unlimited access to all features' },
  { icon: 'rocket-outline',         label: 'Priority processing & speed' },
  { icon: 'shield-checkmark-outline', label: 'Ad-free experience' },
  { icon: 'headset-outline',        label: 'Priority support (24h response)' },
  { icon: 'star-outline',           label: 'Early access to new features' },
]

export default function UpgradeScreen() {
  return (
    <View style={s.container}>
      <Pressable onPress={() => router.back()} style={s.backBtn}>
        <Ionicons name="chevron-back" size={24} color="rgba(255,255,255,0.6)" />
      </Pressable>
      <View style={s.center}>
        <Text style={s.unavailable}>In app purchases have been removed.</Text>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  backBtn:   { padding: 16, marginTop: 40, alignSelf: 'flex-start' },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  unavailable: { color: TEXT_TERTIARY, fontSize: 13, textAlign: 'center' },
})
