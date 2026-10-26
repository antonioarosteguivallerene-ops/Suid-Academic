'use strict';
let selectedRole = 'estudiante';

document.querySelectorAll('.role-tab').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.role-tab').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  selectedRole = btn.dataset.role;
}));

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const session = Auth.login(email, password, selectedRole);
  const err = document.getElementById('loginError');
  if (!session) { err.classList.remove('hidden'); return; }
  err.classList.add('hidden');
  location.href = ROLE_HOME[selectedRole];
});

const existing = Auth.current();
if (existing) location.href = ROLE_HOME[existing.role];
