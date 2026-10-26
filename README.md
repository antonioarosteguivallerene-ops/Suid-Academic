# Suid Academy

Plataforma de cursos de ciberseguridad defensiva. Front-end estático (HTML, CSS y JS puro) con una
capa de demostración para login por roles, laboratorios simulados y un asistente IA simulado.

## Ejecutar
1. Abre la carpeta en VS Code e instala la extensión **Live Server**.
2. Clic derecho en `login.html` → *Open with Live Server*.
3. Entra con una de las cuentas de prueba (se muestran en la pantalla de login).

## Estructura
- `login.html` / `auth.js`: inicio de sesión por rol (demo, sin backend)
- `index.html`: catálogo de cursos, aula virtual, pestañas Clase/Laboratorio/Asistente IA, certificado
- `admin.html`: panel de administrador (listado de cursos y usuarios)
- `docente.html`: panel de docente (cursos asignados y progreso simulado)
- `legal.html`: descargo de hacking ético, términos, privacidad y derechos del consumidor
- `courses-data.js`: datos de cursos, laboratorios simulados y FAQ del asistente IA
- `styles.css` / `app.js`: estilos (paleta inspirada en Blade Runner 2049) y lógica

## Importante: qué es real y qué es una demo

**Login por roles — demo, no seguro.** `auth.js` guarda la sesión en `sessionStorage` del navegador,
sin servidor ni contraseñas cifradas. Cualquiera puede leerla o falsificarla desde las herramientas de
desarrollador. Para un login real necesitas backend con hash de contraseñas (bcrypt/argon2), sesiones o
JWT firmados por el servidor, y verificación del rol en cada petición protegida — nunca solo en el navegador.

**Laboratorios — terminal simulada, no máquinas virtuales reales.** El botón "Iniciar laboratorio" muestra
una consola falsa con comandos y respuestas predefinidos (ver `labsData` en `courses-data.js`); no se
ejecuta nada. Dar VMs de ataque reales a cada estudiante exige infraestructura real: un hipervisor o
contenedores aislados por estudiante, red sin salida a internet, límites de tiempo y recursos,
autenticación, registro de auditoría y controles contra abuso. Eso requiere un proveedor de
infraestructura (nube propia, o servicios ya hechos para esto como Hack The Box / TryHackMe /
plataformas de cyber range) y no se puede construir dentro de un sitio estático.

**Asistente IA — respuestas predefinidas, no un modelo real.** El chat de cada curso busca palabras clave
en una lista fija (`faqData` en `courses-data.js`). Para un asistente real por curso:
1. Crea un backend (Node/Express, etc.) que guarde la clave de la API del modelo **solo en el servidor**
   (nunca en archivos JS que viaja al navegador).
2. El backend recibe la pregunta del estudiante, arma un `system prompt` con el temario de ese curso y
   llama a la API del modelo (ver el comentario con un ejemplo en `courses-data.js`).
3. El front-end solo llama a tu backend (p. ej. `fetch('/api/chat', {...})`), nunca a la API del modelo
   directamente.

## Pendientes antes de publicar
- [ ] Construir el backend real de autenticación, laboratorios y asistente IA descrito arriba.
- [ ] Reemplazar `VIDEO` en `courses-data.js` por las URLs reales (usa `youtube-nocookie.com`).
- [ ] Completar los datos entre corchetes de `legal.html` y la razón social/RUC del footer de `index.html`.
- [ ] Revisión legal por un abogado nicaragüense (Leyes 842, 787 y 1042 con sus reformas).
- [ ] Servir todo por **HTTPS** y añadir cabeceras de seguridad en el servidor (HSTS, X-Content-Type-Options).
- [ ] Los certificados se generan en el navegador: para validez real, emitirlos y registrarlos en el backend.
- [ ] Añadir SRI a los scripts de CDN o alojarlos localmente.
