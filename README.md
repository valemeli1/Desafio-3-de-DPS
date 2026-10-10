
#  RecursosIngenieria

Aplicación móvil desarrollada con React Native y Expo para la gestión y consulta de recursos educativos relacionados con la ingeniería y la tecnología. Permite a estudiantes y docentes explorar materiales de aprendizaje, guardar favoritos y calificar recursos.

Link del video: https://drive.google.com/file/d/1ambjwjfY8IYZ4NFsY4OwEOiBS55TAu_Q/view?usp=sharing 

##  Objetivo del proyecto

Facilitar el acceso a recursos educativos mediante una aplicación intuitiva, moderna y adaptable a diferentes dispositivos, promoviendo el aprendizaje y el intercambio de materiales académicos.

##  Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| React Native | Desarrollo de la interfaz móvil |
| Expo | Ejecución y desarrollo de la aplicación |
| JavaScript | Lógica de la aplicación |
| React Native Paper | Componentes de interfaz |
| React Navigation | Navegación entre pantallas |
| Axios | Solicitudes HTTP a la API |
| MockAPI | Almacenamiento y gestión de datos de prueba |
| Git y GitHub | Control de versiones y alojamiento del código |

##  Estructura del proyecto

```text
RecursosIngenieria/
├── App.js
├── package.json
├── README.md
└── src/
    ├── api.js
    ├── components/
    ├── context/
    ├── navigation/
    ├── screens/
    └── theme.js
```

> La estructura puede variar según las actualizaciones realizadas durante el desarrollo.

##  Requisitos previos

Antes de ejecutar el proyecto, instala:

- Node.js y npm.
- Expo CLI mediante las herramientas incluidas en Expo.
- Git.
- Expo Go para probar la aplicación en un dispositivo compatible, o un navegador si el proyecto tiene habilitada la plataforma web.

##  Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/valemeli1/Desafio-3-de-DPS.git
```

### 2. Entrar en la carpeta del proyecto

```bash
cd Desafio-3-de-DPS
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Iniciar la aplicación

```bash
npx expo start
```

Sigue las instrucciones que aparecen en la terminal para abrir la aplicación en Expo Go o en una plataforma compatible.

Para iniciar la versión web, si está configurada en el proyecto:

```bash
npx expo start --web
```

##  Configuración de la API

La aplicación utiliza MockAPI para administrar los datos de prueba.

Colecciones utilizadas:

- `usuarios`: información de usuarios, credenciales, roles y favoritos.
- `recursos`: información de los materiales educativos.

La configuración de las solicitudes HTTP se encuentra en `src/api.js`.

**Importante:** configura la URL de tu propia API si es necesario y evita publicar contraseñas reales, tokens o información privada. Las credenciales de prueba no deben utilizarse en un entorno de producción.

##  Roles de usuario

### Estudiante

- Consultar recursos educativos.
- Buscar materiales.
- Guardar y administrar favoritos.
- Calificar recursos.
- Consultar su perfil.

### Docente

- Consultar recursos educativos.
- Utilizar las funciones disponibles para su rol.
- Administrar recursos cuando tenga los permisos correspondientes.
- Calificar recursos, si la función está habilitada.

##  Diseño de interfaz

La aplicación utiliza una interfaz oscura con tonos morados, tarjetas de recursos, iconografía y componentes reutilizables. El objetivo es mantener una experiencia clara y consistente durante la navegación.

##  Pruebas recomendadas

Antes de entregar el proyecto, verifica:

- El registro y el inicio de sesión.
- La carga de recursos desde MockAPI.
- La búsqueda y apertura del detalle de cada recurso.
- La creación y eliminación de favoritos.
- El guardado y la visualización de calificaciones.
- Los permisos correspondientes a cada rol.
- La respuesta de la aplicación ante errores de conexión.

##  Control de versiones

El proyecto utiliza Git para registrar los cambios durante el desarrollo y GitHub para alojar el repositorio.

Para consultar el historial de commits:

```bash
git log --oneline
```

