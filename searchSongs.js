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
        const tokenData = await tokenRes.json();
        
        // Search tracks
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=track&limit=10`, {
            headers: {
                'Authorization': `Bearer ${tokenData.token}`
            }
        });
        
        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        
        if (data.tracks.items.length === 0) {
            resultsDiv.innerHTML = '<p class="no-results">No tracks found</p>';
            return;
        }

        resultsDiv.innerHTML = data.tracks.items
            .map(track => `
                <div class="track-item" onclick="fetchLyrics('${track.artists[0].name.replace(/'/g, "\\'")}', '${track.name.replace(/'/g, "\\'")}')">
                    <img src="${track.album.images[1]?.url || ''}" alt="${track.name}">
                    <div class="track-info">
                        <h3>${track.name}</h3>
                        <p class="artist">${track.artists.map(artist => artist.name).join(', ')}</p>
                        <p class="album">${track.album.name}</p>
                        <a href="${track.external_urls.spotify}" target="_blank" class="spotify-link" onclick="event.stopPropagation()">Play on Spotify</a>
                    </div>
                </div>
            `).join('');
            
    } catch (error) {
        resultsDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    }
}