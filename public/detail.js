window.onload = function() {
    AOS.init();
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
        loadGamesDetail(id);
    }
};

function loadGamesDetail(id) {
    fetch(`/api/games/${id}`)
        .then(res => res.json())
        .then(game => {
            displayGamesDetail(game);
        });
}

function displayGamesDetail(game) {
    const container = document.getElementById('game-detail');

    container.innerHTML = `
    <div class="detail-hero">
      <img src="${game.background_image || 'https://via.placeholder.com/300x200'}" alt="${game.name}">
      <div class="detail-info">
        <h1>${game.name}</h1>
        <p class="rating">⭐ ${game.rating} / 5</p>
        <p>Released: ${game.released || 'N/A'}</p>
        <p>Genres: ${game.genres ? game.genres.map(g => g.name).join(', ') : 'N/A'}</p>
        <p>Platforms: ${game.platforms ? game.platforms.map(p => p.platform.name).join(', ') : 'N/A'}</p>
        <p>Metacritic: ${game.metacritic || 'N/A'}</p>
        <br>
        <button class="btn" onclick="saveToFavorites(${game.id}, '${game.name.replace(/'/g, "")}', '${game.background_image}')">❤️ Save to Favorites</button>
      </div>
    </div>

    <h2>Description</h2>
    <p style="color: #ccc; line-height: 1.8; margin-bottom: 40px;">${game.description_raw || 'No description available.'}</p>

    <h2>Screenshots</h2>
    <div id="screenshots" class="screenshots">Loading screenshots...</div>

    <h2>Similar Games</h2>
    <div id="similar-games" class="games-grid">Loading similar games...</div>
  `;

  loadScreenshots(game.id);
  loadSimilarGames(game.id);
}

function loadScreenshots(id) {
    fetch(`/api/games/${id}/screenshots`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('screenshots');
            container.innerHTML = '';
            if (!data.results || data.results.length === 0) {
                container.innerHTML = '<p>No screenshots available.</p>';
                return;
            }
            data.results.forEach(shot => {
                const img = document.createElement('img');
                img.src = shot.image;
                img.alt = 'Screenshot';
                container.appendChild(img);
            });
        });
}

function loadSimilarGames(id) {
    fetch(`/api/games/${id}/similar`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('similar-games');
            container.innerHTML = '';
            if (!data.results || data.results.length === 0) {
                container.innerHTML = '<p>No similar games found.</p>';
                return;
            }
            data.results.forEach((game, i) => {
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

                const info = document.createElement('div')
                info.classList.add('game-card-info');

                const title = document.createElement('h3');
                title.textContent = game.name;

                info.appendChild(title);
                card.appendChild(img);
                card.appendChild(info);
                container.appendChild(card);
            });

            AOS.refresh();
        });
}

function saveToFavorites(game_id, name, cover_image) {
    fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id, name, cover_image })
    })
        .then(res => res.json())
        .then(data => {
            alert(`${name} saved to favorites!`);
        });
}