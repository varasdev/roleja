
import React, { useEffect, useMemo, useState } from "react";
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

type Tab = "Início" | "Buscar" | "Favoritos" | "Perfil";

type TicketmasterEvent = {
  id?: string;
  name?: string;
  url?: string;
  images?: { url?: string; width?: number; ratio?: string }[];
  dates?: {
    start?: {
      dateTime?: string;
      localDate?: string;
      localTime?: string;
    };
  };
  priceRanges?: {
    min?: number;
    max?: number;
    currency?: string;
  }[];
  classifications?: {
    segment?: { name?: string };
    genre?: { name?: string };
    subGenre?: { name?: string };
  }[];
  _embedded?: {
    venues?: {
      name?: string;
      city?: { name?: string };
      state?: { name?: string; stateCode?: string };
    }[];
  };
};

type EventItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  city: string;
  venue: string;
  price: string;
  image: string;
  url: string;
};

const categories = [
  { name: "Todos", icon: "apps-outline" },
  { name: "Shows", icon: "musical-notes-outline" },
  { name: "Festivais", icon: "sparkles-outline" },
  { name: "Teatro", icon: "ticket-outline" },
  { name: "Comédia", icon: "happy-outline" },
  { name: "Esportes", icon: "football-outline" },
] as const;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=900";

function getCategory(event: TicketmasterEvent): string {
  const classification = event.classifications?.[0];

  const text = [
    classification?.segment?.name,
    classification?.genre?.name,
    classification?.subGenre?.name,
    event.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (text.includes("festival")) return "Festivais";
  if (text.includes("sport")) return "Esportes";
  if (text.includes("comedy") || text.includes("comédia")) {
    return "Comédia";
  }

  if (
    text.includes("theatre") ||
    text.includes("theater") ||
    text.includes("teatro") ||
    text.includes("arts & theatre")
  ) {
    return "Teatro";
  }

  if (text.includes("music") || text.includes("música")) {
    return "Shows";
  }

  return "Outros";
}

function isFutureEvent(event: TicketmasterEvent): boolean {
  const start = event.dates?.start;

  // Preferimos a data absoluta da API, que inclui o fuso horário.
  if (start?.dateTime) {
    const timestamp = Date.parse(start.dateTime);

    if (Number.isFinite(timestamp)) {
      return timestamp > Date.now();
    }
  }

  // Alternativa quando a API só fornece a data e a hora locais.
  if (!start?.localDate) {
    return false;
  }

  const [year, month, day] = start.localDate
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return false;
  }

  const time = start.localTime || "23:59:59";
  const [hour = 23, minute = 59, second = 59] = time
    .split(":")
    .map(Number);

  const localTimestamp = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second
  ).getTime();

  return (
    Number.isFinite(localTimestamp) &&
    localTimestamp > Date.now()
  );
}

function formatDate(value?: string): string {
  if (!value) return "DATA A CONFIRMAR";

  const parts = value.split("-");

  if (parts.length !== 3) return value;

  const date = new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2])
  );

  return date
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    })
    .replace(".", "")
    .toUpperCase();
}

function formatTime(value?: string): string {
  if (!value) return "Horário a confirmar";

  return value.length >= 5 ? value.slice(0, 5) : value;
}

function formatPrice(event: TicketmasterEvent): string {
  const range = event.priceRanges?.[0];

  if (!range || typeof range.min !== "number") {
    return "Consulte o site";
  }

  try {
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: range.currency || "BRL",
    });

    const minimum = formatter.format(range.min);

    if (
      typeof range.max === "number" &&
      range.max > range.min
    ) {
      return `${minimum}+`;
    }

    return minimum;
  } catch {
    return "Consulte o site";
  }
}

function mapEvent(
  item: TicketmasterEvent,
  index: number
): EventItem {
  const venue = item._embedded?.venues?.[0];

  const cityName = venue?.city?.name;
  const stateName =
    venue?.state?.stateCode || venue?.state?.name;

  const city = [cityName, stateName]
    .filter(Boolean)
    .join(" - ");

  const images = [...(item.images || [])].sort(
    (a, b) => (b.width || 0) - (a.width || 0)
  );

  const image =
    images.find((candidate) => candidate.url)?.url ||
    FALLBACK_IMAGE;

  return {
    id: item.id || String(index),
    title: item.name || "Evento sem nome",
    category: getCategory(item),
    date: formatDate(item.dates?.start?.localDate),
    time: formatTime(item.dates?.start?.localTime),
    city: city || "Local a confirmar",
    venue: venue?.name || "Local a confirmar",
    price: formatPrice(item),
    image,
    url: item.url || "",
  };
}

export default function Index() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [tab, setTab] = useState<Tab>("Início");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      setLoading(true);
      setError("");

      const apiKey =
        process.env.EXPO_PUBLIC_TICKETMASTER_API_KEY;

      if (!apiKey) {
        setError(
          "Chave da Ticketmaster não encontrada. Confira o arquivo .env."
        );
        setLoading(false);
        return;
      }

      try {
        // A API recebe a hora atual em UTC.
        // O formato enviado é YYYY-MM-DDTHH:mm:ssZ.
        const startDateTime = new Date()
          .toISOString()
          .replace(/\.\d{3}Z$/, "Z");

        const params = new URLSearchParams({
          apikey: apiKey,
          countryCode: "BR",
          size: "30",
          sort: "date,asc",
          startDateTime,
        });

        const response = await fetch(
          "https://app.ticketmaster.com/discovery/v2/events.json?" +
            params.toString()
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Chave inválida. Confira a Consumer Key da Ticketmaster."
            );
          }

          if (response.status === 429) {
            throw new Error(
              "Limite de consultas atingido. Tente novamente mais tarde."
            );
          }

          throw new Error(
            `A API respondeu com o status ${response.status}.`
          );
        }

        const data = (await response.json()) as {
          _embedded?: {
            events?: TicketmasterEvent[];
          };
        };

        const rawEvents = data._embedded?.events || [];

        // Segunda proteção: não exibir eventos que já passaram.
        const upcomingEvents = rawEvents.filter(isFutureEvent);

        const list = upcomingEvents.map(mapEvent);

        if (active) {
          setEvents(list);

          if (list.length === 0) {
            setError(
              "Nenhum evento futuro foi encontrado nesta consulta. Tente novamente ou confira a disponibilidade da Ticketmaster no Brasil."
            );
          }
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível carregar os eventos."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(query) ||
        event.city.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query);

      const matchesCategory =
        category === "Todos" ||
        event.category === category;

      const matchesFavorites =
        tab !== "Favoritos" ||
        favorites.includes(event.id);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesFavorites
      );
    });
  }, [events, search, category, tab, favorites]);

  function changeTab(nextTab: Tab) {
    setTab(nextTab);

    if (nextTab === "Início") {
      setSearch("");
      setCategory("Todos");
    }

    if (nextTab === "Buscar") {
      setCategory("Todos");
    }
  }

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

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

  function renderProfile() {
    return (
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons
            name="person-outline"
            size={42}
            color={C.lavender}
          />
        </View>

        <Text style={styles.profileTitle}>Seu RolêJá</Text>

        <Text style={styles.profileDescription}>
          Seus próximos momentos começam aqui.
        </Text>

        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>
            ♡ Eventos favoritos
          </Text>
          <Text style={styles.profileValue}>
            {favorites.length}
          </Text>
        </View>

        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>
            ♫ Eventos carregados
          </Text>
          <Text style={styles.profileValue}>{events.length}</Text>
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
                source={require("../../assets/images/roleja-icon.png")}
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
            {tab === "Favoritos"
              ? "Os eventos que você guardou."
              : tab === "Perfil"
                ? "Seu espaço no RolêJá."
                : "Descubra eventos reais e encontre seus próximos ingressos."}
          </Text>

          {tab === "Perfil" ? (
            renderProfile()
          ) : (
            <>
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
                  {tab === "Favoritos"
                    ? "Seus favoritos"
                    : search || category !== "Todos"
                      ? "Resultados"
                      : "🔥 Eventos encontrados"}
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
                    onPress={() =>
                      setReloadKey((key) => key + 1)
                    }
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
            </>
          )}
        </ScrollView>

        <View style={styles.bottomNav}>
          {(
            [
              { name: "Início", icon: "home-outline" },
              { name: "Buscar", icon: "search-outline" },
              { name: "Favoritos", icon: "heart-outline" },
              { name: "Perfil", icon: "person-outline" },
            ] as {
              name: Tab;
              icon:
                | "home-outline"
                | "search-outline"
                | "heart-outline"
                | "person-outline";
            }[]
          ).map((item) => {
            const selected = tab === item.name;

            return (
              <Pressable
                key={item.name}
                style={styles.navItem}
                onPress={() => changeTab(item.name)}
              >
                <Ionicons
                  name={item.icon}
                  size={23}
                  color={selected ? C.lavender : "#8D829F"}
                />

                <Text
                  style={[
                    styles.navLabel,
                    selected && styles.navLabelSelected,
                  ]}
                >
                  {item.name}
                </Text>

                {selected && <View style={styles.indicator} />}
              </Pressable>
            );
          })}
        </View>
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
  profileCard: {
    backgroundColor: C.card,
    padding: 22,
    borderRadius: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
    marginTop: 10,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#382052",
    borderWidth: 2,
    borderColor: C.purple,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  profileTitle: {
    color: C.white,
    fontSize: 22,
    fontWeight: "900",
  },
  profileDescription: {
    color: C.muted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  profileRow: {
    width: "100%",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.light,
    borderRadius: 12,
    marginTop: 8,
  },
  profileLabel: { color: C.text, fontSize: 12 },
  profileValue: {
    color: C.lavender,
    fontWeight: "900",
    fontSize: 14,
  },
  bottomNav: {
    minHeight: 67,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#100D1B",
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 7,
    paddingBottom: 4,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  navLabel: { color: "#8D829F", fontSize: 10 },
  navLabelSelected: {
    color: C.lavender,
    fontWeight: "800",
  },
  indicator: {
    width: 17,
    height: 3,
    backgroundColor: C.purple,
    borderRadius: 2,
    marginTop: 1,
  },
});
