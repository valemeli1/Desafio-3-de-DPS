import React, {
  useState,
} from "react";

import {
  Alert,
  StyleSheet,
  Text,
} from "react-native";

import {
  Button,
  Card,
} from "react-native-paper";

import Input from "../components/Input";
import Screen from "../components/Screen";

import {
  createRecurso,
  updateRecurso,
} from "../api";

import {
  validateResource,
} from "../utils/validation";

import { COLORS } from "../theme";

export default function ResourceFormScreen({
  route,
  navigation,
}) {
  const resource =
    route.params?.resource;

  const editing = Boolean(resource);

  const [titulo, setTitulo] =
    useState(resource?.titulo || "");

  const [descripcion, setDescripcion] =
    useState(
      resource?.descripcion || ""
    );

  const [tipo, setTipo] =
    useState(resource?.tipo || "");

  const [enlace, setEnlace] =
    useState(resource?.enlace || "");

  const [imagen, setImagen] =
    useState(resource?.imagen || "");

  const [saving, setSaving] =
    useState(false);

  const handleSave = async () => {
    const errors = validateResource({
      titulo,
      descripcion,
      tipo,
      enlace,
      imagen,
    });

    if (errors.length > 0) {
      Alert.alert(
        "Formulario inválido",
        errors.join("\n")
      );

      return;
    }

    try {
      setSaving(true);

      const data = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        tipo: tipo.trim(),
        enlace: enlace.trim(),
        imagen: imagen.trim(),
        promedio: Number(
          resource?.promedio || 0
        ),
      };

      if (editing) {
        await updateRecurso(
          resource.id,
          data
        );

        Alert.alert(
          "Actualizado",
          "El recurso fue actualizado correctamente."
        );
      } else {
        await createRecurso(data);

        Alert.alert(
          "Creado",
          "El recurso fue creado correctamente."
        );
      }

      navigation.goBack();
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        editing
          ? "No se pudo actualizar el recurso."
          : "No se pudo crear el recurso."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>
            {editing
              ? "Editar recurso"
              : "Nuevo recurso"}
          </Text>

          <Input
            label="Título"
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ej. Programación en Python"
          />

          <Input
            label="Descripción"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
            placeholder="Descripción del recurso"
          />

          <Input
            label="Tipo"
            value={tipo}
            onChangeText={setTipo}
            placeholder="Libro, video, artículo..."
          />

          <Input
            label="Enlace"
            value={enlace}
            onChangeText={setEnlace}
            autoCapitalize="none"
            keyboardType="url"
            placeholder="https://..."
          />

          <Input
            label="URL de imagen"
            value={imagen}
            onChangeText={setImagen}
            autoCapitalize="none"
            keyboardType="url"
            placeholder="https://..."
          />

          <Button
            mode="contained"
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            style={styles.button}
          >
            {editing
              ? "Guardar cambios"
              : "Crear recurso"}
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

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 20,
  },

  button: {
    marginTop: 10,
  },
});