/* ============================================================
   NEON ARCADE — Main Script (index.html)
   Handles: game loading, filtering, search, leaderboard, nav
   ============================================================ */

'use strict';

/* ── Game Data
   Mirrors games.json but embedded for zero-server usage.
   To add a new game: add an entry here and a matching HTML
   file in the /games/ folder. ── */
const GAMES = [
  {
    id: 'target-blitz',
    title: 'Target Blitz',
    category: 'shooting',
    description: 'Sharpen your aim in this fast-paced target shooting game! Click the glowing targets before they vanish. Rack up combos for bonus points.',
    thumbnail: '🎯',
    color: '#ff4757',
    tags: ['shooting', 'arcade', 'skill'],
    plays: '128K',
    rating: 4.7,
    controls: [
      { key: 'Mouse Click', desc: 'Shoot target' },
      { key: 'Combos', desc: 'Hit targets quickly for bonus' },
    ]
  }, 
{
  id: 'neon-racer-pro',
  title: 'Neon Racer Pro 🔥',
  category: 'racing',
  description: 'High graphics racing game with nitro and smooth controls.',
  thumbnail: '🏁',
  color: '#00f5ff',
  tags: ['racing', '3d', 'nitro'],
  plays: 'NEW',
  rating: 5.0,
  controls: [
    { key: 'W / ↑', desc: 'Accelerate' },
    { key: 'A D / ← →', desc: 'Steer' },
    { key: 'SHIFT', desc: 'Nitro boost' }
  ]
}
  },
  {
    id: 'hex-puzzle',
    title: 'Hex Puzzle',
    category: 'puzzle',
    description: 'Match colorful hexagonal tiles to clear the board before you run out of moves! Plan carefully — every swap counts.',
    thumbnail: '🧩',
    color: '#2ed573',
    tags: ['puzzle', 'match', 'logic'],
    plays: '76K',
    rating: 4.8,
    controls: [
      { key: 'Click', desc: 'Select a tile' },
      { key: 'Click Adjacent', desc: 'Swap selected tile' },
      { key: '💡 Hint', desc: 'Show possible match' },
    ]
  },
  {
    id: 'pixel-runner',
    title: 'Pixel Runner',
    category: 'arcade',
    description: 'An endless side-scrolling runner set in a retro pixel world. Jump over obstacles, collect coins, and beat your high score!',
    thumbnail: '👾',
    color: '#5352ed',
    tags: ['arcade', 'endless', 'runner'],
    plays: '210K',
    rating: 4.6,
    controls: [
      { key: 'Space / Tap', desc: 'Jump' },
      { key: 'Double Space', desc: 'Double jump' },
      { key: '$ Coins', desc: 'Collect for bonus score' },
    ]
  },
  {
    id: 'gravity-hopper',
    title: 'Gravity Hopper',
    category: 'platformer',
    description: 'A physics-based platformer where you flip gravity to navigate treacherous levels! Collect all stars to complete each stage.',
    thumbnail: '🚀',
    color: '#eccc68',
    tags: ['platformer', 'physics', 'puzzle'],
    plays: '55K',
    rating: 4.4,
    controls: [
      { key: '← → / A D', desc: 'Move' },
      { key: 'Space / W', desc: 'Jump' },
      { key: '↑ / F', desc: 'Flip gravity!' },
    ]
  },
  {
    id: 'cyber-clicker',
    title: 'Cyber Clicker',
    category: 'clicker',
    description: 'Build your cyberpunk empire one click at a time! Buy upgrades, automate production, and watch your digital currency skyrocket.',
    thumbnail: '💻',
    color: '#ff6b81',
    tags: ['clicker', 'idle', 'strategy'],
    plays: '183K',
    rating: 4.9,
    controls: [
      { key: 'Click 💻', desc: 'Earn credits' },
      { key: 'Buy Upgrades', desc: 'Automate income' },
      { key: 'Prestige', desc: 'Reset for bonus multiplier' },
    ]
  },
];

/* ── Leaderboard Data (static) ── */
const LEADERBOARD = [
  { rank:1, name:'CyberNova',  avatar:'🦾', game:'Cyber Clicker',  score:'2,847,392', change:'up'  },
  { rank:2, name:'PixelGhost', avatar:'👻', game:'Pixel Runner',   score:'1,204,500', change:'up'  },
  { rank:3, name:'NeonBlade',  avatar:'⚔️', game:'Target Blitz',   score:'987,230',   change:'same'},
  { rank:4, name:'VoidRacer',  avatar:'🏁', game:'Neon Racer',     score:'842,110',   change:'down'},
  { rank:5, name:'StarHopper', avatar:'🌟', game:'Gravity Hopper', score:'721,800',   change:'up'  },
  { rank:6, name:'PuzzleMind', avatar:'🧩', game:'Hex Puzzle',     score:'634,500',   change:'down'},
];

/* ============================================================
   STATE
   ============================================================ */
let activeCategory = 'all';
let searchQuery    = '';

/* ============================================================
   DOM HELPERS
   ============================================================ */
const $ = id => document.getElementById(id);

/* ============================================================
   INIT — runs when DOM is ready
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Check for URL params (category or search from links)
  const params = new URLSearchParams(window.location.search);
  if (params.get('cat')) activeCategory = params.get('cat');
  if (params.get('q'))   searchQuery = params.get('q');

  renderGames();
  renderLeaderboard();
  initNav();
  initSearch();
  initFilterPills();
  initHamburger();

  // If a search param was passed, show the notice
  if (searchQuery) {
    updateSearchNotice(searchQuery);
  }
});

/* ============================================================
   GAME CARD RENDERING
   ============================================================ */
function renderGames() {
  const grid = $('gamesGrid');
  const noResults = $('noResults');
  const sectionTitle = $('sectionTitle');
  const gameCount = $('gameCount');

  if (!grid) return;

  // Filter games
  let filtered = GAMES.filter(g => {
    const catMatch = activeCategory === 'all' || g.category === activeCategory;
    const search   = searchQuery.toLowerCase().trim();
    const qMatch   = !search ||
      g.title.toLowerCase().includes(search) ||
      g.category.toLowerCase().includes(search) ||
      g.tags.some(t => t.includes(search));
    return catMatch && qMatch;
  });

  // Update section title
  const catLabel = activeCategory === 'all' ? 'All Games' :
    activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);
  sectionTitle.textContent = searchQuery ? `Results for "${searchQuery}"` : catLabel;
  gameCount.textContent = filtered.length + ' game' + (filtered.length === 1 ? '' : 's');

  if (filtered.length === 0) {
    grid.style.display = 'none';
    noResults.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  noResults.style.display = 'none';
  grid.innerHTML = '';

  filtered.forEach((game, i) => {
    const card = createGameCard(game, i);
    grid.appendChild(card);
  });
}

/* Build a single game card element */
function createGameCard(game, index) {
  const card = document.createElement('div');
  card.className = 'game-card';
  card.style.setProperty('--card-color', game.color);
  card.style.animationDelay = (index * 0.06) + 's';

  const stars = '★'.repeat(Math.round(game.rating)) + '☆'.repeat(5 - Math.round(game.rating));

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

  // Navigate to game page
  const goToGame = () => {
    window.location.href = `game.html?id=${game.id}`;
  };

  card.querySelector('.play-btn-big').addEventListener('click', goToGame);
  card.querySelector('.card-play-button').addEventListener('click', goToGame);
  card.querySelector('.card-thumb').addEventListener('click', goToGame);

  return card;
}

/* ============================================================
   LEADERBOARD
   ============================================================ */
function renderLeaderboard() {
  const lb = $('leaderboard');
  if (!lb) return;

  const ranks = ['gold', 'silver', 'bronze', '', '', ''];
  const changeArrow = { up: '▲', down: '▼', same: '–' };

  LEADERBOARD.forEach((row, i) => {
    const div = document.createElement('div');
    div.className = 'leaderboard-row';
    div.innerHTML = `
      <div class="lb-rank ${ranks[i]}">#${row.rank}</div>
      <div class="lb-player">
        <div class="lb-avatar">${row.avatar}</div>
        <div>
          <div class="lb-name">${row.name}</div>
          <div class="lb-game">${row.game}</div>
        </div>
      </div>
      <div class="lb-score">${row.score}</div>
      <div class="lb-change ${row.change}">${changeArrow[row.change]}</div>
    `;
    lb.appendChild(div);
  });
}

/* ============================================================
   NAVIGATION — category links
   ============================================================ */
function initNav() {
  // Desktop nav links
  document.querySelectorAll('.nav-link[data-cat]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const cat = link.dataset.cat;
      setCategory(cat);
      // Update active state on all nav links
      document.querySelectorAll('.nav-link[data-cat]').forEach(l => l.classList.remove('active'));
      document.querySelectorAll(`.nav-link[data-cat="${cat}"]`).forEach(l => l.classList.add('active'));
    });
  });
}

function setCategory(cat) {
  activeCategory = cat;
  searchQuery    = '';
  $('searchNotice').style.display = 'none';
  if ($('searchInput')) $('searchInput').value = '';
  if ($('mobileSearchInput')) $('mobileSearchInput').value = '';
  renderGames();
  // Update pills
  document.querySelectorAll('.pill').forEach(p => {
    p.classList.toggle('active', p.dataset.cat === cat);
  });
}

/* ============================================================
   FILTER PILLS
   ============================================================ */
function initFilterPills() {
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      setCategory(pill.dataset.cat);
      // Update nav links active state too
      document.querySelectorAll('.nav-link[data-cat]').forEach(l => l.classList.remove('active'));
      document.querySelectorAll(`.nav-link[data-cat="${pill.dataset.cat}"]`).forEach(l => l.classList.add('active'));
    });
  });
}

/* ============================================================
   SEARCH
   ============================================================ */
function initSearch() {
  const doSearch = (val) => {
    searchQuery = val.trim();
    activeCategory = 'all';
    document.querySelectorAll('.pill').forEach(p => p.classList.toggle('active', p.dataset.cat === 'all'));
    document.querySelectorAll('.nav-link[data-cat]').forEach(l => l.classList.toggle('active', l.dataset.cat === 'all'));
    updateSearchNotice(val.trim());
    renderGames();
  };

  [$('searchInput'), $('mobileSearchInput')].forEach(input => {
    if (!input) return;
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') doSearch(input.value);
    });
    // Live search as user types
    input.addEventListener('input', e => {
      if (input.value.trim().length >= 2 || input.value.trim().length === 0) {
        doSearch(input.value);
      }
    });
  });

  // Clear button
  const clearBtn = $('clearSearch');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchQuery = '';
      if ($('searchInput')) $('searchInput').value = '';
      if ($('mobileSearchInput')) $('mobileSearchInput').value = '';
      $('searchNotice').style.display = 'none';
      renderGames();
    });
  }
}

function updateSearchNotice(query) {
  const notice = $('searchNotice');
  const term   = $('searchTerm');
  if (!notice || !term) return;
  if (query) {
    term.textContent = `"${query}"`;
    notice.style.display = 'flex';
  } else {
    notice.style.display = 'none';
  }
}

/* ============================================================
   MOBILE HAMBURGER MENU
   ============================================================ */
function initHamburger() {
  const burger = $('hamburger');
  const menu   = $('mobileMenu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!burger.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
}
