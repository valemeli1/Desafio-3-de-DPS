
import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Stars({
  value = 0,
  onChange,
  size = 24,
  disabled = false,
}) {
  const seleccionarEstrella = (numero) => {
    if (disabled || typeof onChange !== "function") {
      return;
    }

    console.log("Estrella seleccionada:", numero);
    onChange(numero);
  };

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((numero) => {
        const seleccionada = numero <= Number(value || 0);

        return (
          <Pressable
            key={numero}
            onPress={() => seleccionarEstrella(numero)}
            disabled={disabled || typeof onChange !== "function"}
            hitSlop={8}
            style={({ pressed }) => [
              styles.starButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Calificar con ${numero} estrellas`}
          >
            <Ionicons
              name={seleccionada ? "star" : "star-outline"}
              size={size}
              color={seleccionada ? "#FBBF24" : "#9CA3AF"}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  starButton: {
    padding: 5,
  },
  pressed: {
    opacity: 0.5,
  },
});
