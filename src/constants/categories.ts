export const categories = [
  { name: "Todos", icon: "apps-outline" },
  { name: "Shows", icon: "musical-notes-outline" },
  { name: "Festivais", icon: "sparkles-outline" },
  { name: "Teatro", icon: "ticket-outline" },
  { name: "Comédia", icon: "happy-outline" },
  { name: "Esportes", icon: "football-outline" },
] as const;

export type CategoryName = (typeof categories)[number]["name"];
export type CategoryIcon = (typeof categories)[number]["icon"];