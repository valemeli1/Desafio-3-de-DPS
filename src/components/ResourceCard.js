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

  // Validar la URL de la imagen.
  const imagen =
    typeof item.imagen === "string" &&
    /^https?:\/\//i.test(item.imagen.trim())
      ? item.imagen.trim()
      : null;

  // Obtener las calificaciones guardadas en MockAPI.
  const calificaciones = Array.isArray(item.calificaciones)
    ? item.calificaciones
    : [];

  // Calcular el promedio a partir de las calificaciones.
  const promedioCalculado =
    calificaciones.length > 0
      ? calificaciones.reduce((total, calificacion) => {
          return total + Number(calificacion.rating || 0);
        }, 0) / calificaciones.length
      : Number(item.promedio || 0);

  const rating = Number.isFinite(promedioCalculado)
    ? Math.max(0, Math.min(5, promedioCalculado))
    : 0;

  const cantidadCalificaciones = calificaciones.length;

  // Comprobar si el recurso está en favoritos.
  const esFavorito =
    isFavorite !== undefined ? isFavorite : favorito;

  // Mostrar la fecha correctamente.
  const fechaValida =
    item.fecha && !Number.isNaN(Date.parse(item.fecha));

  const fechaFormateada = fechaValida
    ? new Date(item.fecha).toLocaleDateString()
    : "Fecha no disponible";

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
        {/* Tipo de recurso y favorito */}
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
              iconColor={
                esFavorito ? "#F472B6" : COLORS.primary
              }
              onPress={onFavorite}
              disabled={!onFavorite}
              accessibilityLabel="Cambiar favorito"
            />
          )}
        </View>

        {/* Título */}
        <Text variant="titleMedium" style={styles.title}>
          {item.titulo || "Sin título"}
        </Text>

        {/* Descripción */}
        <Text
          variant="bodyMedium"
          style={styles.description}
          numberOfLines={3}
        >
          {item.descripcion || "Sin descripción disponible."}
        </Text>

        {/* Promedio, cantidad de calificaciones y fecha */}
        <View style={styles.metadata}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>
              ★ {rating.toFixed(1)} / 5
            </Text>

            <Text style={styles.ratingCount}>
              ({cantidadCalificaciones}{" "}
              {cantidadCalificaciones === 1
                ? "calificación"
                : "calificaciones"})
            </Text>
          </View>

          <Text style={styles.date}>
            {fechaFormateada}
          </Text>
        </View>

        {/* Enlace del recurso */}
        {item.enlace ? (
          <Text style={styles.link} numberOfLines={1}>
            {item.enlace}
          </Text>
        ) : null}

        {/* Estrellas interactivas para calificar */}
        {onRate && !docente && (
          <View style={styles.rateContainer}>
            <Text style={styles.rateLabel}>
              Califica este recurso
            </Text>

            <Stars
              value={Number(item.miCalificacion || 0)}
              onChange={onRate}
              size={28}
            />
          </View>
        )}

        {/* Acciones del docente */}
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
    gap: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  ratingText: {
    color: COLORS.yellow,
    fontWeight: "bold",
  },
  ratingCount: {
    color: COLORS.secondary,
    fontSize: 12,
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