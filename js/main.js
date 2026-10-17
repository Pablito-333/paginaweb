/**
 * JUAN PABLO - SITIO WEB PERSONAL
 * Main JavaScript: Navigation, Audio Engine, Interactive Features, Guestbook, Lightbox
 */

// ==========================================
// 1. WEB AUDIO SYNTHESIZER ENGINE (0 external files needed!)
// ==========================================
class SoundEngine {
  constructor() {
    this.enabled = true;
    this.audioCtx = null;
    this.initAudioContext();
  }

  initAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.audioCtx = new AudioContext();
    }
  }

  ensureContext() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playClick() {
    if (!this.enabled || !this.audioCtx) return;
    this.ensureContext();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.08);
  }

  playWhistle() {
    if (!this.enabled || !this.audioCtx) return;
    this.ensureContext();
    const t = this.audioCtx.currentTime;
    
    // Referee whistle frequency modulation
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2200, t);
    osc.frequency.linearRampToValueAtTime(2600, t + 0.06);
    osc.frequency.linearRampToValueAtTime(2300, t + 0.12);
    osc.frequency.linearRampToValueAtTime(2700, t + 0.2);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.28);
  }

  playGoalFanfare() {
    if (!this.enabled || !this.audioCtx) return;
    this.ensureContext();
    const t = this.audioCtx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.1);

      gain.gain.setValueAtTime(0.15, t + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, t + idx * 0.1 + 0.45);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t + idx * 0.1);
      osc.stop(t + idx * 0.1 + 0.45);
    });
  }

  playMiss() {
    if (!this.enabled || !this.audioCtx) return;
    this.ensureContext();
    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.3);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  playPurr() {
    if (!this.enabled || !this.audioCtx) return;
    this.ensureContext();
    const t = this.audioCtx.currentTime;
    
    // Purr low rumble
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, t);
    osc.frequency.linearRampToValueAtTime(75, t + 0.25);
    osc.frequency.linearRampToValueAtTime(60, t + 0.5);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.6);
  }
}

const sounds = new SoundEngine();
window.sounds = sounds;

// ==========================================
// 2. SOUND TOGGLE UI
// ==========================================
const soundToggleBtn = document.getElementById('soundToggleBtn');
if (soundToggleBtn) {
  const iconOn = soundToggleBtn.querySelector('.sound-icon-on');
  const iconOff = soundToggleBtn.querySelector('.sound-icon-off');
  const label = soundToggleBtn.querySelector('.sound-label');

  soundToggleBtn.addEventListener('click', () => {
    sounds.enabled = !sounds.enabled;
    if (sounds.enabled) {
      iconOn.style.display = 'block';
      iconOff.style.display = 'none';
      label.textContent = 'Sonido: ON';
      sounds.playClick();
    } else {
      iconOn.style.display = 'none';
      iconOff.style.display = 'block';
      label.textContent = 'Sonido: OFF';
    }
  });
}

// ==========================================
// 3. NAVBAR SCROLL & MOBILE MENU
// ==========================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    sounds.playClick();
  });

  // Close menu on link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      sounds.playClick();
    });
  });
}

// ==========================================
// 4. CIRCLE TABS (FAMILY / CATS / FRIENDS)
// ==========================================
const circleTabs = document.querySelectorAll('.c-tab');
const circuloCards = document.querySelectorAll('.circulo-card');

circleTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    sounds.playClick();
    circleTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const target = tab.getAttribute('data-target');

    circuloCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (target === 'all' || category === target) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ==========================================
// 5. PETTING MICHU & MIKE INTERACTION
// ==========================================
const petCatsBtn = document.getElementById('petCatsBtn');
const purrCounter = document.getElementById('purrCounter');
const petMessage = document.getElementById('petMessage');

let petCount = parseInt(localStorage.getItem('jp_pet_count') || '0', 10);
if (purrCounter) {
  purrCounter.textContent = `${petCount} mimos`;
}

const catQuotes = [
  '😻 ¡Michu empezó a ronronear felizmente!',
  '🐾 ¡Mike se estiró en el sofá y te dio un cabezazo cariñoso!',
  '💖 ¡Michu y Mike están súper consentidos!',
  '✨ ¡Ronroneo doble en estéreo! Son los reyes de la casa.',
  '🐱 "Prrrr... gracias por el cariño", dicen Michu y Mike.'
];

if (petCatsBtn) {
  petCatsBtn.addEventListener('click', (e) => {
    sounds.playPurr();
    petCount++;
    localStorage.setItem('jp_pet_count', petCount);
    if (purrCounter) purrCounter.textContent = `${petCount} mimos`;

    if (petMessage) {
      const randomQuote = catQuotes[Math.floor(Math.random() * catQuotes.length)];
      petMessage.textContent = randomQuote;
      petMessage.style.color = '#2dd4bf';
    }

    // Spawn floating heart particle
    createFloatingParticle(e.clientX, e.clientY, ['💖', '🐾', '😻', '✨', '🐱'][Math.floor(Math.random() * 5)]);
  });
}

function createFloatingParticle(x, y, emoji) {
  const el = document.createElement('div');
  el.className = 'floating-heart';
  el.textContent = emoji;
  el.style.left = `${x - 15}px`;
  el.style.top = `${y - 20}px`;
  document.body.appendChild(el);

  setTimeout(() => {
    el.remove();
  }, 1400);
}

// ==========================================
// 6. XBOX CONTROLLER BUTTONS INTERACTION
// ==========================================
const controllerButtons = document.querySelectorAll('.c-btn');
const controllerFeedback = document.getElementById('controllerFeedback');

controllerButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    sounds.playClick();
    const action = btn.getAttribute('data-action');
    if (controllerFeedback) {
      controllerFeedback.innerHTML = `<strong>Acción FC 26:</strong> ${action}`;
      controllerFeedback.style.color = '#2dd4bf';
    }
  });
});

// ==========================================
// 7. LIGHTBOX MODAL FOR PHOTOS
// ==========================================
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

// Target images in circle and hero
const viewableImages = document.querySelectorAll('.circulo-card-img-wrap img, .hero-photo, .futbol-img');

viewableImages.forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    sounds.playClick();
    if (lightboxModal && lightboxImg && lightboxCaption) {
      lightboxImg.src = img.src;
      lightboxCaption.textContent = img.alt || 'Juan Pablo - Foto';
      lightboxModal.classList.add('active');
    }
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', () => {
    lightboxModal.classList.remove('active');
  });
}

if (lightboxModal) {
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
    }
  });
}

// ==========================================
// 8. GUESTBOOK / MURO DE MENSAJES
// ==========================================
const messageForm = document.getElementById('messageForm');
const messageList = document.getElementById('messageList');
const messageCount = document.getElementById('messageCount');

const defaultMessages = [
  {
    name: "Papá y Mamá",
    tag: "❤️ Familia",
    text: "Hijo, estamos muy orgullosos de ti. Sigue entrenando fuerte, con humildad y fe. ¡Tus sueños son los nuestros!",
    time: "Ayer a las 8:30 PM"
  },
  {
    name: "Mateo",
    tag: "⚽ Compañero de Fútbol",
    text: "¡Ese dorsal #7 no se lo quita nadie! En el próximo torneo vamos a romperla con tus centros y desbordes, crack.",
    time: "Ayer a las 6:15 PM"
  },
  {
    name: "Valentina",
    tag: "🏫 Amigo del Colegio Currea Manrique",
    text: "Juan Pablo es el que más nos hace reír en los descansos. ¡Muchos éxitos en todo lo que te propongas!",
    time: "Hace 2 días"
  },
  {
    name: "Santiago R.",
    tag: "🎮 Rival en FC 26",
    text: "Muy buen jugador en la cancha real, pero en el Xbox te voy a remontar la revancha jaja. ¡Un abrazo hermano!",
    time: "Hace 3 días"
  }
];

function getStoredMessages() {
  const stored = localStorage.getItem('jp_messages');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return defaultMessages;
    }
  }
  return defaultMessages;
}

function renderMessages() {
  if (!messageList) return;
  const msgs = getStoredMessages();
  messageList.innerHTML = '';

  msgs.forEach(msg => {
    const card = document.createElement('div');
    card.className = 'message-card';
    card.innerHTML = `
      <div class="msg-top">
        <span class="msg-author">${escapeHtml(msg.name)}</span>
        <span class="msg-tag">${escapeHtml(msg.tag)}</span>
      </div>
      <p class="msg-text">${escapeHtml(msg.text)}</p>
      <span class="msg-time">${escapeHtml(msg.time)}</span>
    `;
    messageList.appendChild(card);
  });

  if (messageCount) {
    messageCount.textContent = `${msgs.length} Mensajes`;
  }
}

if (messageForm) {
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sounds.playGoalFanfare();

    const nameInput = document.getElementById('senderName');
    const tagSelect = document.getElementById('relationship');
    const textInput = document.getElementById('messageText');

    const newMsg = {
      name: nameInput.value.trim(),
      tag: tagSelect.value,
      text: textInput.value.trim(),
      time: "Justo ahora"
    };

    const currentMsgs = getStoredMessages();
    currentMsgs.unshift(newMsg);
    localStorage.setItem('jp_messages', JSON.stringify(currentMsgs));

    renderMessages();
    messageForm.reset();

    // Visual feedback
    alert("¡Muchas gracias! Tu mensaje ha sido publicado con éxito en el muro de Juan Pablo. ⚽✨");
  });
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}

// Initial render
renderMessages();

// ==========================================
// 9. BACK TO TOP
// ==========================================
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    sounds.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
