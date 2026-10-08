import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { COLORS } from "../theme";

export default function Screen({
  children,
  scroll = true,
  style,
}) {
  if (scroll) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={[styles.container, style]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.container, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    padding: 16,
    flexGrow: 1,
  },
});