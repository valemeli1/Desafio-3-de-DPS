import React, { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

import { deleteRecurso, getRecursos } from "../api";
import Screen from "../components/Screen";
import ResourceCard from "../components/ResourceCard";
import { COLORS } from "../theme";
import { hasApiResourceId } from "../utils/resourceIdentity";

export default function ManageResourcesScreen({ navigation }) {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const mostrarMensaje = (titulo, mensaje) => {
    if (Platform.OS === "web") {
      window.alert(`${titulo}\n\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const cargar = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getRecursos();

      if (!Array.isArray(data)) {
        throw new Error("La API no devolvió una lista de recursos.");
      }

      setRecursos(data);
      console.log("Recursos cargados:", data.length);
    } catch (error) {
      console.error(
        "ERROR AL CARGAR RECURSOS:",
        error.response?.status,
        error.response?.data || error.message
      );

      mostrarMensaje(
        "Error al cargar",
        error.response?.status === 404
          ? "MockAPI respondió 404. Verifica que exista la colección recursos y que la URL de la API sea correcta."
          : "No se pudieron cargar los recursos. Revisa tu conexión."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  const handleAdd = () => {
    navigation.navigate("FormularioRecurso");
  };

  const handleEdit = (resource) => {
    if (!hasApiResourceId(resource)) {
      mostrarMensaje(
        "No se puede editar",
        "Este recurso no tiene un ID válido de MockAPI."
      );
      return;
    }

    navigation.navigate("FormularioRecurso", { resource });
  };

  const ejecutarEliminacion = async (resource) => {
    if (!hasApiResourceId(resource)) {
      mostrarMensaje(
        "No se puede eliminar",
        "Este recurso no tiene un ID válido de MockAPI."
      );
      return;
    }

    const id = String(resource.id);

    try {
      setDeletingId(id);

      await deleteRecurso(id);

      setRecursos((actuales) =>
        actuales.filter((item) => String(item.id) !== id)
      );

      mostrarMensaje("Éxito", "Recurso eliminado correctamente.");
    } catch (error) {
      console.error(
        "ERROR AL ELIMINAR:",
        error.response?.status,
        error.response?.data || error.message
      );

      mostrarMensaje(
        "Error al eliminar",
        error.response?.status === 404
          ? "MockAPI no encontró ese recurso. Comprueba su ID en la colección recursos."
          : "No se pudo eliminar el recurso."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = (resource) => {
    const mensaje = `¿Deseas eliminar "${resource.titulo || "este recurso"}"?`;

    if (Platform.OS === "web") {
      if (window.confirm(mensaje)) {
        ejecutarEliminacion(resource);
      }
      return;
    }

    Alert.alert("Eliminar recurso", mensaje, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => ejecutarEliminacion(resource),
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando recursos...</Text>
      </View>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Gestionar recursos</Text>
        <Text style={styles.subtitle}>
          Crea, consulta, edita y elimina recursos educativos.
        </Text>
      </View>

      <Button
        mode="contained"
        icon="plus"
        onPress={handleAdd}
        style={styles.addButton}
      >
        Agregar recurso
      </Button>

      {recursos.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No hay recursos</Text>
          <Text style={styles.emptyText}>
            No se encontraron recursos en la colección.
          </Text>
        </View>
      ) : (
        recursos.map((resource, index) => {
          const idValido = hasApiResourceId(resource);
          const key = idValido
            ? String(resource.id)
            : `recurso-sin-id-${index}`;

          return (
            <View key={key} style={styles.resourceContainer}>
              <ResourceCard resource={resource} />

              {!idValido && (
                <Text style={styles.warning}>
                  Este registro no tiene un ID válido y no se puede editar ni eliminar.
                </Text>
              )}

              <View style={styles.actions}>
                <Button
                  mode="outlined"
                  icon="pencil"
                  disabled={!idValido || deletingId !== null}
                  onPress={() => handleEdit(resource)}
                >
                  Editar
                </Button>

                <Button
                  mode="outlined"
                  icon="delete"
                  textColor={COLORS.danger}
                  disabled={!idValido || deletingId !== null}
                  loading={deletingId === String(resource.id)}
                  onPress={() => handleDelete(resource)}
                >
                  Eliminar
                </Button>
              </View>
            </View>
          );
        })
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
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 18,
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
  warning: {
    color: COLORS.danger,
    marginHorizontal: 16,
    marginBottom: 8,
  },
});