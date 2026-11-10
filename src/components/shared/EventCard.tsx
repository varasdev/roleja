import React from "react";
import {
  Alert,
  ImageBackground,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "@/constants/colors";
import type { EventItem } from "@/context/AppContext";

interface EventCardProps {
  event: EventItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 17,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    height: 175,
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: colors.light,
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
    color: colors.white,
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
    color: colors.lavender,
    fontSize: 10,
    fontWeight: "900",
    paddingHorizontal: 10,
    paddingVertical: 7,
    overflow: "hidden",
  },
  cityBadge: {
    backgroundColor: "#171126",
    borderRadius: 8,
    color: colors.white,
    fontSize: 10,
    fontWeight: "600",
    paddingHorizontal: 9,
    paddingVertical: 7,
    overflow: "hidden",
    flexShrink: 1,
  },
  body: { padding: 15 },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 9,
  },
  info: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 13,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceContainer: { flexShrink: 1 },
  priceCaption: {
    color: colors.muted,
    fontSize: 10,
    marginBottom: 4,
  },
  price: {
    color: colors.lavender,
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
    color: colors.white,
    fontSize: 11,
    fontWeight: "800",
  },
});

async function openTickets(url: string) {
  if (!url) {
    Alert.alert("Link indisponível", "A API não forneceu um link para este evento.");
    return;
  }

  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Erro", "Não foi possível abrir a página do evento.");
  }
}

export function EventCard({ event, isFavorite, onToggleFavorite }: EventCardProps) {
  return (
    <View style={styles.card}>
      <ImageBackground
        source={{ uri: event.image }}
        style={styles.image}
        imageStyle={styles.imageRounded}
        resizeMode="cover"
      >
        <View style={styles.imageHeader}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{event.category.toUpperCase()}</Text>
          </View>

          <Pressable
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite(event.id)}
            accessibilityLabel={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={25}
              color={isFavorite ? "#F472B6" : colors.white}
            />
          </Pressable>
        </View>

        <View style={styles.imageFooter}>
          <Text style={styles.dateBadge}>{event.date}</Text>

          <Text style={styles.cityBadge} numberOfLines={1}>
            ⌖ {event.city}
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.body}>
        <Text style={styles.title}>{event.title}</Text>

        <Text style={styles.info}>⌖ {event.venue}</Text>
        <Text style={styles.info}>◷ {event.time}</Text>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceCaption}>Ingresso</Text>
            <Text style={styles.price}>{event.price}</Text>
          </View>

          <Pressable style={styles.ticketButton} onPress={() => openTickets(event.url)}>
            <Text style={styles.ticketButtonText}>Comprar ingresso →</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}