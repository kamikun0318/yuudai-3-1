// ===== NAVIGATION HANDLING =====
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Navigation click handling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active to clicked link
            link.classList.add('active');
            
            // Close mobile menu
            navMenu.classList.remove('active');
            
            // Get section ID
            const sectionId = link.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Load initial content
    loadGames();
    loadTrendingVideos();
    loadAnime();
    loadManga();
});

// ===== SCROLL TO SECTION =====
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== YOUTUBE FUNCTIONALITY =====
function searchYoutube() {
    const searchInput = document.getElementById('youtubeSearch');
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('検索キーワードを入力してください');
        return;
    }

    showLoading(true);

    // Using the existing API from the backend
    fetch(`/api/search?q=${encodeURIComponent(query)}&page=0`)
        .then(res => res.json())
        .then(data => {
            displayYoutubeResults(data.items || []);
            showLoading(false);
        })
        .catch(err => {
            console.error('Search error:', err);
            alert('検索に失敗しました');
            showLoading(false);
        });
}

function displayYoutubeResults(videos) {
    const resultsContainer = document.getElementById('youtubeResults');
    
    if (!videos || videos.length === 0) {
        resultsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">動画が見つかりませんでした</p>';
        return;
    }

    resultsContainer.innerHTML = videos.map(video => `
        <div class="card" onclick="window.location.href='/video/${video.id}'">
            <img src="https://i.ytimg.com/vi/${video.id}/mqdefault.jpg" alt="${video.title}" class="card-image">
            <div class="card-content">
                <div class="card-title">${truncate(video.title, 40)}</div>
                <div class="card-description">${video.channelTitle || 'Channel'}</div>
                <div class="card-play">
                    <i class="fas fa-play"></i>
                    <span>再生</span>
                </div>
            </div>
        </div>
    `).join('');
}

function loadTrendingVideos() {
    showLoading(true);
    
    fetch('/api/trending?page=0')
        .then(res => res.json())
        .then(data => {
            displayYoutubeResults(data.items || []);
            showLoading(false);
        })
        .catch(err => {
            console.error('Trending error:', err);
            showLoading(false);
        });
}

// ===== GAMES FUNCTIONALITY =====
const SAMPLE_GAMES = [
    {
        name: 'Geometry Dash',
        icon: '🎮',
        category: 'Action',
        description: 'リズムに合わせてジャンプ'
    },
    {
        name: 'Cookie Clicker',
        icon: '🍪',
        category: 'Idle',
        description: 'クッキーをクリックして稼ぐ'
    },
    {
        name: 'Flappy Bird',
        icon: '🐦',
        category: 'Casual',
        description: 'パイプの間をくぐり抜ける'
    },
    {
        name: '2048',
        icon: '🔢',
        category: 'Puzzle',
        description: '数字を組み合わせる'
    },
    {
        name: 'Tic Tac Toe',
        icon: '⭕',
        category: 'Classic',
        description: 'AI との対戦'
    },
    {
        name: 'Snake Game',
        icon: '🐍',
        category: 'Retro',
        description: 'クラシックなスネークゲーム'
    },
    {
        name: 'Pac-Man',
        icon: '👾',
        category: 'Arcade',
        description: 'ゴーストを避けて進む'
    },
    {
        name: 'Asteroids',
        icon: '💥',
        category: 'Action',
        description: '隕石を破壊するシューティング'
    }
];

function loadGames() {
    const gamesGrid = document.getElementById('gamesGrid');
    
    if (!gamesGrid) return;
    
    gamesGrid.innerHTML = SAMPLE_GAMES.map((game, index) => `
        <div class="card" style="animation-delay: ${index * 0.05}s;" onclick="playGame('${game.name}')">
            <div style="padding: 40px; text-align: center; font-size: 48px; background: linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(255, 0, 110, 0.1));">
                ${game.icon}
            </div>
            <div class="card-content">
                <div class="card-title">${game.name}</div>
                <div class="card-description">${game.description}</div>
                <div style="margin-top: 10px; font-size: 12px; color: var(--primary);">
                    ${game.category}
                </div>
                <div class="card-play">
                    <i class="fas fa-play"></i>
                    <span>プレイ</span>
                </div>
            </div>
        </div>
    `).join('');
}

function playGame(gameName) {
    // Redirect to the game endpoint (if available)
    const gameMap = {
        'Geometry Dash': '/play?game=geometrydash',
        'Cookie Clicker': '/play?game=cookieclicker',
        'Flappy Bird': '/play?game=flappybird',
    };

    const url = gameMap[gameName] || '/play';
    alert(`${gameName} を起動しています...`);
}

// ===== ANIME FUNCTIONALITY =====
function loadAnime() {
    const animeGrid = document.getElementById('animeGrid');
    
    if (!animeGrid) return;
    
    const animeList = [
        { title: 'アニメ 1', description: '人気のアニメ作品' },
        { title: 'アニメ 2', description: '最新シーズン' },
        { title: 'アニメ 3', description: 'おすすめ作品' },
        { title: 'アニメ 4', description: 'ランキング' },
        { title: 'アニメ 5', description: 'NEW' },
        { title: 'アニメ 6', description: 'POPULAR' }
    ];

    animeGrid.innerHTML = animeList.map((anime, index) => `
        <div class="card" style="animation-delay: ${index * 0.05}s;">
            <img src="https://via.placeholder.com/250x150?text=${encodeURIComponent(anime.title)}" alt="${anime.title}" class="card-image">
            <div class="card-content">
                <div class="card-title">${anime.title}</div>
                <div class="card-description">${anime.description}</div>
                <div class="card-play">
                    <i class="fas fa-play"></i>
                    <span>視聴</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== MANGA FUNCTIONALITY =====
function loadManga() {
    const mangaGrid = document.getElementById('mangaGrid');
    
    if (!mangaGrid) return;
    
    const mangaList = [
        { title: 'マンガ 1', description: '人気作品' },
        { title: 'マンガ 2', description: '最新連載' },
        { title: 'マンガ 3', description: 'ランキング' },
        { title: 'マンガ 4', description: 'おすすめ' },
        { title: 'マンガ 5', description: 'TRENDING' },
        { title: 'マンガ 6', description: 'CLASSIC' }
    ];

    mangaGrid.innerHTML = mangaList.map((manga, index) => `
        <div class="card" style="animation-delay: ${index * 0.05}s;">
            <img src="https://via.placeholder.com/250x150?text=${encodeURIComponent(manga.title)}" alt="${manga.title}" class="card-image">
            <div class="card-content">
                <div class="card-title">${manga.title}</div>
                <div class="card-description">${manga.description}</div>
                <div class="card-play">
                    <i class="fas fa-book-open"></i>
                    <span>読む</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== UTILITY FUNCTIONS =====
function truncate(text, length) {
    return text.length > length ? text.substring(0, length) + '...' : text;
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('youtubeSearch');
        if (searchInput) searchInput.focus();
    }
    
    // Escape to close menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) navMenu.classList.remove('active');
    }
});

// ===== SMOOTH SCROLL UPDATES NAV =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });
});

console.log('✨ yuudai-3 loaded successfully!');
