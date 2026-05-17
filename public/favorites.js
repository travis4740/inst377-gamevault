window.onload = function() {
    loadFavorites();
};

function loadFavorites() {
    fetch(`/api/favorites`)
        .then(res => res.json())
        .then(data => {
            displayFavorites(data);
        });
}

function displayFavorites(favorites) {
    const grid = document.getElementById('favorites-grid');
    grid.innerHTML = '';

    if (!favorites || favorites.length === 0) {
        grid.innerHTML = '<p class="no-favorites">No favorites saved yet. Go find some games!</p>';
        return;
    }

    favorites.forEach(game => {
        const card = document.createElement('div');
        card.classList.add('game-card');

        const img = document.createElement('img');
        img.src = game.cover_image || 'https://via.placeholder.com/200x150';
        img.alt = game.name;
        img.onclick = function() {
            window.location.href = `detail.html?id=${game.game_id}`;
        };

        const info = document.createElement('div')
        info.classList.add('game-card-info');

        const title = document.createElement('h3');
        title.textContent = game.name;

        const date = document.createElement('p');
        date.textContent = `Saved: ${new Date(game.created_at).toLocaleDateString()}`;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '🗑️ Remove';
        removeBtn.classList.add('remove-btn');
        removeBtn.onclick = function() {
            removeFavorite(game.id);
        };

        info.appendChild(title);
        info.appendChild(date);
        info.appendChild(removeBtn);
        card.appendChild(img);
        card.appendChild(info);
        grid.appendChild(card);
    });
}

function removeFavorite(id) {
    fetch(`/api/favorites/${id}`, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(() => {
            loadFavorites();
        });
}