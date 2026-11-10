import React from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useApp } from "@/context/AppContext";
import { colors } from "@/constants/colors";
import { categories } from "@/constants/categories";
import { EventCard } from "@/components/shared/EventCard";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { MessageCard } from "@/components/shared/MessageCard";
import { Notice } from "@/components/shared/Notice";
import { useFilteredEvents } from "@/hooks/useEvents";

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
  searchBox: {
    minHeight: 53,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 25,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.white,
    fontSize: 13,
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
  categoryScroll: { marginBottom: 25 },
  categoryList: { paddingRight: 6 },
  categoryItem: {
    width: 73,
    height: 83,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 9,
    gap: 8,
  },
  categorySelected: {
    backgroundColor: "#542485",
    borderColor: colors.purple,
  },
  categoryName: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "600",
  },
  categoryNameSelected: { color: colors.white },
});

export default function HomeScreen() {
  const {
    search,
    setSearch,
    category,
    setCategory,
    tab,
    favorites,
    toggleFavorite,
    loading,
    error,
    favoritesLoaded,
    reloadEvents,
  } = useApp();

  const filteredEvents = useFilteredEvents();

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
            Descubra eventos reais e encontre seus próximos ingressos.
          </Text>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={23} color={colors.lavender} />

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar evento, local ou cidade..."
              placeholderTextColor={colors.muted}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              accessibilityLabel="Buscar eventos"
            />

            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={21} color={colors.muted} />
              </Pressable>
            )}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <Text style={styles.sectionHint}>Dados da Ticketmaster</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryList}
          >
            {categories.map((item) => {
              const selected = category === item.name;

              return (
                <Pressable
                  key={item.name}
                  style={[
                    styles.categoryItem,
                    selected && styles.categorySelected,
                  ]}
                  onPress={() => setCategory(item.name)}
                >
                  <Ionicons name={item.icon} size={27} color={colors.white} />

                  <Text
                    style={[
                      styles.categoryName,
                      selected && styles.categoryNameSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Eventos encontrados</Text>

            <Text style={styles.sectionHint}>
              {filteredEvents.length} eventos
            </Text>
          </View>

          {loading ? (
            <MessageCard
              loading
              title="Buscando eventos futuros..."
              text="Consultando a Ticketmaster."
            />
          ) : !favoritesLoaded && tab === "Favoritos" ? (
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
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isFavorite={favorites.includes(event.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))
          ) : (
            <MessageCard
              icon="search-outline"
              title="Nenhum resultado"
              text="Tente outro termo ou confira os favoritos."
            />
          )}

          <Notice />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}