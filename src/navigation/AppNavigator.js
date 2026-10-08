import React from "react";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import FavoriteScreen from "../screens/FavoriteScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ResourceDetailScreen from "../screens/ResourceDetailScreen";
import ManageResourcesScreen from "../screens/ManageResourcesScreen";
import ResourceFormScreen from "../screens/ResourceFormScreen";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import { COLORS } from "../theme";
import { useAuth } from "../context/AuthContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: COLORS.primary,

        tabBarInactiveTintColor: COLORS.textSecondary,

        tabBarIcon: ({ color, size }) => {
          let icon = "home-outline";

          if (route.name === "Inicio") {
            icon = "home-outline";
          }

          if (route.name === "Buscar") {
            icon = "search-outline";
          }

          if (route.name === "Favoritos") {
            icon = "heart-outline";
          }

          if (route.name === "Perfil") {
            icon = "person-outline";
          }

          return (
            <Ionicons
              name={icon}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Buscar"
        component={SearchScreen}
      />

      <Tab.Screen
        name="Favoritos"
        component={FavoriteScreen}
      />

      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: "Crear cuenta",
        }}
      />
    </Stack.Navigator>
  );
}

function AppStack() {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="DetalleRecurso"
        component={ResourceDetailScreen}
        options={{
          title: "Detalle",
        }}
      />

      {user?.rol === "Docente" && (
        <>
          <Stack.Screen
            name="GestionarRecursos"
            component={ManageResourcesScreen}
            options={{
              title: "Gestionar recursos",
            }}
          />

          <Stack.Screen
            name="FormularioRecurso"
            component={ResourceFormScreen}
            options={{
              title: "Recurso",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return user ? <AppStack /> : <AuthStack />;
}