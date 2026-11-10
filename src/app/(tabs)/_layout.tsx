import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { colors } from "@/constants/colors";

type IconName =
  | "home-outline"
  | "home"
  | "search-outline"
  | "search"
  | "heart-outline"
  | "heart"
  | "person-outline"
  | "person";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  const navColors = {
    background: "#100D1B",
    active: colors.lavender,
    inactive: "#8D829F",
    indicator: colors.purple,
    border: colors.border,
  };

  const renderIcon = (
    name: IconName,
    focusedName: IconName,
    color: unknown,
    size: number,
    focused: boolean
  ) => (
    <Ionicons
      name={focused ? focusedName : name}
      size={size}
      color={(color as any) ?? (focused ? navColors.active : navColors.inactive)}
    />
  );

  // Altura base da tab bar + inset inferior do Android
  const tabBarHeight = 67;
  const tabBarPaddingBottom = Math.max(4, insets.bottom);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: navColors.active,
        tabBarInactiveTintColor: navColors.inactive,
        tabBarStyle: {
          backgroundColor: navColors.background,
          borderTopWidth: 1,
          borderTopColor: navColors.border,
          paddingTop: 7,
          paddingBottom: tabBarPaddingBottom,
          minHeight: tabBarHeight + tabBarPaddingBottom,
        },
        tabBarLabelStyle: {
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ focused, color, size }) =>
            renderIcon("home-outline", "home", color, size, focused),
        }}
      />
      <Tabs.Screen
        name="buscar"
        options={{
          title: "Buscar",
          tabBarIcon: ({ focused, color, size }) =>
            renderIcon("search-outline", "search", color, size, focused),
        }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ focused, color, size }) =>
            renderIcon("heart-outline", "heart", color, size, focused),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused, color, size }) =>
            renderIcon("person-outline", "person", color, size, focused),
        }}
      />
    </Tabs>
  );
}