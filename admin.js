'use strict';
const session = Auth.guard(['admin']);
if (session) {
  document.getElementById('whoami').textContent = `${session.name} · Administrador`;
  document.getElementById('logoutBtn').addEventListener('click', Auth.logout);

  document.getElementById('statCourses').textContent = coursesData.length;
  document.getElementById('statUsers').textContent = DEMO_USERS.length;
  document.getElementById('statLessons').textContent = coursesData.reduce((n, c) => n + c.lessons.length, 0);

  const cBody = document.querySelector('#coursesTable tbody');
  coursesData.forEach(c => {
    cBody.innerHTML += `<tr><td>${c.title}</td><td>${c.category}</td><td>${c.level}</td><td>${c.instructor}</td><td>${c.lessons.length}</td></tr>`;
  });

  const uBody = document.querySelector('#usersTable tbody');
  DEMO_USERS.forEach(u => {
    uBody.innerHTML += `<tr><td>${u.name}</td><td>${u.email}</td><td>${ROLE_LABEL[u.role]}</td></tr>`;
  });
}
