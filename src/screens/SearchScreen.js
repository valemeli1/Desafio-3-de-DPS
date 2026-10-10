import React, {
  useCallback,
  useState,
} from "react";

import {
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Button,
  Menu,
  Searchbar,
} from "react-native-paper";

import { useFocusEffect } from "@react-navigation/native";

import ResourceCard from "../components/ResourceCard";
import Screen from "../components/Screen";

import { getRecursos } from "../api";

import { COLORS } from "../theme";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

export default function SearchScreen({
  navigation,
}) {
  const [recursos, setRecursos] = useState([]);
  const [query, setQuery] = useState("");
  const [campo, setCampo] = useState("todos");

  const [orden, setOrden] = useState("titulo");

  const [menuCampo, setMenuCampo] =
    useState(false);

  const [menuOrden, setMenuOrden] =
    useState(false);

  const [favoritos, setFavoritos] = useState([]);

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
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  const toggleFavorite = async (id) => {
    try {
      // Leer el último valor evita trabajar con una lista desactualizada.
      const saved = await AsyncStorage.getItem("favoritos");
      const actuales = saved ? JSON.parse(saved) : [];
      const ids = Array.isArray(actuales) ? actuales.map(String) : [];
      const idTexto = String(id);
      const updated = ids.includes(idTexto)
        ? ids.filter((item) => item !== idTexto)
        : [...ids, idTexto];

      await AsyncStorage.setItem("favoritos", JSON.stringify(updated));
      setFavoritos(updated);
    } catch (error) {
      console.error("Error guardando favorito:", error);
      Alert.alert("Error", "No se pudo guardar el favorito.");
    }
  };

  const filtrados = recursos
    .filter((item) => {
      const text = query
        .trim()
        .toLowerCase();

      if (!text) return true;

      if (campo === "id") {
        return String(item.id)
          .toLowerCase()
          .includes(text);
      }

      if (campo === "titulo") {
        return item.titulo
          ?.toLowerCase()
          .includes(text);
      }

      if (campo === "tipo") {
        return item.tipo
          ?.toLowerCase()
          .includes(text);
      }

      return (
        String(item.id)
          .toLowerCase()
          .includes(text) ||
        item.titulo
          ?.toLowerCase()
          .includes(text) ||
        item.tipo
          ?.toLowerCase()
          .includes(text)
      );
    })
    .sort((a, b) => {
      if (orden === "titulo") {
        return (a.titulo || "").localeCompare(
          b.titulo || ""
        );
      }

      if (orden === "id") {
        return Number(a.id) - Number(b.id);
      }

      if (orden === "rating") {
        return (
          Number(b.promedio || 0) -
          Number(a.promedio || 0)
        );
      }

      return 0;
    });

  return (
    <Screen>
      <Text style={styles.title}>
        Buscar recursos
      </Text>

      <Text style={styles.subtitle}>
        Busca por ID, título o tipo.
      </Text>

      <Searchbar
        placeholder="Buscar..."
        value={query}
        onChangeText={setQuery}
        style={styles.search}
      />

      <View style={styles.filters}>
        <Menu
          visible={menuCampo}
          onDismiss={() =>
            setMenuCampo(false)
          }
          anchor={
            <Button
              mode="outlined"
              onPress={() =>
                setMenuCampo(true)
              }
            >
              Campo: {campo}
            </Button>
          }
        >
          <Menu.Item
            title="Todos"
            onPress={() => {
              setCampo("todos");
              setMenuCampo(false);
            }}
          />

          <Menu.Item
            title="ID"
            onPress={() => {
              setCampo("id");
              setMenuCampo(false);
            }}
          />

          <Menu.Item
            title="Título"
            onPress={() => {
              setCampo("titulo");
              setMenuCampo(false);
            }}
          />

          <Menu.Item
            title="Tipo"
            onPress={() => {
              setCampo("tipo");
              setMenuCampo(false);
            }}
          />
        </Menu>

        <Menu
          visible={menuOrden}
          onDismiss={() =>
            setMenuOrden(false)
          }
          anchor={
            <Button
              mode="outlined"
              onPress={() =>
                setMenuOrden(true)
              }
            >
              Ordenar
            </Button>
          }
        >
          <Menu.Item
            title="Título"
            onPress={() => {
              setOrden("titulo");
              setMenuOrden(false);
            }}
          />

          <Menu.Item
            title="ID"
            onPress={() => {
              setOrden("id");
              setMenuOrden(false);
            }}
          />

          <Menu.Item
            title="Mejor calificación"
            onPress={() => {
              setOrden("rating");
              setMenuOrden(false);
            }}
          />
        </Menu>
      </View>

      <Text style={styles.results}>
        {filtrados.length} resultado(s)
      </Text>

      {filtrados.map((resource) => (
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
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 5,
    marginBottom: 15,
  },

  search: {
    marginBottom: 12,
  },

  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 15,
  },

  results: {
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
});