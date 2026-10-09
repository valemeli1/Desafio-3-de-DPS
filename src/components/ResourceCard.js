
import React from "react";

import {
  Image,
  StyleSheet,
  View,
} from "react-native";

import {
  Card,
  Chip,
  IconButton,
  Text,
} from "react-native-paper";

import Stars from "./Stars";

const COLORS = {
  background: "#110D1B",
  surface: "#1C1729",
  border: "#352847",
  primary: "#A78BFA",
  text: "#F5F3FF",
  secondary: "#C4B5D6",
  yellow: "#FBBF24",
  danger: "#F87171",
};

export default function ResourceCard({
  recurso,
  resource,
  onPress,
  onFavorite,
  favorito = false,
  onRate,
  onEdit,
  onDelete,
  docente = false,
}) {
  // Acepta ambos nombres para mantener compatibilidad.
  const item = recurso || resource || {};

  const titulo = item.titulo || "Sin título";
  const descripcion =
    item.descripcion || "Sin descripción disponible.";
  const tipo = item.tipo || "Recurso educativo";

  const promedio = Number(item.promedio);
  const rating = Number.isFinite(promedio) ? promedio : 0;

  const imagen =
    typeof item.imagen === "string" &&
    item.imagen.trim().startsWith("https://")
      ? item.imagen.trim()
      : typeof item.imagen === "string" &&
          item.imagen.trim().startsWith("http://")
        ? item.imagen.trim()
        : null;

  return (
    <Card style={styles.card} onPress={onPress}>
      {imagen ? (
        <Image
          source={{ uri: imagen }}
          style={styles.image}
          resizeMode="cover"
          onError={() =>
            console.log("No se pudo cargar la imagen:", imagen)
          }
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text variant="headlineMedium">💻</Text>
          <Text style={styles.placeholderText}>
            Imagen no disponible
          </Text>
        </View>
      )}

      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Chip
            compact
            style={styles.chip}
            textStyle={styles.chipText}
          >
            {tipo}
          </Chip>

          {!docente && onFavorite && (
            <IconButton
              icon={favorito ? "heart" : "heart-outline"}
              iconColor={favorito ? "#F472B6" : COLORS.primary}
              onPress={onFavorite}
              accessibilityLabel={
                favorito
                  ? "Quitar de favoritos"
                  : "Agregar a favoritos"
              }
            />
          )}
        </View>

        <Text variant="titleMedium" style={styles.title}>
          {titulo}
        </Text>

        <Text
          variant="bodyMedium"
          style={styles.description}
          numberOfLines={3}
        >
          {descripcion}
        </Text>

        <View style={styles.ratingRow}>
          <Text style={styles.rating}>
            ★ {rating.toFixed(1)}
          </Text>

          {item.fecha && (
            <Text style={styles.date}>
              {String(item.fecha).slice(0, 10)}
            </Text>
          )}
        </View>

        {item.enlace && (
          <Text
            style={styles.link}
            numberOfLines={1}
          >
            {item.enlace}
          </Text>
        )}

        {onRate && !docente && (
          <View style={styles.rateContainer}>
            <Stars
              rating={rating}
              onRate={onRate}
            />
          </View>
        )}

        {docente && (
          <View style={styles.actions}>
            {onEdit && (
              <IconButton
                icon="pencil-outline"
                iconColor={COLORS.primary}
                onPress={onEdit}
                accessibilityLabel="Editar recurso"
              />
            )}

            {onDelete && (
              <IconButton
                icon="delete-outline"
                iconColor={COLORS.danger}
                onPress={onDelete}
                accessibilityLabel="Eliminar recurso"
              />
            )}
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  image: {
    width: "100%",
    height: 175,
    backgroundColor: "#302742",
  },

  imagePlaceholder: {
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#302742",
  },

  placeholderText: {
    color: COLORS.secondary,
  },

  content: {
    paddingTop: 12,
    paddingBottom: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  chip: {
    backgroundColor: "#352451",
  },

  chipText: {
    color: "#DDD6FE",
  },

  title: {
    color: COLORS.text,
    fontWeight: "bold",
    marginTop: 8,
  },

  description: {
    color: COLORS.secondary,
    marginTop: 8,
    lineHeight: 21,
  },

  ratingRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rating: {
    color: COLORS.yellow,
    fontWeight: "bold",
  },

  date: {
    color: COLORS.secondary,
    fontSize: 12,
  },

  link: {
    color: COLORS.primary,
    marginTop: 8,
    fontSize: 12,
  },

  rateContainer: {
    marginTop: 8,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },
});
