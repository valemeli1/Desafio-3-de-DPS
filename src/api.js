import axios from "axios";

// ======================================================
// URL DE MOCKAPI
// ======================================================

const BASE_URL =
  "https://6ac6f032bea0e72cf5c94f44.mockapi.io/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ======================================================
// RECURSOS
// ======================================================

export const getRecursos = async () => {
  const response = await api.get("/recursos");
  return response.data;
};

export const getRecurso = async (id) => {
  const response = await api.get(`/recursos/${id}`);
  return response.data;
};

export const createRecurso = async (recurso) => {
  const response = await api.post("/recursos", recurso);
  return response.data;
};

export const updateRecurso = async (id, recurso) => {
  const response = await api.put(`/recursos/${id}`, recurso);
  return response.data;
};

export const deleteRecurso = async (id) => {
  console.log("DELETE INICIADO");
  console.log("ID:", id);
  console.log("URL:", `${BASE_URL}/recursos/${id}`);

  try {
    const response = await api.delete(`/recursos/${id}`);

    console.log("DELETE STATUS:", response.status);
    console.log("DELETE DATA:", response.data);

    return response.data;
  } catch (error) {
    console.log("DELETE ERROR:", error.message);
    console.log("DELETE ERROR RESPONSE:", error.response?.data);
    console.log("DELETE ERROR STATUS:", error.response?.status);
    console.log("DELETE ERROR URL:", error.config?.url);

    throw error;
  }
};

// ======================================================
// USUARIOS
// ======================================================

export const getUsuarios = async () => {
  const response = await api.get("/usuarios");
  return response.data;
};

export const getUsuario = async (id) => {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
};

export const createUsuario = async (usuario) => {
  const response = await api.post("/usuarios", usuario);
  return response.data;
};

// ======================================================
// CALIFICACIONES
// ======================================================

export const getCalificaciones = async () => {
  const response = await api.get("/calificaciones");
  return response.data;
};

export const getCalificacion = async (id) => {
  const response = await api.get(`/calificaciones/${id}`);
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
  const response = await api.put(
    `/calificaciones/${id}`,
    calificacion
  );

  return response.data;
};

export const deleteCalificacion = async (id) => {
  const response = await api.delete(
    `/calificaciones/${id}`
  );

  return response.data;
};

export default api;