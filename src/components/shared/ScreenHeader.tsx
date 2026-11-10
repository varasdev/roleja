import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "@/constants/colors";

interface ScreenHeaderProps {
  badgeText?: string;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 52,
    height: 52,
    marginRight: 8,
  },
  brand: {
    color: colors.white,
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: -1,
  },
  brandHighlight: { color: colors.lavender },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  headerBadgeText: {
    color: colors.lavender,
    fontSize: 8,
    fontWeight: "800",
  },
});

export function ScreenHeader({ badgeText = "SEU PRÓXIMO ROLÊ" }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brandContainer}>
        <Image
          source={require("../../../assets/images/roleja-icon.png")}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Logo RolêJá"
        />

        <Text style={styles.brand}>
          Rolê<Text style={styles.brandHighlight}>Já</Text>
        </Text>
      </View>

      <View style={styles.headerBadge}>
        <Ionicons name="sparkles-outline" size={12} color={colors.lavender} />
        <Text style={styles.headerBadgeText}>{" "}{badgeText}</Text>
      </View>
    </View>
  );
}