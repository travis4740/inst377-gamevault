window.onload = function() {
    AOS.init();
    loadTrending();
    loadNewReleases();
    loadComingSoon();
};

function loadTrending() {
    fetch(`/api/games`)
        .then(res => res.json())
        .then(data => {
            const wrapper = document.getElementById('trending-wrapper');
            wrapper.innerHTML = '';

            data.results.forEach(game => {
                const slide = document.createElement('div');
                slide.classList.add('swiper-slide', 'trending-slide');
            slide.style.backgroundImage = `url(${game.background_image})`;
            slide.onclick = function() {
                window.location.href = `detail.html?id=${game.id}`;
            };

            const info = document.createElement('div');
            info.classList.add('trending-info');
            info.innerHTML = `
                <h3>${game.name}</h3>
                <p>⭐ ${game.rating}</p>
            `;

            slide.appendChild(info);
            wrapper.appendChild(slide);
        });

        new Swiper('.trending-swiper', {
            loop: true,
            autoplay: { delay: 3000, disableOnInteraction: false },
            slidesPerView: 3,
            spaceBetween: 0,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
    });
}

function loadNewReleases(genre) {
    const url = genre ? `/api/games/genre/${genre}` : '/api/games/new';
    fetch(url)
        .then(res => res.json())
        .then(data => {
            displayGames(data.results, 'games-grid');
        });
}

function loadComingSoon() {
    fetch('/api/games/upcoming')
        .then(res => res.json())
        .then(data => {
            displayGames(data.results, 'coming-soon-grid');
        });
}

function filterGenre(genre, btn) {
    document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadNewReleases(genre);
}

function searchGames() {
    const query = document.getElementById('search-input').value;
    if (!query) return;

    fetch(`/api/games/search?q=${query}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('new-releases-section').style.display = 'none';
            document.getElementById('coming-soon-section').style.display = 'none';
            document.getElementById('search-results-section').style.display = 'block';
            document.getElementById('clear-btn').style.display = 'block';
            displayGames(data.results, 'search-results-grid');
        });
}

function clearSearch() {
    document.getElementById('search-input').value = '';
    document.getElementById('search-results-section').style.display = 'none';
    document.getElementById('new-releases-section').style.display = 'block';
    document.getElementById('coming-soon-section').style.display = 'block';
    document.getElementById('clear-btn').style.display = 'none';
}

function displayGames(games, containerId) {
    const grid = document.getElementById(containerId);
    grid.innerHTML = '';

    if (!games || games.length === 0) {
        grid.innerHTML = '<p>No games found.</p>';
        return;
    }
    
    games.forEach((game, i) => {
        const card = document.createElement('div');
        card.classList.add('game-card');
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', String(i * 80));
        card.setAttribute('data-aos-duration', '600');
        card.onclick = function() {
            window.location.href = `detail.html?id=${game.id}`;
        };

        const img = document.createElement('img');
        img.src = game.background_image || 'https://via.placeholder.com/200x150';
        img.alt = game.name;

        const info = document.createElement('div');
        info.classList.add('game-card-info');

        const title = document.createElement('h3');
        title.textContent = game.name;

        const rating = document.createElement('p');
        rating.textContent = `⭐ ${game.rating}`;

        info.appendChild(title);
        info.appendChild(rating);
        card.appendChild(img);
        card.appendChild(info);
        grid.appendChild(card);
    });

    AOS.refresh();
}