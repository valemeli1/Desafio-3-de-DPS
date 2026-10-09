
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
  isFavorite,
  onRate,
  onEdit,
  onDelete,
  docente = false,
}) {
  const item = recurso || resource || {};

  const imagen =
    typeof item.imagen === "string" &&
    /^https?:\/\//i.test(item.imagen.trim())
      ? item.imagen.trim()
      : null;

  const promedio = Number(item.promedio);
  const rating = Number.isFinite(promedio)
    ? Math.max(0, Math.min(5, promedio))
    : 0;

  const esFavorito =
    isFavorite !== undefined ? isFavorite : favorito;

  return (
    <Card style={styles.card} onPress={onPress}>
      {imagen ? (
        <Image
          source={{ uri: imagen }}
          style={styles.image}
          resizeMode="cover"
          onError={() =>
            console.log("Error al cargar imagen:", imagen)
          }
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>💻</Text>
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
            {item.tipo || "Recurso educativo"}
          </Chip>

          {!docente && (
            <IconButton
              icon={esFavorito ? "heart" : "heart-outline"}
              iconColor={esFavorito ? "#F472B6" : COLORS.primary}
              onPress={onFavorite}
              disabled={!onFavorite}
              accessibilityLabel="Cambiar favorito"
            />
          )}
        </View>

        <Text variant="titleMedium" style={styles.title}>
          {item.titulo || "Sin título"}
        </Text>

        <Text
          variant="bodyMedium"
          style={styles.description}
          numberOfLines={3}
        >
          {item.descripcion || "Sin descripción disponible."}
        </Text>

        <View style={styles.metadata}>
          <Text style={styles.ratingText}>
            ★ {rating.toFixed(1)} / 5
          </Text>

          <Text style={styles.date}>
            {item.fecha &&
            !Number.isNaN(Date.parse(item.fecha))
              ? new Date(item.fecha).toLocaleDateString()
              : "Fecha no disponible"}
          </Text>
        </View>

        {item.enlace ? (
          <Text style={styles.link} numberOfLines={1}>
            {item.enlace}
          </Text>
        ) : null}
{onRate && !docente && (
  <View style={styles.rateContainer}>
    <Stars
      value={Number(item.miCalificacion || 0)}
      onChange={onRate}
    />
  </View>
)}

        {docente && (
          <View style={styles.actions}>
            <IconButton
              icon="pencil-outline"
              iconColor={COLORS.primary}
              onPress={onEdit}
              disabled={!onEdit}
              accessibilityLabel="Editar recurso"
            />

            <IconButton
              icon="delete-outline"
              iconColor={COLORS.danger}
              onPress={onDelete}
              disabled={!onDelete}
              accessibilityLabel="Eliminar recurso"
            />
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
  placeholder: {
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#302742",
  },
  placeholderIcon: {
    fontSize: 36,
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
  metadata: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  ratingText: {
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
  starsContainer: {
    marginTop: 12,
    gap: 6,
  },
  rateLabel: {
    color: COLORS.secondary,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
  },
});
