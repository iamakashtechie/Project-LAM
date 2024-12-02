document.getElementById('searchInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchSongs();
    }
});

async function searchSongs() {
    const searchInput = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!searchInput) {
        resultsDiv.innerHTML = '<p class="error">Please enter a search term</p>';
        return;
    }

    try {
        // Get token
        const tokenRes = await fetch('/api/token');
        if (!tokenRes.ok) {
            const errorData = await tokenRes.json();
            throw new Error(`Token error: ${errorData.error}`);
        }

        const tokenData = await tokenRes.json();
        if (!tokenData.token) {
            throw new Error('No token received');
        }
        
        // Search tracks
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=track&limit=10`, {
            headers: {
                'Authorization': `Bearer ${tokenData.token}`
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Search failed: ${errorText}`);
        }
        
        const data = await response.json();
        
        if (data.tracks.items.length === 0) {
            resultsDiv.innerHTML = '<p class="no-results">No tracks found</p>';
            return;
        }

        resultsDiv.innerHTML = data.tracks.items
        .map(track => `
            <div class="track-item">
                <img src="${track.album.images[1]?.url || ''}" alt="${track.name}">
                <div class="track-info">
                    <h3>${track.name}</h3>
                    <p class="artist">${track.artists.map(artist => artist.name).join(', ')}</p>
                    <p class="album">${track.album.name}</p>
                    <div class="track-buttons">
                        <a href="${track.external_urls.spotify}" target="_blank" class="spotify-link">Play on Spotify</a>
                        <button class="lyrics-btn" onclick="fetchLyricsCombined('${track.artists[0].name.replace(/'/g, "\\'")}', '${track.name.replace(/'/g, "\\'")}')">Show Lyrics</button>
                    </div>
                </div>
            </div>
        `).join('');
            
    } catch (error) {
        console.error('Search error:', error);
        resultsDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}