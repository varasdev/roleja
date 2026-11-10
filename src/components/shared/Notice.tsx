import React from "react";
import { StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
  notice: {
    color: "#81768F",
    fontSize: 10,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 15,
  },
});

export function Notice() {
  return (
    <Text style={styles.notice}>
      Os eventos exibidos ainda vão acontecer. Preços e
      disponibilidade dependem das informações fornecidas
      pela Ticketmaster. A compra ocorre no site do evento.
    </Text>
  );
}