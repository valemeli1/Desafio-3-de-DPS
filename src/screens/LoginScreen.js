import React, { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Button,
  Card,
} from "react-native-paper";

import Input from "../components/Input";
import Screen from "../components/Screen";

import { COLORS } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({
  navigation,
}) {
  const { login } = useAuth();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert(
        "Campos incompletos",
        "Ingresa tu correo y contraseña."
      );

      return;
    }

    setLoading(true);

    const result = await login(
      correo,
      password
    );

    setLoading(false);

    if (!result.success) {
      Alert.alert(
        "Error",
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
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>
            RI
          </Text>

          <Text style={styles.title}>
            Recursos Ingeniería
          </Text>

          <Text style={styles.subtitle}>
            Biblioteca digital de aprendizaje
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.heading}>
              Iniciar sesión
            </Text>

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
              placeholder="************"
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Ingresar
            </Button>

            <Button
              mode="text"
              onPress={() =>
                navigation.navigate(
                  "Register"
                )
              }
            >
              Crear una cuenta
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

  logoContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 30,
  },

  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 30,
    fontWeight: "800",
    overflow: "hidden",
    paddingTop: 20,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 16,
  },

  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: "center",
  },

  card: {
    backgroundColor: COLORS.surface,
  },

  heading: {
    fontSize: 21,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 20,
  },

  button: {
    marginTop: 4,
    marginBottom: 8,
  },
});