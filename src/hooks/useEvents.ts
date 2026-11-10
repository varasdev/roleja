import { useMemo } from "react";
import { useApp } from "@/context/AppContext";

export function useFilteredEvents() {
  const { events, search, category, tab, favorites, favoritesLoaded } = useApp();

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

      const matchesCategory = category === "Todos" || event.category === category;

      const matchesFavorites = tab !== "Favoritos" || favorites.includes(event.id);

      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [events, search, category, tab, favorites, favoritesLoaded]);

  return filteredEvents;
}

export function useFavoriteEvents() {
  const { events, favorites } = useApp();

  const favoriteEvents = useMemo(() => {
    return events.filter((event) => favorites.includes(event.id));
  }, [events, favorites]);

  return favoriteEvents;
}