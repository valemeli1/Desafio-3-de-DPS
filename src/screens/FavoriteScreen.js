import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function FavoritesScreen() {
  const favorites = [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis favoritos</Text>
        <Ionicons
          name="heart"
          size={28}
          color="#2563EB"
        />
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="heart-outline"
            size={70}
            color="#94A3B8"
          />

          <Text style={styles.emptyTitle}>
            No tienes favoritos
          </Text>

          <Text style={styles.emptyText}>
            Los recursos que marques como favoritos
            aparecerán aquí.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {item.title}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FA",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E293B",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    marginTop: 18,
    fontSize: 21,
    fontWeight: "700",
    color: "#334155",
  },

  emptyText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    color: "#64748B",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1E293B",
  },
});