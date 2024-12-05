// Add source selection handler
document.querySelectorAll('.source-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Update visual state
        document.querySelectorAll('.source-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Store selected source
        selectedSource = this.dataset.source;
    });
});

// fetchLyricsCombined.js
async function fetchLyricsCombined(artist, title) {
    const lyricsContainer = document.getElementById('lyrics-container');
    lyricsContainer.innerHTML = '<p class="loading">Searching lyrics...</p>';
    lyricsContainer.style.display = 'block';

    async function tryLyricsOvh() {
        try {
            const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
            const data = await response.json();
            if (data.lyrics) {
                return {
                    lyrics: data.lyrics,
                    source: 'lyrics.ovh'
                };
            }
        } catch (error) {
            console.log('lyrics.ovh failed, trying next source...');
            return null;
        }
    }

    async function tryLyrist() {
        try {
            const response = await fetch(`https://lyrist.vercel.app/api/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
            const data = await response.json();
            if (data.lyrics) {
                return {
                    lyrics: data.lyrics,
                    source: 'Lyrist API'
                };
            }
        } catch (error) {
            console.log('Lyrist API failed...');
            return null;
        }
    }

    async function tryLrclib() {
        try {
            // First search for the track
            const searchResponse = await fetch(`https://lrclib.net/api/search?track_name=${encodeURIComponent(title)}&artist_name=${encodeURIComponent(artist)}`);
            const searchResults = await searchResponse.json();

            if (searchResults && searchResults.length > 0) {
                // Get first match's ID
                const trackId = searchResults[0].id;
                
                // Get lyrics using track ID
                const lyricsResponse = await fetch(`https://lrclib.net/api/get/${trackId}`);
                const lyricsData = await lyricsResponse.json();

                if (lyricsData && lyricsData.plaintext) {
                    return {
                        lyrics: lyricsData.plaintext,
                        source: 'LRCLIB'
                    };
                }
            }
        } catch (error) {
            console.log('LRCLIB API failed...');
            return null;
        }
    }

    try {
        let result = null;

        switch(selectedSource) {
            case 'lyrics.ovh':
                result = await tryLyricsOvh();
                break;
            case 'lyrist':
                result = await tryLyrist();
                break;
            case 'lrclib':
                result = await tryLrclib();
                break;
            default: // 'auto'
                result = await tryLyricsOvh();
                if (!result) {
                    result = await tryLyrist();
                    if (!result) {
                        result = await tryLrclib();
                    }
                }
        }

        if (result) {
            lyricsContainer.innerHTML = `
                <div class="lyrics-content">
                    <div class="lyrics-header">
                        <h2>${artist} - ${title}</h2>
                        <button onclick="closeLyrics()" class="close-btn">×</button>
                    </div>
                    <pre>${result.lyrics}</pre>
                    <div class="lyrics-source">Source: ${result.source}</div>
                </div>`;
        } else {
            lyricsContainer.innerHTML = '<p class="error">Lyrics not found from any source</p>';
        }
    } catch (error) {
        console.error('Lyrics error:', error);
        lyricsContainer.innerHTML = '<p class="error">Failed to fetch lyrics from all sources</p>';
    }
}

function closeLyrics() {
    document.getElementById('lyrics-container').style.display = 'none';
}