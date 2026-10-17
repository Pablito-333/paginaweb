/**
 * JUAN PABLO - TRIVIA INTERACTIVA
 * "¿Cuánto conoces a Juan Pablo?"
 */

(function() {
  const triviaContainer = document.getElementById('triviaContainer');
  const triviaProgress = document.getElementById('triviaProgress');

  const questions = [
    {
      question: "¿Cuál es el mayor sueño y pasión de Juan Pablo?",
      options: [
        "Ser piloto de aviación comercial",
        "Ser futbolista profesional",
        "Ser programador de videojuegos",
        "Ser chef internacional"
      ],
      correct: 1,
      explanation: "¡Exacto! El fútbol es su gran pasión, lo que practica en sus tiempos libres y su sueño más grande."
    },
    {
      question: "¿Cómo se llaman los dos adorados gatos de Juan Pablo?",
      options: [
        "Tom y Jerry",
        "Pelusa y Bigotes",
        "Michu y Mike",
        "Simba y Nala"
      ],
      correct: 2,
      explanation: "¡Así es! Michu y Mike son sus dos amores felinos que siempre lo acompañan a descansar en el sofá."
    },
    {
      question: "¿En qué institución educativa estudia Juan Pablo a sus 16 años?",
      options: [
        "Colegio María Currea Manrique",
        "Colegio San Simón",
        "Liceo Pedagógico del Norte",
        "Instituto Santander"
      ],
      correct: 0,
      explanation: "¡Correcto! Estudia con mucho entusiasmo en el Colegio María Currea Manrique."
    },
    {
      question: "¿Qué carrera universitaria le gustaría estudiar a Juan Pablo?",
      options: [
        "Ingeniería de Sistemas",
        "Ingeniería Automotriz",
        "Administración de Empresas",
        "Diseño Gráfico"
      ],
      correct: 1,
      explanation: "¡Muy bien! Le apasionan los motores, la mecánica y sueña con estudiar Ingeniería Automotriz."
    },
    {
      question: "¿Cuál es su videojuego favorito para jugar en su consola Xbox?",
      options: [
        "EA Sports FC 26",
        "Call of Duty: Warzone",
        "Minecraft",
        "Grand Theft Auto"
      ],
      correct: 0,
      explanation: "¡Golazo! En Xbox su juego predilecto es el FC 26 para armar jugadas y ganar torneos."
    },
    {
      question: "¿Cuál es su serie predilecta y sus películas favoritas?",
      options: [
        "Breaking Bad y saga Batman",
        "Dark e Interstellar",
        "Stranger Things y la trilogía de Creed / Avengers",
        "The Boys y Fast & Furious"
      ],
      correct: 2,
      explanation: "¡Brillante! Es fanático de Stranger Things por los 80s y de la disciplina de Creed junto a lo épico de Avengers."
    },
    {
      question: "¿Desde qué edad conoce Juan Pablo al amor de su vida?",
      options: [
        "Desde que tiene 12 años",
        "Desde que tiene 15 años",
        "Desde que tiene 8 años",
        "Desde que tiene 14 años"
      ],
      correct: 0,
      explanation: "¡Maravilloso! La conoce desde los 12 años, la ama con toda su alma y con ella sueña cumplir todos sus proyectos."
    }
  ];

  let currentQuestionIndex = 0;
  let score = 0;

  function renderQuestion() {
    if (!triviaContainer) return;

    if (currentQuestionIndex >= questions.length) {
      renderResults();
      return;
    }

    const q = questions[currentQuestionIndex];
    const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
    if (triviaProgress) {
      triviaProgress.style.width = `${progressPercent}%`;
    }

    triviaContainer.innerHTML = `
      <div class="question-box">
        <span style="font-size: 0.85rem; color: var(--teal-light); font-weight: 700; display: block; margin-bottom: 0.5rem;">
          Pregunta ${currentQuestionIndex + 1} de ${questions.length}
        </span>
        <h4 class="question-text">${q.question}</h4>
        <div class="options-grid">
          ${q.options.map((opt, i) => `
            <button class="option-btn" data-index="${i}">
              <span>${opt}</span>
              <span class="opt-icon">➜</span>
            </button>
          `).join('')}
        </div>
        <div class="trivia-feedback-box" id="triviaFeedback"></div>
      </div>
    `;

    const optionBtns = triviaContainer.querySelectorAll('.option-btn');
    const feedbackBox = document.getElementById('triviaFeedback');

    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIndex = parseInt(btn.getAttribute('data-index'), 10);
        handleAnswer(selectedIndex, q, optionBtns, feedbackBox);
      });
    });
  }

  function handleAnswer(selected, q, allButtons, feedbackBox) {
    allButtons.forEach(b => b.disabled = true);

    if (selected === q.correct) {
      score++;
      if (window.sounds) window.sounds.playGoalFanfare();
      allButtons[selected].classList.add('correct');
      feedbackBox.innerHTML = `<strong>¡Correcto!</strong> ${q.explanation}`;
      feedbackBox.style.display = 'block';
      feedbackBox.style.borderColor = 'var(--teal-bright)';
      feedbackBox.style.color = 'var(--teal-light)';
    } else {
      if (window.sounds) window.sounds.playMiss();
      allButtons[selected].classList.add('incorrect');
      allButtons[q.correct].classList.add('correct');
      feedbackBox.innerHTML = `<strong>¡Casi!</strong> La opción correcta era: "${q.options[q.correct]}". ${q.explanation}`;
      feedbackBox.style.display = 'block';
      feedbackBox.style.borderColor = 'var(--accent-red)';
      feedbackBox.style.color = '#fca5a5';
    }

    setTimeout(() => {
      currentQuestionIndex++;
      renderQuestion();
    }, 2200);
  }

  function renderResults() {
    let title = "";
    let desc = "";
    let emoji = "🏆";

    if (score === questions.length) {
      title = "¡Conocedor Absoluto de Juan Pablo! 🌟";
      desc = "¡Puntaje perfecto! Conoces cada detalle de sus sueños en el fútbol, su familia, sus gatos Michu y Mike, y sus gustos.";
      emoji = "👑";
    } else if (score >= 4) {
      title = "¡Gran Amigo de Juan Pablo! ⚽";
      desc = "¡Muy buen puntaje! Se nota que prestas atención a sus historias y compartes su buena energía.";
      emoji = "🥇";
    } else {
      title = "¡Buen Intento! 🚀";
      desc = "Ahora ya conoces mucho mejor a Juan Pablo, sus gatos, su pasión por el fútbol y sus metas.";
      emoji = "🤝";
    }

    triviaContainer.innerHTML = `
      <div class="trivia-result-screen">
        <div class="result-trophy">${emoji}</div>
        <h4 class="result-title">${title}</h4>
        <div class="result-score">${score} de ${questions.length} Aciertos (${Math.round((score / questions.length) * 100)}%)</div>
        <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 1.8rem; font-size: 1.05rem;">
          ${desc}
        </p>
        <button class="btn btn-primary" id="retryTriviaBtn">
          <span>Volver a Intentar</span>
          <span>🔄</span>
        </button>
      </div>
    `;

    launchConfetti();

    const retryBtn = document.getElementById('retryTriviaBtn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        if (window.sounds) window.sounds.playClick();
        currentQuestionIndex = 0;
        score = 0;
        renderQuestion();
      });
    }
  }

  // Lightweight native canvas confetti (0 external CDN dependency)
  function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#2dd4bf', '#00b4b6', '#38bdf8', '#ffffff', '#f59e0b', '#ec4899'];
    const particles = [];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        w: Math.random() * 9 + 4,
        h: Math.random() * 6 + 4,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14 - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        gravity: 0.25,
        opacity: 1
      });
    }

    let animationFrame;
    const startTime = Date.now();

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const elapsed = Date.now() - startTime;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vr;
        if (elapsed > 1800) {
          p.opacity -= 0.02;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (elapsed < 3000) {
        animationFrame = requestAnimationFrame(update);
      } else {
        cancelAnimationFrame(animationFrame);
        canvas.remove();
      }
    }

    update();
  }

  // Start trivia on load
  renderQuestion();
})();
