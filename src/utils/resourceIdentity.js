
export const getResourceKey = (resource) => {
  if (!resource || typeof resource !== "object") {
    return null;
  }

  // Si el recurso tiene un ID de MockAPI, lo usamos como identificador.
  if (
    resource.id !== undefined &&
    resource.id !== null &&
    String(resource.id).trim() !== "" &&
    String(resource.id) !== "undefined" &&
    String(resource.id) !== "null"
  ) {
    return String(resource.id);
  }

  // Si no tiene ID, generamos una clave usando sus datos.
  const titulo = String(
    resource.titulo || resource.title || ""
  )
    .trim()
    .toLowerCase();

  const tipo = String(
    resource.tipo || resource.type || ""
  )
    .trim()
    .toLowerCase();

  const enlace = String(
    resource.enlace || resource.link || ""
  )
    .trim()
    .toLowerCase();

  if (!titulo && !enlace) {
    return null;
  }

  return `legacy:${titulo}|${tipo}|${enlace}`;
};

export const hasApiResourceId = (resource) => {
  return (
    resource !== null &&
    typeof resource === "object" &&
    resource.id !== undefined &&
    resource.id !== null &&
    String(resource.id).trim() !== "" &&
    String(resource.id) !== "undefined" &&
    String(resource.id) !== "null"
  );
};

export const cleanFavoriteKeys = (values) => {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .filter(
      (value) =>
        value !== undefined &&
        value !== null &&
        String(value).trim() !== "" &&
        String(value) !== "undefined" &&
        String(value) !== "null"
    )
    .map(String);
};

