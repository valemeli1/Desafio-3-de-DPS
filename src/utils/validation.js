export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
};

export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 12) {
    errors.push("Debe tener mínimo 12 caracteres.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Debe contener una letra mayúscula.");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Debe contener una letra minúscula.");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Debe contener un número.");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Debe contener un carácter especial.");
  }

  return errors;
};

export const validateResource = (resource) => {
  const errors = [];

  if (!resource.titulo.trim()) {
    errors.push("El título es obligatorio.");
  }

  if (!resource.descripcion.trim()) {
    errors.push("La descripción es obligatoria.");
  }

  if (!resource.tipo.trim()) {
    errors.push("El tipo es obligatorio.");
  }

  if (!resource.enlace.trim()) {
    errors.push("El enlace es obligatorio.");
  }

  if (!resource.imagen.trim()) {
    errors.push("La imagen es obligatoria.");
  }

  return errors;
};