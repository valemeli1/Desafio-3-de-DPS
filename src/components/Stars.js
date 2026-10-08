import React from "react";

import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../theme";

export default function Stars({
  value = 0,
  onChange,
  size = 24,
}) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => onChange && onChange(star)}
          disabled={!onChange}
        >
          <Ionicons
            name={
              star <= value
                ? "star"
                : "star-outline"
            }
            size={size}
            color={COLORS.star}
            style={styles.star}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  star: {
    marginRight: 3,
  },
});