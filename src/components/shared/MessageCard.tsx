import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "@/constants/colors";

interface MessageCardProps {
  icon?: "calendar-outline" | "search-outline" | "heart-outline";
  title: string;
  text?: string;
  loading?: boolean;
  onRetry?: () => void;
  retryText?: string;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  title: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  text: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#8438CC",
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    alignItems: "center",
    marginTop: 4,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "800",
  },
});

export function MessageCard({
  icon,
  title,
  text,
  loading,
  onRetry,
  retryText = "Tentar novamente",
}: MessageCardProps) {
  return (
    <View style={styles.card}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.lavender} />
      ) : icon ? (
        <Ionicons name={icon} size={35} color={colors.lavender} />
      ) : null}

      <Text style={styles.title}>{title}</Text>

      {text && <Text style={styles.text}>{text}</Text>}

      {onRetry && (
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>{retryText}</Text>
        </Pressable>
      )}
    </View>
  );
}