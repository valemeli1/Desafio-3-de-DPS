import React, { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
} from "react-native";

import {
  Button,
  Card,
  SegmentedButtons,
} from "react-native-paper";

import Input from "../components/Input";
import Screen from "../components/Screen";

import { COLORS } from "../theme";

import {
  validateEmail,
  validatePassword,
} from "../utils/validation";

import { useAuth } from "../context/AuthContext";

export default function RegisterScreen({
  navigation,
}) {
  const { register } = useAuth();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("Estudiante");

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre.trim()) {
      Alert.alert(
        "Error",
        "Ingresa tu nombre."
      );
      return;
    }

    if (!validateEmail(correo)) {
      Alert.alert(
        "Correo inválido",
        "Ingresa un correo electrónico válido."
      );
      return;
    }

    const passwordErrors =
      validatePassword(password);

    if (passwordErrors.length > 0) {
      Alert.alert(
        "Contraseña inválida",
        passwordErrors.join("\n")
      );
      return;
    }

    setLoading(true);

    const result = await register({
      nombre,
      correo,
      password,
      rol,
    });

    setLoading(false);

    if (!result.success) {
      Alert.alert(
        "No se pudo registrar",
        result.message
      );

      return;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <Screen>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>
              Crear cuenta
            </Text>

            <Text style={styles.subtitle}>
              Regístrate para utilizar Recursos
              Ingeniería.
            </Text>

            <Input
              label="Nombre completo"
              value={nombre}
              onChangeText={setNombre}
              placeholder="Tu nombre"
            />

            <Input
              label="Correo electrónico"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="correo@ejemplo.com"
            />

            <Input
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Mínimo 12 caracteres"
            />

            <Text style={styles.roleLabel}>
              Tipo de usuario
            </Text>

            <SegmentedButtons
              value={rol}
              onValueChange={setRol}
              buttons={[
                {
                  value: "Estudiante",
                  label: "Estudiante",
                },
                {
                  value: "Docente",
                  label: "Docente",
                },
              ]}
              style={styles.roles}
            />

            <Text style={styles.rules}>
              La contraseña debe tener mínimo 12
              caracteres, mayúscula, minúscula,
              número y carácter especial.
            </Text>

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Registrarme
            </Button>

            <Button
              mode="text"
              onPress={() =>
                navigation.goBack()
              }
            >
              Ya tengo una cuenta
            </Button>
          </Card.Content>
        </Card>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },

  card: {
    backgroundColor: COLORS.surface,
    marginTop: 20,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 5,
    marginBottom: 22,
  },

  roleLabel: {
    fontWeight: "600",
    marginBottom: 7,
    color: COLORS.text,
  },

  roles: {
    marginBottom: 10,
  },

  rules: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 15,
  },

  button: {
    marginTop: 5,
  },
});