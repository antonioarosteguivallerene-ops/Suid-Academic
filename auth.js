'use strict';
/*
 * ADVERTENCIA: esto es una simulación de inicio de sesión para fines de maquetación.
 * No hay servidor, no hay contraseñas cifradas y cualquiera que abra las herramientas
 * de desarrollador puede leer o falsificar la sesión. NO uses este archivo en producción.
 * Para un login real necesitas un backend (p. ej. Node/Express o similar) que:
 *   1) guarde contraseñas con hash (bcrypt/argon2),
 *   2) emita una sesión o JWT firmado por el servidor,
 *   3) verifique el rol en cada petición protegida (nunca solo en el navegador).
 */

const DEMO_USERS = [
  { email: 'admin@suid.academy',     password: 'admin123',      role: 'admin',      name: 'Administrador Suid' },
  { email: 'docente@suid.academy',   password: 'docente123',    role: 'docente',    name: 'Ing. Carlos Mendoza' },
  { email: 'estudiante@suid.academy',password: 'estudiante123', role: 'estudiante', name: 'Estudiante Demo' }
];

const ROLE_LABEL = { admin: 'Administrador', docente: 'Docente', estudiante: 'Estudiante' };
const ROLE_HOME  = { admin: 'admin.html', docente: 'docente.html', estudiante: 'index.html' };

const Auth = {
  login(email, password, role) {
    const user = DEMO_USERS.find(u => u.email === email.trim().toLowerCase() && u.password === password && u.role === role);
    if (!user) return null;
    const session = { email: user.email, role: user.role, name: user.name, loginAt: Date.now() };
    sessionStorage.setItem('suid_session', JSON.stringify(session));
    return session;
  },
  current() {
    try { return JSON.parse(sessionStorage.getItem('suid_session')); } catch { return null; }
  },
  logout() {
    sessionStorage.removeItem('suid_session');
    location.href = 'login.html';
  },
  /** Exige sesión y, si se indica, una lista de roles permitidos; si no cumple, redirige. */
  guard(allowedRoles) {
    const s = Auth.current();
    if (!s) { location.href = 'login.html'; return null; }
    if (allowedRoles && !allowedRoles.includes(s.role)) { location.href = ROLE_HOME[s.role] || 'index.html'; return null; }
    return s;
  }
};
