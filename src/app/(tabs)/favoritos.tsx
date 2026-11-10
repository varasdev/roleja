import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { colors } from "@/constants/colors";
import { EventCard } from "@/components/shared/EventCard";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { MessageCard } from "@/components/shared/MessageCard";
import { Notice } from "@/components/shared/Notice";
import { useFavoriteEvents } from "@/hooks/useEvents";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 95,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 22,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 8,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 19,
    fontWeight: "800",
    flexShrink: 1,
  },
  sectionHint: {
    color: colors.lavender,
    fontSize: 10,
    marginLeft: 8,
  },
});

export default function FavoritosScreen() {
  const {
    toggleFavorite,
    loading,
    error,
    favoritesLoaded,
    reloadEvents,
  } = useApp();

  const favoriteEvents = useFavoriteEvents();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "right", "left"]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.screen}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ScreenHeader />

          <Text style={styles.subtitle}>
            Os eventos que você guardou.
          </Text>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Seus favoritos</Text>

            <Text style={styles.sectionHint}>
              {favoriteEvents.length} evento{favoriteEvents.length !== 1 ? "s" : ""}
            </Text>
          </View>

          {loading ? (
            <MessageCard
              loading
              title="Buscando eventos futuros..."
              text="Consultando a Ticketmaster."
            />
          ) : !favoritesLoaded ? (
            <MessageCard
              loading
              title="Carregando favoritos..."
            />
          ) : error ? (
            <MessageCard
              icon="calendar-outline"
              title="Nenhum evento disponível"
              text={error}
              onRetry={reloadEvents}
            />
          ) : favoriteEvents.length > 0 ? (
            favoriteEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
              />
            ))
          ) : (
            <MessageCard
              icon="heart-outline"
              title="Nenhum favorito ainda"
              text="Toque no coração em qualquer evento para salvá-lo aqui."
            />
          )}

          <Notice />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}