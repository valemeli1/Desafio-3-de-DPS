import React, {
  useCallback,
  useState,
} from "react";

import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  ActivityIndicator,
  Button,
} from "react-native-paper";

import { useFocusEffect } from "@react-navigation/native";

import {
  deleteRecurso,
  getRecursos,
} from "../api";

import Screen from "../components/Screen";
import ResourceCard from "../components/ResourceCard";

import { COLORS } from "../theme";

export default function ManageResourcesScreen({
  navigation,
}) {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const cargar = async () => {
    try {
      setLoading(true);

      const data = await getRecursos();

      console.log("RECURSOS RECIBIDOS:", data);

      setRecursos(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.log(
        "ERROR CARGANDO RECURSOS:",
        error
      );

      Alert.alert(
        "Error",
        "No se pudieron cargar los recursos."
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

const handleDelete = (resource) => {
  console.log("RECURSO SELECCIONADO:", resource);
  console.log("ID DEL RECURSO:", resource?.id);

  if (
    resource?.id === undefined ||
    resource?.id === null ||
    String(resource.id).trim() === ""
  ) {
    Alert.alert(
      "No se puede eliminar",
      "Este recurso no tiene un ID válido en la API."
    );
    console.error("No se envió DELETE porque falta el ID.");
    return;
  }

  const ejecutarEliminacion = async () => {
    console.log("INICIANDO DELETE:", resource.id);

    try {
      await deleteRecurso(resource.id);

      console.log("DELETE EXITOSO:", resource.id);

      setRecursos((actuales) =>
        actuales.filter(
          (item) => String(item.id) !== String(resource.id)
        )
      );

      if (Platform.OS === "web") {
        window.alert("El recurso se eliminó correctamente.");
      } else {
        Alert.alert("Éxito", "El recurso se eliminó correctamente.");
      }
    } catch (error) {
      console.error(
        "ERROR AL ELIMINAR:",
        error.response?.status,
        error.response?.data || error.message
      );

      if (Platform.OS === "web") {
        window.alert(
          `No se pudo eliminar el recurso. ${
            error.response?.status || error.message
          }`
        );
      } else {
        Alert.alert(
          "Error",
          `No se pudo eliminar el recurso. ${
            error.response?.status || error.message
          }`
        );
      }
    }
  };

  if (Platform.OS === "web") {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar "${resource.titulo}"?`
    );

    if (confirmar) {
      ejecutarEliminacion();
    }
  } else {
    Alert.alert(
      "Eliminar recurso",
      `¿Seguro que deseas eliminar "${resource.titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: ejecutarEliminacion,
        },
      ]
    );
  }
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
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>
          Gestionar recursos
        </Text>

        <Text style={styles.subtitle}>
          Crear, editar y eliminar recursos.
        </Text>
      </View>

      <Button
        mode="contained"
        icon="plus"
        onPress={() =>
          navigation.navigate(
            "FormularioRecurso"
          )
        }
        style={styles.addButton}
      >
        Agregar recurso
      </Button>

      {recursos.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            No hay recursos
          </Text>

          <Text style={styles.emptyText}>
            Actualmente no existen recursos registrados.
          </Text>
        </View>
      ) : (
        recursos.map((resource) => (
          <View
            key={String(resource.id)}
            style={styles.resourceContainer}
          >
            <ResourceCard
              resource={resource}
            />

            <View style={styles.actions}>
              <Button
                mode="outlined"
                icon="pencil"
                onPress={() =>
                  navigation.navigate(
                    "FormularioRecurso",
                    {
                      resource,
                    }
                  )
                }
                disabled={
                  deletingId !== null
                }
              >
                Editar
              </Button>

              <Button
                mode="outlined"
                icon="delete"
                textColor={COLORS.danger}
                loading={
                  deletingId === resource.id
                }
                disabled={
                  deletingId !== null
                }
                onPress={() =>
                  handleDelete(resource)
                }
              >
                {deletingId === resource.id
                  ? "Eliminando..."
                  : "Eliminar"}
              </Button>
            </View>
          </View>
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
    marginTop: 4,
  },

  addButton: {
    marginVertical: 15,
  },

  resourceContainer: {
    marginBottom: 5,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
    marginBottom: 20,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: COLORS.textSecondary,
  },

  empty: {
    padding: 30,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },

  emptyText: {
    marginTop: 8,
    textAlign: "center",
    color: COLORS.textSecondary,
  },
});