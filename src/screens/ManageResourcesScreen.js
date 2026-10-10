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

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await getRecursos();
      setRecursos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("ERROR CARGANDO RECURSOS:", error);
      mostrarMensaje("Error", "No se pudieron cargar los recursos.");
    } finally {
      setLoading(false);
    }
  };

  const mostrarMensaje = (titulo, mensaje) => {
    if (Platform.OS === "web") {
      window.alert(`${titulo}: ${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [])
  );

  const ejecutarEliminacion = async (resource) => {
    const id = resource?.id;
    if (!hasApiResourceId(resource)) {
      mostrarMensaje("No se puede eliminar", "Este registro no tiene el campo id que exige MockAPI. Debes eliminarlo desde el panel de MockAPI y volver a crearlo para que se genere un ID.");
      return;
    }

    try {
      setDeletingId(String(id));
      await deleteRecurso(id);

      setRecursos((actuales) =>
        actuales.filter((item) => String(item.id) !== String(id))
      );

      mostrarMensaje("Éxito", "El recurso se eliminó correctamente.");
    } catch (error) {
      console.error(
        "ERROR DELETE:",
        error.response?.status,
        error.response?.data || error.message
      );
      mostrarMensaje(
        "Error",
        error.response?.status
          ? `La API respondió con el estado ${error.response.status}.`
          : "No se pudo conectar con MockAPI. Revisa tu conexión."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = (resource) => {
    const confirmar = async () => ejecutarEliminacion(resource);
    const mensaje = `¿Seguro que deseas eliminar "${resource?.titulo || "este recurso"}"?`;

    if (Platform.OS === "web") {
      if (window.confirm(mensaje)) {
        confirmar();
      }
      return;
    }

    Alert.alert("Eliminar recurso", mensaje, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: confirmar },
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
        <Text style={styles.subtitle}>Crear, editar y eliminar recursos.</Text>
      </View>

      <Button
        mode="contained"
        icon="plus"
        onPress={() => navigation.navigate("FormularioRecurso")}
        style={styles.addButton}
      >
        Agregar recurso
      </Button>

      {recursos.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No hay recursos</Text>
          <Text style={styles.emptyText}>Actualmente no existen recursos registrados.</Text>
        </View>
      ) : (
        recursos.map((resource) => (
          <View key={String(resource.id)} style={styles.resourceContainer}>
            <ResourceCard resource={resource} />

            <View style={styles.actions}>
              <Button
                mode="outlined"
                icon="pencil"
                onPress={() => {
                  if (!hasApiResourceId(resource)) {
                    mostrarMensaje(
                      "No se puede editar",
                      "Este registro no tiene el campo id que exige MockAPI. Debes eliminarlo desde el panel de MockAPI y volver a crearlo para que se genere un ID."
                    );
                    return;
                  }
                  navigation.navigate("FormularioRecurso", { resource });
                }}
                disabled={deletingId !== null}
              >
                Editar
              </Button>

              <Button
                mode="outlined"
                icon="delete"
                textColor={COLORS.danger}
                loading={deletingId === String(resource.id)}
                disabled={deletingId !== null}
                onPress={() => handleDelete(resource)}
              >
                {deletingId === String(resource.id) ? "Eliminando..." : "Eliminar"}
              </Button>
            </View>
          </View>
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 10 },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { color: COLORS.textSecondary, marginTop: 4 },
  addButton: { marginVertical: 15 },
  resourceContainer: { marginBottom: 5 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
    marginBottom: 20,
  },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: COLORS.textSecondary },
  empty: { padding: 30, alignItems: "center" },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: COLORS.text },
  emptyText: { marginTop: 8, textAlign: "center", color: COLORS.textSecondary },
});
