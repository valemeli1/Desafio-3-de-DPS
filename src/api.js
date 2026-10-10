
import axios from "axios";

const BASE_URL =
  "https://6ac6f032bea0e72cf5c94f44.mockapi.io/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Comprueba que el recurso tenga un ID real de MockAPI.
const validarId = (id) => {
  if (
    id === undefined ||
    id === null ||
    String(id).trim() === "" ||
    String(id) === "undefined" ||
    String(id) === "null"
  ) {
    throw new Error(
      "El recurso no tiene un ID válido de MockAPI."
    );
  }

  return String(id);
};

// ==================== RECURSOS ====================

export const getRecursos = async () => {
  const response = await api.get("/recursos");
  return response.data;
};

export const getRecurso = async (id) => {
  const idValido = validarId(id);
  const response = await api.get(`/recursos/${idValido}`);
  return response.data;
};

export const createRecurso = async (recurso) => {
  const response = await api.post("/recursos", recurso);
  return response.data;
};

export const updateRecurso = async (id, recurso) => {
  const idValido = validarId(id);
  const response = await api.put(
    `/recursos/${idValido}`,
    recurso
  );
  return response.data;
};

export const deleteRecurso = async (id) => {
  const idValido = validarId(id);
  const response = await api.delete(
    `/recursos/${idValido}`
  );
  return response.data;
};

// ==================== USUARIOS ====================

export const getUsuarios = async () => {
  const response = await api.get("/usuarios");
  return response.data;
};

export const getUsuario = async (id) => {
  const idValido = validarId(id);
  const response = await api.get(`/usuarios/${idValido}`);
  return response.data;
};

export const createUsuario = async (usuario) => {
  const response = await api.post("/usuarios", usuario);
  return response.data;
};

// ==================== CALIFICACIONES ====================

export const getCalificaciones = async () => {
  const response = await api.get("/calificaciones");
  return response.data;
};

export const getCalificacion = async (id) => {
  const idValido = validarId(id);
  const response = await api.get(
    `/calificaciones/${idValido}`
  );
  return response.data;
};

export const createCalificacion = async (calificacion) => {
  const response = await api.post(
    "/calificaciones",
    calificacion
  );
  return response.data;
};

export const updateCalificacion = async (
  id,
  calificacion
) => {
  const idValido = validarId(id);
  const response = await api.put(
    `/calificaciones/${idValido}`,
    calificacion
  );
  return response.data;
};

export const deleteCalificacion = async (id) => {
  const idValido = validarId(id);
  const response = await api.delete(
    `/calificaciones/${idValido}`
  );
  return response.data;
};

export default api;
