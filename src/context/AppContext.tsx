import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export type EventItem = {
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

  if (start?.dateTime) {
    const timestamp = Date.parse(start.dateTime);

    if (Number.isFinite(timestamp)) {
      return timestamp > Date.now();
    }
  }

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

type AppContextType = {
  events: EventItem[];
  search: string;
  setSearch: (search: string) => void;
  category: string;
  setCategory: (category: string) => void;
  tab: Tab;
  setTab: (tab: Tab) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  loading: boolean;
  error: string;
  favoritesLoaded: boolean;
  filteredEvents: EventItem[];
  reloadEvents: () => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [tab, setTab] = useState<Tab>("Início");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Carregar favoritos do AsyncStorage na inicialização
  useEffect(() => {
    let active = true;

    async function loadFavorites() {
      try {
        const stored = await AsyncStorage.getItem("@roleja:favorites");
        if (stored && active) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        }
      } catch (err) {
        console.warn("Erro ao carregar favoritos:", err);
      } finally {
        if (active) {
          setFavoritesLoaded(true);
        }
      }
    }

    loadFavorites();

    return () => {
      active = false;
    };
  }, []);

  // Salvar favoritos no AsyncStorage sempre que mudarem
  useEffect(() => {
    if (!favoritesLoaded) return;

    let active = true;

    async function saveFavorites() {
      try {
        await AsyncStorage.setItem("@roleja:favorites", JSON.stringify(favorites));
      } catch (err) {
        console.warn("Erro ao salvar favoritos:", err);
      }
    }

    saveFavorites();

    return () => {
      active = false;
    };
  }, [favorites, favoritesLoaded]);

  // Carregar eventos da Ticketmaster
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
    if (!favoritesLoaded && tab === "Favoritos") {
      return [];
    }

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
  }, [events, search, category, tab, favorites, favoritesLoaded]);

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

  function reloadEvents() {
    setReloadKey((key) => key + 1);
  }

  return (
    <AppContext.Provider
      value={{
        events,
        search,
        setSearch,
        category,
        setCategory,
        tab,
        setTab: changeTab,
        favorites,
        toggleFavorite,
        loading,
        error,
        favoritesLoaded,
        filteredEvents,
        reloadEvents,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}