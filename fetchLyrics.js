async function fetchLyrics(artist, title) {
    const lyricsDiv = document.getElementById('lyrics');
    lyricsDiv.innerHTML = '<p class="loading">Loading lyrics...</p>';

    try {
        // Using lyrics.ovh API (free and no API key required)
        const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
        const data = await response.json();

        if (data.lyrics) {
            lyricsDiv.innerHTML = `
                <div class="lyrics-content">
                    <h2>${artist} - ${title}</h2>
                    <pre>${data.lyrics}</pre>
                </div>`;
        } else {
            lyricsDiv.innerHTML = '<p class="error">Lyrics not found</p>';
        }
    } catch (error) {
        lyricsDiv.innerHTML = '<p class="error">Error fetching lyrics</p>';
        console.error('Lyrics error:', error);
    }
}