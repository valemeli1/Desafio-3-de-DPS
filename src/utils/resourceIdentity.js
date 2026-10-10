// Identidad estable para cada recurso. MockAPI necesita "id" para editar/eliminar,
// pero los favoritos también pueden identificar registros antiguos sin ese campo.
export const getResourceKey = (resource) => {
  if (!resource || typeof resource !== "object") return null;

  const id = resource.id;
  if (
    id !== undefined &&
    id !== null &&
    String(id).trim() !== "" &&
    String(id) !== "undefined" &&
    String(id) !== "null"
  ) {
    return String(id);
  }

  const title = String(resource.titulo || "").trim().toLowerCase();
  const type = String(resource.tipo || "").trim().toLowerCase();
  const link = String(resource.enlace || "").trim().toLowerCase();

  if (!title && !link) return null;
  return `legacy:${title}|${type}|${link}`;
};

export const hasApiResourceId = (resource) =>
  resource?.id !== undefined &&
  resource?.id !== null &&
  String(resource.id).trim() !== "" &&
  String(resource.id) !== "undefined" &&
  String(resource.id) !== "null";

export const cleanFavoriteKeys = (values) =>
  (Array.isArray(values) ? values : [])
    .map(String)
    .filter((value) => value && value !== "undefined" && value !== "null");
