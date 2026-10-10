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

  // Recuperar la sesión guardada al abrir la aplicación.
  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(
        "usuario_actual"
      );

      if (savedUser) {
        const usuarioGuardado = JSON.parse(savedUser);

        setUser(usuarioGuardado);

        console.log("Sesión recuperada:", {
          campos: Object.keys(usuarioGuardado || {}),
          id: usuarioGuardado?.id,
          usuarioId: usuarioGuardado?.usuarioId,
          tieneCorreo: Boolean(usuarioGuardado?.correo),
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Error cargando sesión:",
        error.message
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Iniciar sesión.
  const login = async (correo, password) => {
    try {
      const usuarios = await getUsuarios();

      const usuarioEncontrado = usuarios.find(
        (item) =>
          item.correo?.trim().toLowerCase() ===
            correo.trim().toLowerCase() &&
          item.password === password
      );

      if (!usuarioEncontrado) {
        return {
          success: false,
          message: "Correo o contraseña incorrectos.",
        };
      }

      // Diagnóstico sin imprimir correo ni contraseña.
      console.log("Usuario encontrado al iniciar sesión:", {
        campos: Object.keys(usuarioEncontrado),
        id: usuarioEncontrado.id,
        usuarioId: usuarioEncontrado.usuarioId,
        tieneCorreo: Boolean(usuarioEncontrado.correo),
      });

      // Guardar el usuario completo de MockAPI.
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
      console.error(
        "Error al iniciar sesión:",
        error.message
      );

      return {
        success: false,
        message:
          "No se pudo conectar con el servidor. Verifica tu API.",
      };
    }
  };

  // Registrar usuario.
  const register = async (data) => {
    try {
      const usuarios = await getUsuarios();

      const correoNormalizado = data.correo
        .trim()
        .toLowerCase();

      const existe = usuarios.some(
        (item) =>
          item.correo?.trim().toLowerCase() ===
          correoNormalizado
      );

      if (existe) {
        return {
          success: false,
          message: "Ya existe un usuario con ese correo.",
        };
      }

      const nuevoUsuario = await createUsuario({
        nombre: data.nombre,
        correo: correoNormalizado,
        password: data.password,
        rol: data.rol,
        favoritos: [],
      });

      console.log("Usuario registrado:", {
        campos: Object.keys(nuevoUsuario || {}),
        id: nuevoUsuario?.id,
        usuarioId: nuevoUsuario?.usuarioId,
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
      console.error(
        "Error al registrar usuario:",
        error.response?.data || error.message
      );

      return {
        success: false,
        message: "No se pudo registrar el usuario.",
      };
    }
  };

  // Cerrar sesión.
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("usuario_actual");
      setUser(null);
    } catch (error) {
      console.error(
        "Error al cerrar sesión:",
        error.message
      );
    }
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