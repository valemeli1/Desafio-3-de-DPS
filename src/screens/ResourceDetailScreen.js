
import React, { useEffect, useState } from "react";

import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Button, Card, Divider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";


import Stars from "../components/Stars";
import Screen from "../components/Screen";
import { COLORS } from "../theme";
import { useAuth } from "../context/AuthContext";

import {
  getRecursos,
  getUsuarios,
  updateRecurso,
} from "../api";

export default function ResourceDetailScreen({ route }) {
  const { resource: initialResource } = route.params;
  const { user } = useAuth();

  const [resource, setResource] = useState(initialResource);
  const [rating, setRating] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    cargarCalificacionPersonal();
  }, [resource.id, user?.id]);

  const mostrarMensaje = (titulo, mensaje) => {
    if (Platform.OS === "web") {
      window.alert(`${titulo}\n\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const cargarCalificacionPersonal = async () => {
    try {
      let usuarioActual = user;

      if (!usuarioActual?.id) {
        const sesion = await AsyncStorage.getItem("usuario_actual");
        if (sesion) {
          usuarioActual = JSON.parse(sesion);
        }
      }

      const recursos = await getRecursos();

      const actual = recursos.find(
        (item) => String(item.id) === String(initialResource.id)
      );

      if (!actual) return;

      const calificaciones = Array.isArray(actual.calificaciones)
        ? actual.calificaciones
        : [];

      const propia = calificaciones.find(
        (item) =>
          String(item.usuarioId) === String(usuarioActual?.id)
      );

      setResource(actual);
      setRating(propia ? Number(propia.rating) : 0);
    } catch (error) {
      console.error(
        "Error cargando calificación:",
        error.response?.status,
        error.response?.data || error.message
      );
    }
  };

  const handleRating = async (value) => {
  if (saving) return;

  setSaving(true);

  const ratingAnterior = rating;

  try {
    // 1. Recuperar la sesión actual.
   
let usuario = user;

// Intentar recuperar la sesión guardada.
if (!usuario?.id && !usuario?.usuarioId && !usuario?._id) {
  const sesionGuardada = await AsyncStorage.getItem(
    "usuario_actual"
  );

  if (sesionGuardada) {
    usuario = JSON.parse(sesionGuardada);
  }
}

// Si la sesión no tiene ID, buscar al usuario por su correo
// en la colección real de usuarios de MockAPI.
let usuarioId =
  usuario?.id ??
  usuario?.usuarioId ??
  usuario?._id;

const correo =
  usuario?.correo ??
  usuario?.email ??
  usuario?.usuario?.correo;

if (
  (usuarioId === undefined ||
    usuarioId === null ||
    String(usuarioId).trim() === "") &&
  correo
) {
  const usuarios = await getUsuarios();

  const usuarioEncontrado = usuarios.find(
    (item) =>
      item.correo?.trim().toLowerCase() ===
      String(correo).trim().toLowerCase()
  );

  if (usuarioEncontrado) {
    usuarioId = usuarioEncontrado.id;
  }
}

if (
  usuarioId === undefined ||
  usuarioId === null ||
  String(usuarioId).trim() === ""
) {
  console.log("Diagnóstico de sesión:", {
  userDelContexto: user
    ? Object.keys(user)
    : null,
  usuarioRecuperado: usuario
    ? Object.keys(usuario)
    : null,
  id: usuario?.id,
  usuarioId: usuario?.usuarioId,
  _id: usuario?._id,
  tieneCorreo: Boolean(usuario?.correo),
  tieneEmail: Boolean(usuario?.email),
});
  throw new Error(
    "No se pudo identificar tu usuario. Revisa la consola para comprobar los datos de sesión."
  );
}

const usuarioIdTexto = String(usuarioId);
    // 3. Obtener el recurso actualizado desde MockAPI.
    const recursos = await getRecursos();

    const recursoActual = recursos.find(
      (recurso) => String(recurso.id) === String(resource.id)
    );

    if (!recursoActual) {
      throw new Error(
        "No se encontró el recurso que deseas calificar."
      );
    }

    const calificaciones = Array.isArray(
      recursoActual.calificaciones
    )
      ? [...recursoActual.calificaciones]
      : [];

    // 4. Actualizar la calificación del usuario
    // o agregarla si todavía no existe.
    const indice = calificaciones.findIndex(
      (calificacion) =>
        String(calificacion.usuarioId) === usuarioIdTexto
    );

    const nuevaCalificacion = {
      usuarioId: usuarioIdTexto,
      rating: Number(value),
      fecha: new Date().toISOString(),
    };

    if (indice >= 0) {
      calificaciones[indice] = nuevaCalificacion;
    } else {
      calificaciones.push(nuevaCalificacion);
    }

    // 5. Guardar los cambios en MockAPI.
    const recursoActualizado = {
      ...recursoActual,
      calificaciones,
      promedio:
        calificaciones.reduce(
          (total, calificacion) =>
            total + Number(calificacion.rating || 0),
          0
        ) / calificaciones.length,
    };

    setRating(Number(value));

    await updateRecurso(
      recursoActual.id,
      recursoActualizado
    );

    setResource(recursoActualizado);

    mostrarMensaje("¡Éxito!", "Tu calificación se guardó correctamente.");
  } catch (error) {
    console.error(
      "Error al calificar:",
      error.response?.data || error.message || error
    );

    setRating(ratingAnterior);

    mostrarMensaje(
      "No se pudo calificar",
      error.message || "Ocurrió un error al guardar tu calificación."
    );
  } finally {
    setSaving(false);
  }
};
  const openLink = async () => {
    if (!resource.enlace) {
      mostrarMensaje("Sin enlace", "Este recurso no tiene un enlace.");
      return;
    }

    try {
      await Linking.openURL(resource.enlace);
    } catch (error) {
      mostrarMensaje("Error", "No se pudo abrir el enlace.");
    }
  };

  const calificaciones = Array.isArray(resource.calificaciones)
    ? resource.calificaciones
    : [];

  const promedio = calificaciones.length > 0
    ? calificaciones.reduce(
        (total, item) => total + Number(item.rating || 0),
        0
      ) / calificaciones.length
    : Number(resource.promedio || 0);

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
            {resource.tipo || "Recurso educativo"}
          </Text>

          <Text style={styles.title}>
            {resource.titulo || "Sin título"}
          </Text>

          <Text style={styles.description}>
            {resource.descripcion || "Sin descripción."}
          </Text>

          <Divider style={styles.divider} />

          <Text style={styles.ratingTitle}>
            Calificación promedio
          </Text>

          <View style={styles.ratingRow}>
            <Stars value={promedio} size={25} />

            <Text style={styles.average}>
              {promedio.toFixed(1)}/5
            </Text>
          </View>

          <Text style={styles.total}>
            {calificaciones.length}{" "}
            {calificaciones.length === 1
              ? "calificación"
              : "calificaciones"}
          </Text>

          <Divider style={styles.divider} />

          <Text style={styles.ratingTitle}>
            Tu calificación
          </Text>

          <Stars
            value={rating}
            onChange={handleRating}
            size={32}
            disabled={saving}
          />

          {saving && (
            <Text style={styles.saving}>
              Guardando calificación...
            </Text>
          )}

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
  total: {
    marginTop: 6,
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  saving: {
    color: COLORS.primary,
    marginTop: 8,
  },
  button: {
    marginTop: 20,
    marginBottom: 5,
  },
});
