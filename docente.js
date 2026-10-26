'use strict';
const session = Auth.guard(['docente']);
if (session) {
  document.getElementById('whoami').textContent = `${session.name} · Docente`;
  document.getElementById('logoutBtn').addEventListener('click', Auth.logout);

  const mine = coursesData.filter(c => c.instructor === session.name);
  const list = mine.length ? mine : coursesData; // si el nombre no coincide, muestra todos como ejemplo
  const body = document.querySelector('#myCoursesTable tbody');
  list.forEach(c => {
    const fake = 8 + Math.floor(Math.random() * 40);
    const avg = 20 + Math.floor(Math.random() * 60);
    body.innerHTML += `<tr><td>${c.title}</td><td>${c.level}</td><td>${c.lessons.length}</td><td>${fake}</td><td>${avg}%</td></tr>`;
  });
}
