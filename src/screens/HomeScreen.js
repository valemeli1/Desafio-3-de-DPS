import React, {
  useCallback,
  useState,
} from "react";

import {
  Alert,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  ActivityIndicator,
  Chip,
} from "react-native-paper";

import { useFocusEffect } from "@react-navigation/native";

import ResourceCard from "../components/ResourceCard";
import Screen from "../components/Screen";

import { getRecursos } from "../api";

import { COLORS } from "../theme";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

export default function HomeScreen({
  navigation,
}) {
  const [recursos, setRecursos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = async () => {
    try {
      const data = await getRecursos();

      setRecursos(data);

      const saved =
        await AsyncStorage.getItem(
          "favoritos"
        );

      if (saved) {
        setFavoritos(JSON.parse(saved));
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudieron cargar los recursos."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  const toggleFavorite = async (id) => {
    let updated;

    if (favoritos.includes(String(id))) {
      updated = favoritos.filter(
        (item) => item !== String(id)
      );
    } else {
      updated = [
        ...favoritos,
        String(id),
      ];
    }

    setFavoritos(updated);

    await AsyncStorage.setItem(
      "favoritos",
      JSON.stringify(updated)
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Cargando recursos...
        </Text>
      </View>
    );
  }

  return (
    <Screen
      style={{
        paddingBottom: 30,
      }}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Recursos de aprendizaje
          </Text>

          <Text style={styles.subtitle}>
            Encuentra material para tu carrera.
          </Text>
        </View>
      </View>

      <Chip
        icon="book-open-page-variant"
        style={styles.chip}
      >
        {recursos.length} recursos disponibles
      </Chip>

      {recursos.length === 0 ? (
        <Text style={styles.empty}>
          No existen recursos todavía.
        </Text>
      ) : (
        recursos.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            isFavorite={favoritos.includes(
              String(resource.id)
            )}
            onFavorite={() =>
              toggleFavorite(resource.id)
            }
            onPress={() =>
              navigation.navigate(
                "DetalleRecurso",
                {
                  resource,
                }
              )
            }
          />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 5,
  },

  chip: {
    alignSelf: "flex-start",
    marginVertical: 15,
  },

  empty: {
    textAlign: "center",
    color: COLORS.textSecondary,
    marginTop: 40,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 10,
    color: COLORS.textSecondary,
  },
});