import React from "react";

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Stars from "./Stars";

import { COLORS } from "../theme";

export default function ResourceCard({
  resource,
  onPress,
  onFavorite,
  isFavorite = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={{
          uri:
            resource.imagen ||
            "https://placehold.co/600x400/png",
        }}
        style={styles.image}
      />

      <View style={styles.body}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text
              style={styles.title}
              numberOfLines={2}
            >
              {resource.titulo}
            </Text>

            <Text style={styles.type}>
              {resource.tipo}
            </Text>
          </View>

          {onFavorite && (
            <Pressable
              onPress={(event) => {
                event.stopPropagation();
                onFavorite();
              }}
              style={styles.favorite}
            >
              <Ionicons
                name={
                  isFavorite
                    ? "heart"
                    : "heart-outline"
                }
                size={25}
                color={
                  isFavorite
                    ? COLORS.danger
                    : COLORS.textSecondary
                }
              />
            </Pressable>
          )}
        </View>

        <Text
          style={styles.description}
          numberOfLines={3}
        >
          {resource.descripcion}
        </Text>

        <View style={styles.ratingRow}>
          <Stars
            value={Number(resource.promedio || 0)}
            size={18}
          />

          <Text style={styles.ratingText}>
            {Number(resource.promedio || 0).toFixed(1)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },

  pressed: {
    opacity: 0.9,
  },

  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#E2E8F0",
  },

  body: {
    padding: 14,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  titleContainer: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },

  type: {
    color: COLORS.primary,
    fontWeight: "600",
    marginTop: 4,
  },

  favorite: {
    padding: 4,
  },

  description: {
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginTop: 10,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  ratingText: {
    marginLeft: 7,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
});