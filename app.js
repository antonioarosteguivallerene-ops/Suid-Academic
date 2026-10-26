'use strict';
// coursesData, labsData y faqData vienen de courses-data.js (cárgalo antes que este archivo)

const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
let activeCourse = null, currentLessonIndex = 0;
let completedLessons = store.get('suid_completed', {});
let session = null;

const $ = id => document.getElementById(id);
const coursesGrid = $('coursesGrid'), searchInput = $('searchInput'), levelFilter = $('levelFilter');
const catButtons = document.querySelectorAll('.cat-btn');
const courseModal = $('courseModal'), certModal = $('certModal');
const catNames = { hacking: 'Hacking ético', pentesting: 'Pentesting', programacion: 'Programación', devsecops: 'DevSecOps' };

function renderCourses(courses) {
  coursesGrid.replaceChildren();
  if (!courses.length) {
    coursesGrid.innerHTML = '<p class="empty">No encontramos cursos con esos filtros. Prueba otra búsqueda.</p>';
    return;
  }
  courses.forEach(c => {
    const card = document.createElement('article');
    card.className = 'course-card';
    card.innerHTML = `
      <img class="card-banner" src="${c.banner}" alt="${c.bannerAlt}" loading="lazy">
      <div class="card-body">
        <div class="card-meta"><span>${catNames[c.category]}</span><span class="level lv-${c.level}">${c.level}</span></div>
        <h3>${c.title}</h3>
        <p class="card-instructor">${c.instructor}</p>
        <div class="card-footer">
          <span class="lessons-count">${c.lessons.length} lecciones</span>
          <button class="btn-open-course" data-course="${c.id}">Comenzar curso</button>
        </div>
      </div>`;
    coursesGrid.appendChild(card);
  });
}

function filterCourses() {
  const q = searchInput.value.toLowerCase().trim();
  const lvl = levelFilter.value;
  const cat = document.querySelector('.cat-btn.active').dataset.cat;
  renderCourses(coursesData.filter(c =>
    (c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q)) &&
    (lvl === 'all' || c.level === lvl) && (cat === 'all' || c.category === cat)));
}

function openCourse(id) {
  activeCourse = coursesData.find(c => c.id === id);
  $('modalCourseTitle').textContent = activeCourse.title;
  $('instructorName').textContent = activeCourse.instructor;
  renderLessonsList();
  loadLesson(0);
  updateProgress();
  switchTab('clase');
  resetLab();
  resetChat();
  courseModal.classList.remove('hidden');
  $('closeModal').focus();
}

function closeCourse() {
  courseModal.classList.add('hidden');
  $('videoPlayer').src = '';
}

const isDone = (cid, lid) => (completedLessons[cid] || []).includes(lid);

function loadLesson(i) {
  currentLessonIndex = i;
  const l = activeCourse.lessons[i];
  $('videoPlayer').src = l.videoUrl;
  $('currentLessonTitle').textContent = l.title;
  $('lessonDescription').textContent = l.description;
  document.querySelectorAll('.lesson-item').forEach((el, idx) => el.classList.toggle('active', idx === i));
  const btn = $('markCompleteBtn'), done = isDone(activeCourse.id, l.id);
  btn.classList.toggle('done', done);
  btn.textContent = done ? 'Lección completada' : 'Marcar como completada';
}

function renderLessonsList() {
  const list = $('lessonsList');
  list.replaceChildren();
  activeCourse.lessons.forEach((l, idx) => {
    const done = isDone(activeCourse.id, l.id);
    const b = document.createElement('button');
    b.className = `lesson-item${done ? ' completed' : ''}`;
    b.innerHTML = `<i class="${done ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle-play'}" aria-hidden="true"></i>
      <span><strong>${idx + 1}. ${l.title}</strong><br><small>${l.duration}</small></span>`;
    b.addEventListener('click', () => loadLesson(idx));
    list.appendChild(b);
  });
}

function toggleLessonCompletion() {
  const l = activeCourse.lessons[currentLessonIndex];
  const arr = completedLessons[activeCourse.id] ||= [];
  const i = arr.indexOf(l.id);
  i > -1 ? arr.splice(i, 1) : arr.push(l.id);
  store.set('suid_completed', completedLessons);
  renderLessonsList(); loadLesson(currentLessonIndex); updateProgress();
}

function updateProgress() {
  const pct = Math.round(((completedLessons[activeCourse.id] || []).length / activeCourse.lessons.length) * 100);
  $('progressPercent').textContent = `${pct}%`;
  $('progressFill').style.width = `${pct}%`;
  $('getCertBtn').classList.toggle('hidden', pct !== 100);
}

// --- Pestañas: Clase / Laboratorio / Asistente IA ---
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('hidden', p.id !== `panel-${tab}`));
}

// --- Laboratorio simulado (NO es una VM real; ver nota en courses-data.js) ---
let labStarted = false;
function resetLab() {
  labStarted = false;
  $('labIntro').classList.remove('hidden');
  $('labConsole').classList.add('hidden');
  $('labOutput').replaceChildren();
  const lab = labsData[activeCourse.id];
  $('labBrief').textContent = lab ? lab.brief : 'No hay laboratorio configurado para este curso todavía.';
  $('startLabBtn').disabled = !lab;
}

function startLab() {
  const lab = labsData[activeCourse.id];
  if (!lab) return;
  $('startLabBtn').disabled = true;
  $('startLabBtn').textContent = 'Aprovisionando máquina simulada…';
  setTimeout(() => {
    labStarted = true;
    $('labIntro').classList.add('hidden');
    $('labConsole').classList.remove('hidden');
    $('labMachineInfo').textContent = `${lab.machine} · ${lab.ip} · ${lab.os}`;
    appendLabLine(`Conectado a ${lab.machine} (simulado). Escribe "help" para ver los comandos de esta demo.`, 'sys');
    $('labCmd').focus();
  }, 900);
}

function appendLabLine(text, kind) {
  const out = $('labOutput');
  const line = document.createElement('div');
  line.className = `lab-line lab-${kind || 'out'}`;
  line.textContent = text;
  out.appendChild(line);
  out.scrollTop = out.scrollHeight;
}

function runLabCommand(raw) {
  const cmd = raw.trim();
  if (!cmd) return;
  appendLabLine(`$ ${cmd}`, 'cmd');
  const lab = labsData[activeCourse.id];
  const answer = lab.commands[cmd];
  appendLabLine(answer || 'Comando no reconocido en este laboratorio simulado. Escribe "help".', answer ? 'out' : 'err');
}

// --- Asistente IA simulado por curso (ver nota en courses-data.js) ---
function resetChat() {
  $('chatLog').replaceChildren();
  const faqs = faqData[activeCourse.id] || [];
  appendChatBubble(`Hola, soy el asistente de "${activeCourse.title}". Puedo responder dudas frecuentes del temario. Esta es una demo con respuestas predefinidas, no un modelo de IA real.`, 'bot');
  if (faqs.length) appendChatBubble(`Prueba preguntar, por ejemplo: "${faqs[0].k[0]}"`, 'bot');
}

function appendChatBubble(text, who) {
  const log = $('chatLog');
  const b = document.createElement('div');
  b.className = `chat-bubble chat-${who}`;
  b.textContent = text;
  log.appendChild(b);
  log.scrollTop = log.scrollHeight;
}

function answerQuestion(question) {
  const faqs = faqData[activeCourse.id] || [];
  const q = question.toLowerCase();
  let best = null, bestScore = 0;
  faqs.forEach(f => {
    const score = f.k.reduce((n, kw) => n + (q.includes(kw) ? 1 : 0), 0);
    if (score > bestScore) { best = f; bestScore = score; }
  });
  return best ? best.a : 'No tengo una respuesta preparada para eso en esta demo. En la versión real, esto lo respondería un modelo de IA con el temario del curso como contexto; por ahora, consúltalo con tu instructor o en el foro del curso.';
}

function sendChat() {
  const input = $('chatInput');
  const text = input.value.trim();
  if (!text) return;
  appendChatBubble(text, 'user');
  input.value = '';
  setTimeout(() => appendChatBubble(answerQuestion(text), 'bot'), 350);
}

// --- Certificado con código y huella SHA-256 ---
// AVISO: al generarse en el navegador, el código es demostrativo. Para validez real,
// el servidor debe emitir y registrar el certificado y exponer una página de verificación.
async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function showCertificate() {
  const name = session?.name || 'Estudiante';
  const date = new Date().toLocaleDateString('es-NI', { year: 'numeric', month: 'long', day: 'numeric' });
  const hash = await sha256(`${name}|${activeCourse.id}|${date}`);
  const code = 'SUID-' + hash.slice(0, 12).toUpperCase().match(/.{4}/g).join('-');
  $('certStudentName').textContent = name;
  $('certCourseTitle').textContent = activeCourse.title;
  $('certInstructor').textContent = `Instructor: ${activeCourse.instructor}`;
  $('certDate').textContent = `Emitido el ${date}`;
  $('certCode').textContent = code;
  $('certHash').textContent = hash;
  const qr = $('certQR');
  qr.replaceChildren();
  if (window.QRCode) new QRCode(qr, { text: `${location.origin}${location.pathname}?verificar=${code}`, width: 96, height: 96 });
  certModal.classList.remove('hidden');
}

function setupEventListeners() {
  searchInput.addEventListener('input', filterCourses);
  levelFilter.addEventListener('change', filterCourses);
  catButtons.forEach(b => b.addEventListener('click', () => {
    catButtons.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    filterCourses();
  }));
  coursesGrid.addEventListener('click', e => {
    const b = e.target.closest('[data-course]');
    if (b) openCourse(b.dataset.course);
  });
  $('closeModal').addEventListener('click', closeCourse);
  $('markCompleteBtn').addEventListener('click', toggleLessonCompletion);
  $('getCertBtn').addEventListener('click', showCertificate);
  $('closeCertModal').addEventListener('click', () => certModal.classList.add('hidden'));
  $('printCert').addEventListener('click', () => window.print());

  document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));
  $('startLabBtn').addEventListener('click', startLab);
  $('labCmd').addEventListener('keydown', e => { if (e.key === 'Enter') { runLabCommand(e.target.value); e.target.value = ''; } });
  $('chatInput').addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });
  $('chatSend').addEventListener('click', sendChat);

  const guide = $('vscodeGuide'), gbtn = $('toggleVsCodeGuide');
  gbtn.addEventListener('click', () => gbtn.setAttribute('aria-expanded', !guide.classList.toggle('hidden')));
  $('closeVsCodeGuide').addEventListener('click', () => { guide.classList.add('hidden'); gbtn.setAttribute('aria-expanded', 'false'); });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (!certModal.classList.contains('hidden')) certModal.classList.add('hidden');
    else if (!courseModal.classList.contains('hidden')) closeCourse();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  session = Auth.guard(['estudiante', 'docente', 'admin']);
  if (!session) return;
  $('whoami').textContent = `${session.name} · ${ROLE_LABEL[session.role]}`;
  $('dashLink').href = ROLE_HOME[session.role];
  $('dashLink').classList.toggle('hidden', session.role === 'estudiante');
  $('logoutBtn').addEventListener('click', Auth.logout);
  renderCourses(coursesData);
  setupEventListeners();
});
