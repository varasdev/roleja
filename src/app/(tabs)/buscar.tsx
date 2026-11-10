import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Linking,
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
import { useApp, type EventItem } from "@/context/AppContext";

const C = {
  bg: "#090812",
  card: "#171426",
  light: "#211A32",
  purple: "#9333EA",
  lavender: "#D8B4FE",
  white: "#FFFFFF",
  text: "#E8E2F2",
  muted: "#A49AB8",
  border: "#302641",
};

const categories = [
  { name: "Todos", icon: "apps-outline" },
  { name: "Shows", icon: "musical-notes-outline" },
  { name: "Festivais", icon: "sparkles-outline" },
  { name: "Teatro", icon: "ticket-outline" },
  { name: "Comédia", icon: "happy-outline" },
  { name: "Esportes", icon: "football-outline" },
] as const;

export default function BuscarScreen() {
  const {
    events,
    search,
    setSearch,
    category,
    setCategory,
    tab,
    setTab,
    favorites,
    toggleFavorite,
    loading,
    error,
    favoritesLoaded,
    filteredEvents,
    reloadEvents,
  } = useApp();

  async function openTickets(event: EventItem) {
    if (!event.url) {
      Alert.alert(
        "Link indisponível",
        "A API não forneceu um link para este evento."
      );
      return;
    }

    try {
      await Linking.openURL(event.url);
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível abrir a página do evento."
      );
    }
  }

  function renderEvent(event: EventItem) {
    const favorite = favorites.includes(event.id);

    return (
      <View key={event.id} style={styles.eventCard}>
        <ImageBackground
          source={{ uri: event.image }}
          style={styles.eventImage}
          imageStyle={styles.imageRounded}
          resizeMode="cover"
        >
          <View style={styles.imageHeader}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {event.category.toUpperCase()}
              </Text>
            </View>

            <Pressable
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(event.id)}
              accessibilityLabel={
                favorite
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos"
              }
            >
              <Ionicons
                name={favorite ? "heart" : "heart-outline"}
                size={25}
                color={favorite ? "#F472B6" : C.white}
              />
            </Pressable>
          </View>

          <View style={styles.imageFooter}>
            <Text style={styles.dateBadge}>{event.date}</Text>

            <Text
              style={styles.cityBadge}
              numberOfLines={1}
            >
              ⌖ {event.city}
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.eventBody}>
          <Text style={styles.eventTitle}>{event.title}</Text>

          <Text style={styles.eventInfo}>⌖ {event.venue}</Text>
          <Text style={styles.eventInfo}>◷ {event.time}</Text>

          <View style={styles.eventFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceCaption}>Ingresso</Text>
              <Text style={styles.price}>{event.price}</Text>
            </View>

            <Pressable
              style={styles.ticketButton}
              onPress={() => openTickets(event)}
            >
              <Text style={styles.ticketButtonText}>
                Comprar ingresso →
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={styles.safe}
      edges={["top", "right", "bottom", "left"]}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.screen}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
              <Ionicons
                name="sparkles-outline"
                size={12}
                color={C.lavender}
              />
              <Text style={styles.headerBadgeText}>
                {" "}SEU PRÓXIMO ROLÊ
              </Text>
            </View>
          </View>

          <Text style={styles.subtitle}>
            Busque por eventos, locais ou cidades.
          </Text>

          <View style={styles.searchBox}>
            <Ionicons
              name="search-outline"
              size={23}
              color={C.lavender}
            />

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar evento, local ou cidade..."
              placeholderTextColor={C.muted}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              accessibilityLabel="Buscar eventos"
            />

            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={21}
                  color={C.muted}
                />
              </Pressable>
            )}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <Text style={styles.sectionHint}>
              Dados da Ticketmaster
            </Text>
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
                  <Ionicons
                    name={item.icon}
                    size={27}
                    color={C.white}
                  />

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
            <Text style={styles.sectionTitle}>
              {search || category !== "Todos" ? "Resultados" : "🔥 Eventos encontrados"}
            </Text>

            <Text style={styles.sectionHint}>
              {filteredEvents.length} eventos
            </Text>
          </View>

          {loading ? (
            <View style={styles.messageCard}>
              <ActivityIndicator
                size="large"
                color={C.lavender}
              />
              <Text style={styles.messageTitle}>
                Buscando eventos futuros...
              </Text>
              <Text style={styles.messageText}>
                Consultando a Ticketmaster.
              </Text>
            </View>
          ) : !favoritesLoaded && tab === "Favoritos" ? (
            <View style={styles.messageCard}>
              <ActivityIndicator
                size="large"
                color={C.lavender}
              />
              <Text style={styles.messageTitle}>
                Carregando favoritos...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.messageCard}>
              <Ionicons
                name="calendar-outline"
                size={35}
                color={C.lavender}
              />

              <Text style={styles.messageTitle}>
                Nenhum evento disponível
              </Text>
              <Text style={styles.messageText}>{error}</Text>

              <Pressable
                style={styles.ticketButton}
                onPress={reloadEvents}
              >
                <Text style={styles.ticketButtonText}>
                  Tentar novamente
                </Text>
              </Pressable>
            </View>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map(renderEvent)
          ) : (
            <View style={styles.messageCard}>
              <Ionicons
                name="search-outline"
                size={35}
                color={C.lavender}
              />
              <Text style={styles.messageTitle}>
                Nenhum resultado
              </Text>
              <Text style={styles.messageText}>
                Tente outro termo ou confira os favoritos.
              </Text>
            </View>
          )}

          <Text style={styles.notice}>
            Os eventos exibidos ainda vão acontecer. Preços e
            disponibilidade dependem das informações fornecidas
            pela Ticketmaster. A compra ocorre no site do evento.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  screen: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
  },
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
    color: C.white,
    fontSize: 29,
    fontWeight: "900",
    letterSpacing: -1,
  },
  brandHighlight: { color: C.lavender },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  headerBadgeText: {
    color: C.lavender,
    fontSize: 8,
    fontWeight: "800",
  },
  subtitle: {
    color: C.muted,
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
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 25,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: C.white,
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
    color: C.white,
    fontSize: 19,
    fontWeight: "800",
    flexShrink: 1,
  },
  sectionHint: {
    color: C.lavender,
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
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    marginRight: 9,
    gap: 8,
  },
  categorySelected: {
    backgroundColor: "#542485",
    borderColor: C.purple,
  },
  categoryName: {
    color: C.muted,
    fontSize: 10,
    fontWeight: "600",
  },
  categoryNameSelected: { color: C.white },
  eventCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 17,
    borderWidth: 1,
    borderColor: C.border,
  },
  eventImage: {
    height: 175,
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: C.light,
  },
  imageRounded: {
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
  },
  imageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    backgroundColor: "#8136C6",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: C.white,
    fontSize: 9,
    fontWeight: "900",
  },
  favoriteButton: {
    width: 39,
    height: 39,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#171126",
  },
  imageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  dateBadge: {
    backgroundColor: "#21132F",
    borderRadius: 8,
    color: C.lavender,
    fontSize: 10,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 7,
    overflow: "hidden",
  },
  cityBadge: {
    backgroundColor: "#171126",
    borderRadius: 8,
    color: C.white,
    fontSize: 10,
    fontWeight: "600",
    paddingHorizontal: 9,
    paddingVertical: 7,
    overflow: "hidden",
    flexShrink: 1,
  },
  eventBody: { padding: 15 },
  eventTitle: {
    color: C.white,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 9,
  },
  eventInfo: {
    color: C.muted,
    fontSize: 12,
    marginBottom: 5,
  },
  eventFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 13,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  priceContainer: { flexShrink: 1 },
  priceCaption: {
    color: C.muted,
    fontSize: 10,
    marginBottom: 4,
  },
  price: {
    color: C.lavender,
    fontSize: 15,
    fontWeight: "900",
  },
  ticketButton: {
    backgroundColor: "#8438CC",
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    alignItems: "center",
  },
  ticketButtonText: {
    color: C.white,
    fontSize: 11,
    fontWeight: "800",
  },
  messageCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
    gap: 12,
  },
  messageTitle: {
    color: C.white,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },
  messageText: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  notice: {
    color: "#81768F",
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 15,
  },
});