import React, { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Screen from "../components/Screen";
import ResourceCard from "../components/ResourceCard";
import { getRecursos } from "../api";
import { COLORS } from "../theme";
import { getResourceKey, cleanFavoriteKeys } from "../utils/resourceIdentity";

const FAVORITES_KEY = "favoritos";

export default function FavoriteScreen({ navigation }) {
  const [recursosFavoritos, setRecursosFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritosIds, setFavoritosIds] = useState([]);

  const cargarFavoritos = async () => {
    try {
      setLoading(true);
      const [recursos, saved] = await Promise.all([
        getRecursos(),
        AsyncStorage.getItem(FAVORITES_KEY),
      ]);

      const ids = cleanFavoriteKeys(saved ? JSON.parse(saved) : []);
      const idsNormalizados = ids;
      if (JSON.stringify(idsNormalizados) !== JSON.stringify(saved ? JSON.parse(saved) : [])) {
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(idsNormalizados));
      }

      setFavoritosIds(idsNormalizados);
      setRecursosFavoritos(
        (Array.isArray(recursos) ? recursos : []).filter((recurso) =>
          idsNormalizados.includes(getResourceKey(recurso))
        )
      );
    } catch (error) {
      console.error("Error cargando favoritos:", error);
      if (Platform.OS === "web") {
        window.alert("No se pudieron cargar tus favoritos.");
      } else {
        Alert.alert("Error", "No se pudieron cargar tus favoritos.");
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarFavoritos();
    }, [])
  );

  const quitarFavorito = async (id) => {
    try {
      const key = getResourceKey(id);
      const nuevosIds = favoritosIds.filter((favoritoId) => favoritoId !== key);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(nuevosIds));
      setFavoritosIds(nuevosIds);
      setRecursosFavoritos((actuales) =>
        actuales.filter((recurso) => getResourceKey(recurso) !== key)
      );
    } catch (error) {
      console.error("Error actualizando favoritos:", error);
      if (Platform.OS === "web") {
        window.alert("No se pudo actualizar la lista de favoritos.");
      } else {
        Alert.alert("Error", "No se pudo actualizar la lista de favoritos.");
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.emptyText}>Cargando favoritos...</Text>
      </View>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Mis favoritos</Text>
        <Text style={styles.count}>{recursosFavoritos.length} guardado(s)</Text>
      </View>

      {recursosFavoritos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.heart}>♡</Text>
          <Text style={styles.emptyTitle}>No tienes favoritos</Text>
          <Text style={styles.emptyText}>
            Pulsa el corazón de un recurso en Inicio o Buscar y aparecerá aquí.
          </Text>
        </View>
      ) : (
        recursosFavoritos.map((resource) => (
          <ResourceCard
            key={getResourceKey(resource)}
            resource={resource}
            favorito={true}
            onFavorite={() => quitarFavorito(resource)}
            onPress={() => navigation.navigate("DetalleRecurso", { resource })}
          />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
  },
  count: {
    marginTop: 5,
    color: COLORS.textSecondary,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  heart: {
    fontSize: 66,
    color: COLORS.primary,
  },
  emptyTitle: {
    marginTop: 14,
    fontSize: 21,
    fontWeight: "700",
    color: COLORS.text,
  },
  emptyText: {
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
    color: COLORS.textSecondary,
  },
});
