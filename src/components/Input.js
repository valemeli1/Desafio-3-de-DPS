import React from "react";

import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { COLORS } from "../theme";

export default function Input({
  label,
  error,
  ...props
}) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
        ]}
        placeholderTextColor={COLORS.textSecondary}
        {...props}
      />

      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
  },

  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },

  inputError: {
    borderColor: COLORS.danger,
  },

  error: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
  },
});