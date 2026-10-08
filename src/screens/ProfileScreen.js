import React from "react";

import {
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Button,
  Card,
  Divider,
} from "react-native-paper";

import Screen from "../components/Screen";

import { COLORS } from "../theme";

import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({
  navigation,
}) {
  const { user, logout } =
    useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Quieres cerrar tu sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  return (
    <Screen>
      <Text style={styles.title}>
        Mi perfil
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.nombre
                ?.charAt(0)
                ?.toUpperCase() || "U"}
            </Text>
          </View>

          <Text style={styles.name}>
            {user?.nombre}
          </Text>

          <Text style={styles.email}>
            {user?.correo}
          </Text>

          <View style={styles.role}>
            <Text style={styles.roleText}>
              {user?.rol}
            </Text>
          </View>

          <Divider style={styles.divider} />

          {user?.rol === "Docente" && (
            <Button
              mode="contained"
              icon="book-edit"
              onPress={() =>
                navigation.navigate(
                  "GestionarRecursos"
                )
              }
              style={styles.button}
            >
              Gestionar recursos
            </Button>
          )}

          <Button
  mode="contained"
  onPress={logout}
>
  Cerrar sesión
</Button>
        </Card.Content>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 20,
  },

  card: {
    backgroundColor: COLORS.surface,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "800",
  },

  name: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 15,
  },

  email: {
    textAlign: "center",
    color: COLORS.textSecondary,
    marginTop: 5,
  },

  role: {
    alignSelf: "center",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },

  roleText: {
    color: COLORS.primary,
    fontWeight: "700",
  },

  divider: {
    marginVertical: 20,
  },

  button: {
    marginBottom: 12,
  },
});