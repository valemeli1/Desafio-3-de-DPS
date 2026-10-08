import React from "react";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  Provider as PaperProvider,
} from "react-native-paper";

import {
  ActivityIndicator,
  View,
} from "react-native";

import AuthNavigator from "./src/navigation/AuthNavigator";
import AppNavigator from "./src/navigation/AppNavigator";

import {
  AuthProvider,
  useAuth,
} from "./src/context/AuthContext";

import { COLORS } from "./src/theme";

function Navigation() {
  const {
    user,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:
            COLORS.background,
        }}
      >
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <AppNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </PaperProvider>
  );
}