<<<<<<< HEAD
=======

>>>>>>> b57e0d5 (fix: fixing ids and CRUD)
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
<<<<<<< HEAD
import { hasApiResourceId } from "../utils/resourceIdentity";
=======
import {
  getResourceKey,
  hasApiResourceId,
} from "../utils/resourceIdentity";
>>>>>>> b57e0d5 (fix: fixing ids and CRUD)

export default function ManageResourcesScreen({ navigation }) {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const mostrarMensaje = (titulo, mensaje) => {
    if (Platform.OS === "web") {
      window.alert(`${titulo}: ${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const cargar = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRecursos();
<<<<<<< HEAD
      setRecursos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("ERROR CARGANDO RECURSOS:", error);
      mostrarMensaje("Error", "No se pudieron cargar los recursos.");
=======

      console.log(
        "RECURSOS RECIBIDOS DE MOCKAPI:",
        JSON.stringify(data, null, 2)
      );

      setRecursos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "ERROR CARGANDO RECURSOS:",
        error.response?.data || error.message
      );

      mostrarMensaje(
        "Error",
        "No se pudieron cargar los recursos."
      );
>>>>>>> b57e0d5 (fix: fixing ids and CRUD)
    } finally {
      setLoading(false);
    }
  }, []);

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
    }, [cargar])
  );

  const ejecutarEliminacion = async (resource) => {
<<<<<<< HEAD
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
=======
    if (!hasApiResourceId(resource)) {
      mostrarMensaje(
        "No se puede eliminar",
        "Este recurso no tiene un ID válido de MockAPI. Revisa el registro en MockAPI antes de intentar eliminarlo."
      );
      return;
    }

    const id = String(resource.id);

    try {
      setDeletingId(id);

      await deleteRecurso(id);

      setRecursos((actuales) =>
        actuales.filter(
          (item) => String(item.id) !== id
        )
      );

      mostrarMensaje(
        "Éxito",
        "El recurso se eliminó correctamente."
      );
    } catch (error) {
      console.error(
        "ERROR AL ELIMINAR:",
        error.response?.status,
        error.response?.data || error.message
      );

      mostrarMensaje(
        "Error al eliminar",
        error.response?.status
          ? `MockAPI respondió con el estado ${error.response.status}. Verifica el ID del recurso.`
          : "No se pudo conectar con MockAPI. Revisa tu conexión."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = (resource) => {
    const titulo = resource?.titulo || "este recurso";
    const mensaje = `¿Seguro que deseas eliminar "${titulo}"?`;

    if (Platform.OS === "web") {
      if (window.confirm(mensaje)) {
        ejecutarEliminacion(resource);
      }
      return;
    }

    Alert.alert("Eliminar recurso", mensaje, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => ejecutarEliminacion(resource),
      },
    ]);
  };

  const handleEdit = (resource) => {
    if (!hasApiResourceId(resource)) {
      mostrarMensaje(
        "No se puede editar",
        "Este recurso no tiene un ID válido de MockAPI. Verifica el registro antes de editarlo."
      );
      return;
    }

    navigation.navigate("FormularioRecurso", {
      resource,
    });
  };
>>>>>>> b57e0d5 (fix: fixing ids and CRUD)

  if (loading) {
    return (
      <View style={styles.loading}>
<<<<<<< HEAD
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando recursos...</Text>
=======
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
        <Text style={styles.loadingText}>
          Cargando recursos...
        </Text>
>>>>>>> b57e0d5 (fix: fixing ids and CRUD)
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
<<<<<<< HEAD
        onPress={() => navigation.navigate("FormularioRecurso")}
=======
        onPress={() =>
          navigation.navigate("FormularioRecurso")
        }
>>>>>>> b57e0d5 (fix: fixing ids and CRUD)
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
<<<<<<< HEAD
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
=======
        recursos.map((resource, index) => {
          const tieneId = hasApiResourceId(resource);

          // Los registros con ID usan su ID real.
          // Los registros antiguos sin ID reciben una clave visual
          // alternativa para evitar la clave "undefined".
          const resourceKey = tieneId
            ? `id-${String(resource.id)}`
            : `sin-id-${getResourceKey(resource) || "recurso"}-${index}`;

          const id = tieneId
            ? String(resource.id)
            : null;

          return (
            <View
              key={resourceKey}
              style={styles.resourceContainer}
            >
              <ResourceCard resource={resource} />

              {!tieneId && (
                <Text style={styles.warning}>
                  Este recurso no tiene un ID válido.
                  No se puede editar ni eliminar desde la aplicación.
                </Text>
              )}

              <View style={styles.actions}>
                <Button
                  mode="outlined"
                  icon="pencil"
                  onPress={() => handleEdit(resource)}
                  disabled={
                    deletingId !== null || !tieneId
                  }
                >
                  Editar
                </Button>

                <Button
                  mode="outlined"
                  icon="delete"
                  textColor={COLORS.danger}
                  loading={
                    id !== null && deletingId === id
                  }
                  disabled={
                    deletingId !== null || !tieneId
                  }
                  onPress={() => handleDelete(resource)}
                >
                  {id !== null && deletingId === id
                    ? "Eliminando..."
                    : "Eliminar"}
                </Button>
              </View>
>>>>>>> b57e0d5 (fix: fixing ids and CRUD)
            </View>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  header: { marginBottom: 10 },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.text },
  subtitle: { color: COLORS.textSecondary, marginTop: 4 },
  addButton: { marginVertical: 15 },
  resourceContainer: { marginBottom: 5 },
=======
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
>>>>>>> b57e0d5 (fix: fixing ids and CRUD)
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
    marginBottom: 20,
  },
<<<<<<< HEAD
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: COLORS.textSecondary },
  empty: { padding: 30, alignItems: "center" },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: COLORS.text },
  emptyText: { marginTop: 8, textAlign: "center", color: COLORS.textSecondary },
=======
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
  warning: {
    color: COLORS.danger,
    marginVertical: 8,
    fontSize: 12,
  },
>>>>>>> b57e0d5 (fix: fixing ids and CRUD)
});
