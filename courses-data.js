'use strict';
// TODO: reemplaza VIDEO por la URL real de cada lección (usa youtube-nocookie.com)
const VIDEO = '';
const L = (id, title, duration, description) => ({ id, title, duration, description, videoUrl: VIDEO });
const IMG = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

const coursesData = [
  { id: 'hacking-101', title: 'Fundamentos de hacking ético y ciberseguridad', category: 'hacking', level: 'Principiante',
    instructor: 'Ing. Carlos Mendoza (CEH, OSCP)', banner: IMG('photo-1526374965328-7f61d4dc18c5'), bannerAlt: 'Código en pantalla',
    lessons: [
      L(1, 'Introducción al pentesting ético', '12:40', 'Metodologías, marco legal y alcance de una prueba de penetración autorizada.'),
      L(2, 'Laboratorio: Kali Linux en VirtualBox', '18:15', 'Instalación de Kali Linux y de la primera máquina objetivo en una red aislada.'),
      L(3, 'Reconocimiento pasivo y Google Dorking', '22:05', 'Recolección de información pública (OSINT) sin interactuar con los servidores del objetivo.')] },
  { id: 'python-sec', title: 'Programación en Python para pentesters', category: 'programacion', level: 'Principiante',
    instructor: 'Dra. Sofía Ramírez (Senior DevSecOps)', banner: IMG('photo-1515879218367-8466d910aaa4'), bannerAlt: 'Código Python',
    lessons: [
      L(1, 'Sintaxis de Python para automatización', '15:30', 'Variables, estructuras de control y sockets para scripts de red.'),
      L(2, 'Escáner de puertos para tu laboratorio', '25:10', 'Desarrollo de un port scanner con librerías nativas, probado solo en tu red de pruebas.'),
      L(3, 'Auditoría de credenciales propias', '30:00', 'Requests y Paramiko para auditar contraseñas en sistemas que administras.')] },
  { id: 'web-pentest', title: 'Pentesting web avanzado y OWASP Top 10', category: 'pentesting', level: 'Avanzado',
    instructor: 'Msc. Roberto Silva (eWPTX)', banner: IMG('photo-1555066931-4365d14bab8c'), bannerAlt: 'Código web',
    lessons: [
      L(1, 'Burp Suite Professional', '20:00', 'Intercepción de tráfico HTTP/HTTPS en aplicaciones de práctica.'),
      L(2, 'SQL Injection: detección y mitigación', '35:45', 'Explotación en entornos controlados y cómo corregirla con consultas parametrizadas.'),
      L(3, 'XSS y protección de sesiones', '28:10', 'Funcionamiento de XSS y defensas: CSP, cookies HttpOnly y validación de salida.')] },
  { id: 'devsecops-1', title: 'DevSecOps: seguridad en pipelines CI/CD', category: 'devsecops', level: 'Intermedio',
    instructor: 'Ing. Elena Torres (AWS Certified Security)', banner: IMG('photo-1618401471353-b98afee0b2eb'), bannerAlt: 'Entorno de desarrollo',
    lessons: [
      L(1, 'Análisis estático (SAST) con SonarQube', '19:20', 'Detección de vulnerabilidades en el código antes de compilar.'),
      L(2, 'Seguridad en contenedores Docker', '24:15', 'Escaneo de imágenes con Trivy y endurecimiento de contenedores.')] }
];

/*
 * SIMULACIÓN DE LABORATORIO — NO SON MÁQUINAS VIRTUALES REALES.
 * Montar VMs de ataque reales exige infraestructura que una página estática no puede dar:
 * un hipervisor o contenedores por estudiante, red aislada sin salida a internet,
 * límites de tiempo/recursos, autenticación y registro de auditoría, y filtros contra abuso.
 * Aquí solo se simula la terminal para dar la sensación de la práctica; los "comandos"
 * son texto fijo, no se ejecuta nada real.
 */
const labsData = {
  'hacking-101': {
    machine: 'TARGET-OSINT-01', ip: '10.10.14.20', os: 'Linux (simulado)',
    brief: 'Máquina de práctica para reconocimiento pasivo. No contiene datos reales.',
    commands: {
      'whoami': 'estudiante@suid-lab',
      'nmap -sV 10.10.14.20': 'PORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.2\n80/tcp open  http    nginx 1.18 (simulado)',
      'help': 'Comandos disponibles en esta demo: whoami, nmap -sV 10.10.14.20, ls'
    }
  },
  'python-sec': {
    machine: 'LAB-NET-02', ip: '10.10.14.21', os: 'Linux (simulado)',
    brief: 'Red de práctica para probar tu propio escáner de puertos.',
    commands: {
      'python3 scanner.py 10.10.14.21': 'Escaneando 10.10.14.21...\nPuerto 22: abierto\nPuerto 80: abierto\nPuerto 443: cerrado (simulado)',
      'help': 'Comandos disponibles en esta demo: python3 scanner.py 10.10.14.21, whoami'
    }
  },
  'web-pentest': {
    machine: 'WEBAPP-VULN-03', ip: '10.10.14.22', os: 'Aplicación web vulnerable (simulada)',
    brief: 'Réplica simulada de una tienda en línea con fallas intencionales de OWASP Top 10.',
    commands: {
      "' OR 1=1 --": 'Consulta interceptada: esto es un ejemplo de carga de SQL Injection. En la app real, deberías ver filas inesperadas si el formulario es vulnerable.',
      'help': 'Comandos disponibles en esta demo: \' OR 1=1 --, whoami'
    }
  },
  'devsecops-1': {
    machine: 'CI-RUNNER-04', ip: '10.10.14.23', os: 'Pipeline simulado',
    brief: 'Pipeline de ejemplo con una imagen Docker desactualizada para practicar el escaneo.',
    commands: {
      'trivy image suid/app:1.0': 'Total: 3 vulnerabilidades (simuladas)\nCRITICAL: 1  HIGH: 2',
      'help': 'Comandos disponibles en esta demo: trivy image suid/app:1.0, whoami'
    }
  }
};

/*
 * ASISTENTE IA — simulado con una pequeña base de preguntas y coincidencia de palabras clave.
 * No es un modelo de lenguaje real. Para un asistente real por curso, necesitas un backend
 * que llame a la API de un modelo (como la API de Claude) con la clave guardada en el
 * servidor —nunca en este archivo ni en el navegador— y que le pase como contexto el
 * temario del curso para que responda solo sobre eso. Ejemplo de llamada desde tu backend:
 *
 *   const r = await fetch('https://api.anthropic.com/v1/messages', {
 *     method: 'POST',
 *     headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
 *     body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 500,
 *       system: `Eres el asistente del curso "${course.title}". Responde solo dudas sobre este temario.`,
 *       messages: [{ role: 'user', content: pregunta }] })
 *   });
 */
const faqData = {
  'hacking-101': [
    { k: ['legal', 'ley', 'permiso', 'autorización'], a: 'Solo debes practicar en tu propio laboratorio o con autorización escrita del dueño del sistema. En Nicaragua, acceder sin permiso puede ser delito según la Ley 1042.' },
    { k: ['kali', 'virtualbox', 'instalar'], a: 'Revisa la lección 2: descarga la imagen oficial de Kali Linux, créala como VM en VirtualBox con al menos 2 GB de RAM y arráncala en modo "red interna" para aislarla.' },
    { k: ['osint', 'dork', 'google'], a: 'Google Dorking usa operadores de búsqueda (site:, filetype:, intitle:) para encontrar información pública. Es reconocimiento pasivo: no toca los servidores del objetivo.' }
  ],
  'python-sec': [
    { k: ['socket', 'conexión'], a: 'El módulo socket de Python abre conexiones TCP/UDP de bajo nivel. Para el escáner de puertos usamos socket.connect_ex() porque no lanza excepción si el puerto está cerrado.' },
    { k: ['lento', 'congela', 'timeout'], a: 'Si tu escáner se congela, agrega socket.settimeout(1) antes de conectar y usa hilos (threading) o asyncio para escanear varios puertos a la vez.' },
    { k: ['paramiko', 'ssh'], a: 'Paramiko permite automatizar conexiones SSH desde Python. Úsalo solo contra tus propios servidores de práctica.' }
  ],
  'web-pentest': [
    { k: ['burp', 'proxy'], a: 'Burp Suite intercepta el tráfico entre tu navegador y la app. Configura el proxy del navegador a 127.0.0.1:8080 y acepta el certificado de Burp.' },
    { k: ['sqlmap', 'inyección', 'sql'], a: 'SQLmap automatiza la detección de SQL Injection. En el laboratorio de este curso, pruébalo solo contra la app vulnerable simulada, nunca contra sitios reales sin permiso.' },
    { k: ['xss', 'cookie'], a: 'El XSS almacenado ejecuta JavaScript en el navegador de otro usuario. Para defenderte: Content-Security-Policy, cookies con HttpOnly/Secure y escapar la salida HTML.' }
  ],
  'devsecops-1': [
    { k: ['sonarqube', 'sast'], a: 'SonarQube analiza el código fuente sin ejecutarlo (SAST) y marca patrones inseguros como inyección SQL o secretos escritos en el código.' },
    { k: ['trivy', 'docker', 'imagen'], a: 'Trivy escanea imágenes Docker en busca de vulnerabilidades conocidas (CVE) en las librerías del sistema operativo base.' }
  ]
};
