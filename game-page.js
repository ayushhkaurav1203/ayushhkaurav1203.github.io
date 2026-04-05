/* ============================================================
   NEON ARCADE — Game Page Script (game.html)
   Handles: loading animation, iframe setup, fullscreen,
            related games, controls display
   ============================================================ */

'use strict';

/* ── Same game data as script.js (self-contained) ── */
const GAMES_DATA = [
  {
    id: 'target-blitz',
    title: 'Target Blitz',
    category: 'shooting',
    description: 'Sharpen your aim in this fast-paced target shooting game! Click the glowing targets before they vanish. Rack up combos for bonus points and climb the leaderboard. You have 30 seconds — how high can you score?',
    thumbnail: '🎯',
    color: '#ff4757',
    plays: '128K',
    rating: 4.7,
    controls: [
      { key: 'Mouse Click', desc: 'Shoot a target' },
      { key: 'Hit Fast', desc: 'Build combo multiplier' },
      { key: 'Miss Click', desc: 'Resets your combo' },
    ]
  },
  {
    id: 'neon-racer',
    title: 'Neon Racer',
    category: 'racing',
    description: 'Tear through a neon highway at breakneck speed! Dodge oncoming traffic, collect boost pads, and survive as long as possible. Use Arrow Keys or WASD to steer your glowing ride through the endless city.',
    thumbnail: '🏎️',
    color: '#ffa502',
    plays: '94K',
    rating: 4.5,
    controls: [
      { key: '← → or A D', desc: 'Steer left / right' },
      { key: 'Avoid cars', desc: 'Lose a life on collision' },
      { key: '⚡ Collect', desc: 'Speed boost + bonus points' },
    ]
  },
  {
    id: 'hex-puzzle',
    title: 'Hex Puzzle',
    category: 'puzzle',
    description: 'Match colorful hexagonal tiles to clear the board before you run out of moves! Plan carefully — every swap counts. A beautiful and brain-bending logic puzzle that gets harder as you progress.',
    thumbnail: '🧩',
    color: '#2ed573',
    plays: '76K',
    rating: 4.8,
    controls: [
      { key: 'Click Tile', desc: 'Select a tile' },
      { key: 'Click Adjacent', desc: 'Swap to match 3+' },
      { key: '💡 Hint Btn', desc: 'Highlight a valid move' },
    ]
  },
  {
    id: 'pixel-runner',
    title: 'Pixel Runner',
    category: 'arcade',
    description: 'An endless side-scrolling runner set in a retro pixel world. Jump over obstacles, slide under barriers, and collect coins to boost your score. Double jump is your best friend!',
    thumbnail: '👾',
    color: '#5352ed',
    plays: '210K',
    rating: 4.6,
    controls: [
      { key: 'Space / Tap', desc: 'Jump' },
      { key: 'Space × 2', desc: 'Double jump (midair)' },
      { key: '$ Coins', desc: '+50 score each' },
    ]
  },
  {
    id: 'gravity-hopper',
    title: 'Gravity Hopper',
    category: 'platformer',
    description: 'A physics-based platformer where you flip gravity to navigate treacherous levels! Collect all stars to unlock the next stage across multiple challenging levels.',
    thumbnail: '🚀',
    color: '#eccc68',
    plays: '55K',
    rating: 4.4,
    controls: [
      { key: '← → or A D', desc: 'Move left / right' },
      { key: 'Space or W', desc: 'Jump (when on ground)' },
      { key: '↑ or F', desc: 'Flip gravity direction!' },
      { key: '⭐ Stars', desc: 'Collect all to advance' },
    ]
  },
  {
    id: 'cyber-clicker',
    title: 'Cyber Clicker',
    category: 'clicker',
    description: 'Build your cyberpunk empire one click at a time! Buy upgrades, automate production, and watch your digital currency skyrocket. An addictive idle clicker with deep upgrade trees and prestige mechanics.',
    thumbnail: '💻',
    color: '#ff6b81',
    plays: '183K',
    rating: 4.9,
    controls: [
      { key: 'Click 💻', desc: 'Earn credits manually' },
      { key: 'Buy Upgrades', desc: 'Increase passive income' },
      { key: 'Prestige', desc: 'Reset for 50% CPS bonus' },
    ]
  },
];

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const gameId = params.get('id');

  const game = GAMES_DATA.find(g => g.id === gameId);

  if (!game) {
    document.getElementById('gameTitle').textContent = 'Game Not Found';
    hideLoading();
    return;
  }

  // Update page title
  document.title = `NeonArcade — Play ${game.title}`;

  // Populate header
  document.getElementById('gameTitle').textContent = game.title;
  document.getElementById('gameTitle').style.color = game.color;
  document.getElementById('gameTitle').style.textShadow = `0 0 20px ${game.color}80`;

  // Meta badges
  const meta = document.getElementById('gameMeta');
  meta.innerHTML = `
    <span class="meta-badge" style="color:${game.color};border-color:${game.color}60">${game.category.toUpperCase()}</span>
    <span style="font-size:0.8rem;color:#ffe600">★ ${game.rating}</span>
    <span style="font-size:0.8rem;color:#8899aa">👤 ${game.plays} plays</span>
  `;

  // Description
  document.getElementById('gameDesc').textContent = game.description;

  // Controls
  renderControls(game);

  // Load game iframe
  const iframe = document.getElementById('gameIframe');
  iframe.src = game.id + ".html";

  // Hide loading after iframe loads
  iframe.addEventListener('load', () => {
    setTimeout(hideLoading, 400);
  });

  // Fallback: hide loading after 3 seconds regardless
  setTimeout(hideLoading, 3000);

  // Fullscreen button
  initFullscreen(game);

  // Related games
  renderRelated(game);

  // Mobile hamburger
  initHamburger();
});

/* ============================================================
   LOADING OVERLAY
   ============================================================ */
function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.classList.add('hidden');
    setTimeout(() => overlay.remove(), 500);
  }
}

/* ============================================================
   CONTROLS DISPLAY
   ============================================================ */
function renderControls(game) {
  const container = document.getElementById('gameControls');
  if (!container) return;

  let html = `<h3>Controls</h3>`;
  game.controls.forEach(ctrl => {
    html += `
      <div class="control-item">
        <span class="key-badge">${ctrl.key}</span>
        <span>${ctrl.desc}</span>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* ============================================================
   FULLSCREEN
   ============================================================ */
function initFullscreen(game) {
  const btn = document.getElementById('fullscreenBtn');
  const container = document.getElementById('gameFrameContainer');
  const iframe = document.getElementById('gameIframe');

  if (!btn || !container) return;

  // Style button with game color
  btn.style.background = game.color;
  btn.style.boxShadow  = `0 0 20px ${game.color}60`;

  btn.addEventListener('click', () => {
    // Try fullscreen API on container
    const el = container;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else {
      // Fallback: expand iframe height
      iframe.style.height = '700px';
      btn.textContent = '✕ Exit';
    }
  });

  // Update button text on fullscreen change
  document.addEventListener('fullscreenchange', () => {
    btn.textContent = document.fullscreenElement ? '✕ Exit Full' : '⛶ Fullscreen';
  });
}

/* ============================================================
   RELATED GAMES
   ============================================================ */
function renderRelated(currentGame) {
  const container = document.getElementById('relatedGames');
  if (!container) return;

  // Get other games (preferring same category)
  const others = GAMES_DATA
    .filter(g => g.id !== currentGame.id)
    .sort((a, b) => (b.category === currentGame.category ? 1 : 0) - (a.category === currentGame.category ? 1 : 0))
    .slice(0, 4);

  others.forEach((game, i) => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.style.setProperty('--card-color', game.color);
    card.style.animationDelay = (i * 0.07) + 's';
    card.style.cursor = 'pointer';

    card.innerHTML = `
      <div class="card-thumb" style="background:${game.color}18">
        <span class="card-badge">${game.category}</span>
        <span class="thumb-emoji">${game.thumbnail}</span>
        <div class="card-play-overlay">
          <button class="play-btn-big" aria-label="Play ${game.title}">▶</button>
        </div>
      </div>
      <div class="card-body">
        <div class="card-title">${game.title}</div>
        <div class="card-meta">
          <span class="card-plays">👤 ${game.plays}</span>
          <span class="card-rating">${game.rating} ★</span>
        </div>
        <button class="card-play-button">▶ Play Now</button>
      </div>
    `;

    const goToGame = () => {
      window.location.href = `game.html?id=${game.id}`;
    };

    card.querySelector('.play-btn-big').addEventListener('click', goToGame);
    card.querySelector('.card-play-button').addEventListener('click', goToGame);
    card.querySelector('.card-thumb').addEventListener('click', goToGame);

    container.appendChild(card);
  });
}

/* ============================================================
   MOBILE HAMBURGER
   ============================================================ */
function initHamburger() {
  const burger = document.getElementById('hamburger');
  const menu   = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (!burger.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
}
