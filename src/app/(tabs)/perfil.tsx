import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useApp } from "@/context/AppContext";

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

export default function PerfilScreen() {
  const {
    events,
    favorites,
    loading,
    error,
    favoritesLoaded,
    reloadEvents,
  } = useApp();

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
            Seu espaço no RolêJá.
          </Text>

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
          ) : !favoritesLoaded ? (
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
          ) : (
            <>
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

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Sobre o aplicativo</Text>
                <Text style={styles.infoText}>
                  RolêJá é um aplicativo de descoberta de eventos
                  que utiliza a API da Ticketmaster para buscar
                  shows, festivais, teatro, comédia e eventos
                  esportivos no Brasil.
                </Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Versão</Text>
                  <Text style={styles.infoValue}>1.0.0</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>SDK</Text>
                  <Text style={styles.infoValue}>Expo 58</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Framework</Text>
                  <Text style={styles.infoValue}>React Native</Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Tecnologias</Text>
                <Text style={styles.infoText}>
                  • React Native Paper
                  <Text style={styles.infoText}>
                    \n• Expo Router (navegação por abas)
                  </Text>
                  <Text style={styles.infoText}>
                    \n• AsyncStorage (persistência local)
                  </Text>
                  <Text style={styles.infoText}>
                    \n• Ticketmaster Discovery API
                  </Text>
                  <Text style={styles.infoText}>
                    \n• TypeScript
                  </Text>
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Desenvolvido por</Text>
                <Text style={styles.infoText}>
                  varasdev
                </Text>
                <Text style={styles.infoText}>
                  Projeto acadêmico para prática de desenvolvimento
                  mobile, integração com APIs externas, organização
                  de código e versionamento com Git e GitHub.
                </Text>
              </View>
            </>
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
  profileCard: {
    backgroundColor: C.card,
    padding: 22,
    borderRadius: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
    marginTop: 10,
    marginBottom: 20,
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
  infoCard: {
    backgroundColor: C.card,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 16,
  },
  infoTitle: {
    color: C.white,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  infoText: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
    marginTop: 8,
  },
  infoLabel: {
    color: C.muted,
    fontSize: 13,
  },
  infoValue: {
    color: C.lavender,
    fontSize: 13,
    fontWeight: "600",
  },
  messageCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
    gap: 12,
    marginBottom: 20,
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
  ticketButton: {
    backgroundColor: "#8438CC",
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    alignItems: "center",
    marginTop: 8,
  },
  ticketButtonText: {
    color: C.white,
    fontSize: 11,
    fontWeight: "800",
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