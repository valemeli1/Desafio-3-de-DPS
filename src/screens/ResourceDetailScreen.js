import React, {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Button,
  Card,
  Divider,
} from "react-native-paper";

import {
  getCalificaciones,
  createCalificacion,
  updateRecurso,
  getRecursos,
} from "../api";

import Stars from "../components/Stars";
import Screen from "../components/Screen";

import { COLORS } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function ResourceDetailScreen({
  route,
}) {
  const { resource: initialResource } =
    route.params;

  const { user } = useAuth();

  const [resource, setResource] =
    useState(initialResource);

  const [rating, setRating] = useState(0);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserRating();
  }, []);

  const loadUserRating = async () => {
    try {
      const ratings =
        await getCalificaciones();

      const existing = ratings.find(
        (item) =>
          String(item.recursoId) ===
            String(resource.id) &&
          String(item.usuarioId) ===
            String(user.id)
      );

      if (existing) {
        setRating(Number(existing.rating));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRating = async (value) => {
    if (saving) return;

    try {
      setSaving(true);

      const ratings =
        await getCalificaciones();

      const existing = ratings.find(
        (item) =>
          String(item.recursoId) ===
            String(resource.id) &&
          String(item.usuarioId) ===
            String(user.id)
      );

      if (existing) {
        Alert.alert(
          "Ya calificaste",
          "Ya has calificado este recurso."
        );

        setRating(Number(existing.rating));

        return;
      }

      await createCalificacion({
        recursoId: String(resource.id),
        usuarioId: String(user.id),
        rating: value,
        fecha: new Date().toISOString(),
      });

      const updatedRatings =
        await getCalificaciones();

      const resourceRatings =
        updatedRatings.filter(
          (item) =>
            String(item.recursoId) ===
            String(resource.id)
        );

      const total = resourceRatings.reduce(
        (sum, item) =>
          sum + Number(item.rating || 0),
        0
      );

      const average =
        resourceRatings.length > 0
          ? total / resourceRatings.length
          : 0;

      const allResources =
        await getRecursos();

      const currentResource =
        allResources.find(
          (item) =>
            String(item.id) ===
            String(resource.id)
        );

      await updateRecurso(
        resource.id,
        {
          ...currentResource,
          promedio: Number(
            average.toFixed(1)
          ),
        }
      );

      setRating(value);

      setResource((current) => ({
        ...current,
        promedio: Number(
          average.toFixed(1)
        ),
      }));

      Alert.alert(
        "Calificación guardada",
        "Tu calificación se guardó correctamente."
      );
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "No se pudo guardar la calificación."
      );
    } finally {
      setSaving(false);
    }
  };

  const openLink = async () => {
    try {
      const supported =
        await Linking.canOpenURL(
          resource.enlace
        );

      if (!supported) {
        Alert.alert(
          "Enlace inválido",
          "El enlace no puede abrirse."
        );

        return;
      }

      await Linking.openURL(
        resource.enlace
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo abrir el enlace."
      );
    }
  };

  return (
    <Screen>
      <Card style={styles.card}>
        <Card.Cover
          source={{
            uri:
              resource.imagen ||
              "https://placehold.co/600x400/png",
          }}
        />

        <Card.Content>
          <Text style={styles.type}>
            {resource.tipo}
          </Text>

          <Text style={styles.title}>
            {resource.titulo}
          </Text>

          <Text style={styles.description}>
            {resource.descripcion}
          </Text>

          <Divider
            style={styles.divider}
          />

          <Text style={styles.ratingTitle}>
            Calificación promedio
          </Text>

          <View style={styles.ratingRow}>
            <Stars
              value={Number(
                resource.promedio || 0
              )}
              size={25}
            />

            <Text style={styles.average}>
              {Number(
                resource.promedio || 0
              ).toFixed(1)}
              /5
            </Text>
          </View>

          <Divider
            style={styles.divider}
          />

          <Text style={styles.ratingTitle}>
            Tu calificación
          </Text>

          <Stars
            value={rating}
            onChange={handleRating}
            size={32}
          />

          <Button
            mode="contained"
            icon="open-in-new"
            onPress={openLink}
            style={styles.button}
          >
            Abrir recurso
          </Button>
        </Card.Content>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
  },

  type: {
    color: COLORS.primary,
    fontWeight: "700",
    marginTop: 15,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 5,
  },

  description: {
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginTop: 12,
  },

  divider: {
    marginVertical: 18,
  },

  ratingTitle: {
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  average: {
    marginLeft: 10,
    fontWeight: "700",
    color: COLORS.text,
  },

  button: {
    marginTop: 20,
    marginBottom: 5,
  },
});