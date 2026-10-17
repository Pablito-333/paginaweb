/**
 * JUAN PABLO - PENALTY KICK MINI GAME
 * "Desafío de Penales Juan Pablo FC"
 */

(function() {
  const pitchArea = document.getElementById('pitchArea');
  const soccerBall = document.getElementById('soccerBall');
  const goalkeeper = document.getElementById('goalkeeper');
  const shotMessage = document.getElementById('shotMessage');
  const gameGoals = document.getElementById('gameGoals');
  const gameShots = document.getElementById('gameShots');
  const gameStreak = document.getElementById('gameStreak');
  const resetGameBtn = document.getElementById('resetGameBtn');
  const targets = document.querySelectorAll('.goal-target');

  let goals = 0;
  let shots = 0;
  let streak = 0;
  let isShooting = false;

  const zones = ['tl', 'tr', 'bl', 'br', 'c'];

  // Zone coordinates inside pitch
  const targetCoordinates = {
    tl: { x: -160, y: -240, scale: 0.55 },
    tr: { x: 160, y: -240, scale: 0.55 },
    bl: { x: -160, y: -140, scale: 0.65 },
    br: { x: 160, y: -140, scale: 0.65 },
    c:  { x: 0, y: -190, scale: 0.6 }
  };

  // Attach click listener to each target
  targets.forEach(target => {
    target.addEventListener('click', (e) => {
      e.stopPropagation();
      const zone = target.getAttribute('data-zone');
      takePenaltyShot(zone);
    });
  });

  // Clicking anywhere inside pitch area also shoots towards nearest point
  if (pitchArea) {
    pitchArea.addEventListener('click', (e) => {
      if (isShooting) return;
      const rect = pitchArea.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;

      let chosenZone = 'c';
      if (relY < 0.5) {
        chosenZone = relX < 0.5 ? 'tl' : 'tr';
      } else if (relY < 0.8) {
        chosenZone = relX < 0.5 ? 'bl' : 'br';
      }
      takePenaltyShot(chosenZone);
    });
  }

  function takePenaltyShot(targetZone) {
    if (isShooting) return;
    isShooting = true;
    shots++;
    updateScoreboard();

    if (window.sounds) {
      window.sounds.playWhistle();
    }

    // Goalkeeper AI decision:
    // Corners are harder to save, center is easier to save
    const gkDive = chooseGoalkeeperDive(targetZone);

    // Animate Goalkeeper
    goalkeeper.className = 'goalkeeper';
    void goalkeeper.offsetWidth; // force reflow
    goalkeeper.classList.add(`gk-dive-${gkDive}`);

    // Animate Ball
    const coords = targetCoordinates[targetZone] || targetCoordinates.c;
    soccerBall.style.transform = `translate(${coords.x}px, ${coords.y}px) scale(${coords.scale}) rotate(720deg)`;

    // Evaluate result after ball arrives
    setTimeout(() => {
      const isGoal = (gkDive !== targetZone);

      if (isGoal) {
        goals++;
        streak++;
        if (window.sounds) window.sounds.playGoalFanfare();
        showBanner('¡GOOOOOOL DE JUAN PABLO! 🔥⚽', 'show-goal');
      } else {
        streak = 0;
        if (window.sounds) window.sounds.playMiss();
        showBanner('¡ATAJADA ESPECTACULAR! 🧤', 'show-saved');
      }

      updateScoreboard();

      // Reset after brief delay
      setTimeout(() => {
        resetBallAndKeeper();
        isShooting = false;
      }, 1500);

    }, 550);
  }

  function chooseGoalkeeperDive(targetZone) {
    // 65% chance goalkeeper dives to random zone, 35% chance goalkeeper guesses targetZone
    const willGuessRight = Math.random() < 0.35;
    if (willGuessRight) {
      return targetZone;
    }
    // Random other zone
    const otherZones = zones.filter(z => z !== targetZone);
    return otherZones[Math.floor(Math.random() * otherZones.length)];
  }

  function showBanner(text, cssClass) {
    if (!shotMessage) return;
    shotMessage.textContent = text;
    shotMessage.className = `shot-message ${cssClass}`;

    setTimeout(() => {
      shotMessage.className = 'shot-message';
    }, 1400);
  }

  function resetBallAndKeeper() {
    soccerBall.style.transition = 'none';
    soccerBall.style.transform = 'translate(0, 0) scale(1) rotate(0deg)';
    goalkeeper.className = 'goalkeeper';

    setTimeout(() => {
      soccerBall.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    }, 50);
  }

  function updateScoreboard() {
    if (gameGoals) gameGoals.textContent = goals;
    if (gameShots) gameShots.textContent = shots;
    if (gameStreak) gameStreak.textContent = streak;
  }

  if (resetGameBtn) {
    resetGameBtn.addEventListener('click', () => {
      if (window.sounds) window.sounds.playClick();
      goals = 0;
      shots = 0;
      streak = 0;
      updateScoreboard();
      resetBallAndKeeper();
      isShooting = false;
    });
  }
})();
