import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  createUsuario,
  getUsuarios,
} from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("usuario_actual");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.log("Error cargando sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (correo, password) => {
    try {
      const usuarios = await getUsuarios();

      const usuarioEncontrado = usuarios.find(
        (item) =>
          item.correo?.toLowerCase() === correo.trim().toLowerCase() &&
          item.password === password
      );

      if (!usuarioEncontrado) {
        return {
          success: false,
          message: "Correo o contraseña incorrectos.",
        };
      }

      await AsyncStorage.setItem(
        "usuario_actual",
        JSON.stringify(usuarioEncontrado)
      );

      setUser(usuarioEncontrado);

      return {
        success: true,
        user: usuarioEncontrado,
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        message:
          "No se pudo conectar con el servidor. Verifica tu API.",
      };
    }
  };

  const register = async (data) => {
    try {
      const usuarios = await getUsuarios();

      const existe = usuarios.some(
        (item) =>
          item.correo?.toLowerCase() === data.correo.trim().toLowerCase()
      );

      if (existe) {
        return {
          success: false,
          message: "Ya existe un usuario con ese correo.",
        };
      }

      const nuevoUsuario = await createUsuario({
        nombre: data.nombre,
        correo: data.correo.trim().toLowerCase(),
        password: data.password,
        rol: data.rol,
        favoritos: [],
      });

      await AsyncStorage.setItem(
        "usuario_actual",
        JSON.stringify(nuevoUsuario)
      );

      setUser(nuevoUsuario);

      return {
        success: true,
        user: nuevoUsuario,
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        message: "No se pudo registrar el usuario.",
      };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("usuario_actual");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};