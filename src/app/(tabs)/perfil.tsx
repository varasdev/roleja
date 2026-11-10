import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useApp } from "@/context/AppContext";
import { colors } from "@/constants/colors";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { MessageCard } from "@/components/shared/MessageCard";
import { Notice } from "@/components/shared/Notice";

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
  profileCard: {
    backgroundColor: colors.card,
    padding: 22,
    borderRadius: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 10,
    marginBottom: 20,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#382052",
    borderWidth: 2,
    borderColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  profileTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
  },
  profileDescription: {
    color: colors.muted,
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
    backgroundColor: colors.light,
    borderRadius: 12,
    marginTop: 8,
  },
  profileLabel: { color: colors.text, fontSize: 12 },
  profileValue: {
    color: colors.lavender,
    fontWeight: "900",
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  infoTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  infoText: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 13,
  },
  infoValue: {
    color: colors.lavender,
    fontSize: 13,
    fontWeight: "600",
  },
});

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
    <SafeAreaView style={styles.safe} edges={["top", "right", "left"]}>
      <StatusBar barStyle="light-content" />

      <View style={styles.screen}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ScreenHeader />

          <Text style={styles.subtitle}>
            Seu espaço no RolêJá.
          </Text>

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
          ) : (
            <>
              <View style={styles.profileCard}>
                <View style={styles.avatar}>
                  <Ionicons name="person-outline" size={42} color={colors.lavender} />
                </View>

                <Text style={styles.profileTitle}>Seu RolêJá</Text>

                <Text style={styles.profileDescription}>
                  Seus próximos momentos começam aqui.
                </Text>

                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>
                    ♡ Eventos favoritos
                  </Text>
                  <Text style={styles.profileValue}>{favorites.length}</Text>
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

          <Notice />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}