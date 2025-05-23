/**
 * @file Script to fetch and display music data from Last.fm API.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ================================
    // CONFIGURATION
    // ================================
    /**
     * @constant {string} API_KEY - Your Last.fm API key.
     * ЗАМЕНИТЕ 'YOUR_API_KEY' НА ВАШ КЛЮЧ API
     */
    const API_KEY = '25b8590eafb0eb154165a4b95c013fc3'; // <<<--- ВСТАВЬТЕ СЮДА ВАШ API КЛЮЧ!
    const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

    // ================================
    // DOM ELEMENTS
    // ================================
    const artistGrid = document.querySelector('.artist-grid');
    const trackGrid = document.querySelector('.track-grid');
    const searchInput = document.querySelector('.search-bar__input');
    const searchButton = document.querySelector('.search-bar__button');
    const popularTracksTitle = document.querySelector('.popular-tracks .section-title');
    const hotArtistsTitle = document.querySelector('.hot-artists .section-title');
    const mainContent = document.querySelector('.main-content');


    // ================================
    // UTILITY FUNCTIONS
    // ================================

    /**
     * Displays an error message to the user.
     * @param {string} message - The error message to display.
     * @param {HTMLElement} [sectionElement] - The HTML element related to the error. If null, displays a global message.
     */
    function displayError(message, sectionElement = null) {
        console.error('Displaying Error:', message);
        if (sectionElement) {
            sectionElement.innerHTML = `<p class="error-message" style="color: red; text-align: center; padding: 10px;">${message}</p>`;
        } else {
            let errorContainer = mainContent.querySelector('.global-error-message');
            if (!errorContainer) {
                errorContainer = document.createElement('div');
                errorContainer.className = 'global-error-message';
                errorContainer.style.color = 'red';
                errorContainer.style.backgroundColor = '#ffebee';
                errorContainer.style.border = '1px solid red';
                errorContainer.style.padding = '10px';
                errorContainer.style.marginBottom = '15px';
                errorContainer.style.textAlign = 'center';
                mainContent.insertBefore(errorContainer, mainContent.firstChild);
            }
            errorContainer.textContent = message;
        }
    }

    /**
     * Fetches data from the Last.fm API.
     * @async
     * @param {object} params - API method parameters.
     * @returns {Promise<object>} The JSON response from the API.
     * @throws {Error} If the network response is not ok or API returns an error.
     */
    async function fetchData(params) {
        if (API_KEY === 'YOUR_API_KEY') {
            const errorMsg = 'КРИТИЧЕСКАЯ ОШИБКА: API ключ не настроен. Пожалуйста, укажите ваш API_KEY в файле api.js.';
            displayError(errorMsg);
            throw new Error(errorMsg);
        }

        const queryParams = new URLSearchParams({
            ...params,
            api_key: API_KEY,
            format: 'json',
        });

        const url = `${BASE_URL}?${queryParams}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Network error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            if (data.error) {
                // Last.fm API errors have a code and a message property
                throw new Error(`Last.fm API error ${data.error}: ${data.message}`);
            }
            return data;
        } catch (error) {
            console.error(`Workspace data error for params ${JSON.stringify(params)}:`, error);
            // Don't display error here, let calling function handle UI for specific section
            throw error;
        }
    }

    /**
     * Extracts an image URL from the Last.fm image array.
     * Tries to find sizes in order: extralarge, large, medium, small, then any.
     * @param {Array<object>} imageArray - Array of image objects from API.
     * @param {string} [defaultText=""] - Text for placeholder if no image.
     * @param {string} [placeholderSize="130"] - Size for via.placeholder.com.
     * @returns {string} The image URL or a placeholder URL.
     */
    function getImageUrl(imageArray, defaultText = "", placeholderSize = "130") {
        if (imageArray && imageArray.length > 0) {
            const sizes = ['extralarge', 'large', 'medium', 'small'];
            for (const size of sizes) {
                const img = imageArray.find(i => i.size === size && i['#text']);
                if (img) return img['#text'];
            }
            // If specific sizes not found, try to get any image that has a URL
            const anyImg = imageArray.find(i => i['#text']);
            if (anyImg) return anyImg['#text'];
        }
        const placeholderBase = placeholderSize === "64" ?
            `https://via.placeholder.com/${placeholderSize}/EEEEEE/808080?text=Art` :
            `https://via.placeholder.com/${placeholderSize}/DDDDDD/808080?text=${encodeURIComponent(defaultText || 'No Image')}`;
        return placeholderBase;
    }


    // ================================
    // TAGS FUNCTIONS
    // ================================

    /**
     * Fetches top tags for an artist.
     * @async
     * @param {string} artistName - The name of the artist.
     * @returns {Promise<Array<object>>} A list of tag objects, or empty array on error.
     */
    async function fetchArtistTopTags(artistName) {
        try {
            const data = await fetchData({ method: 'artist.getTopTags', artist: artistName, autocorrect: 1 });
            return data.toptags.tag ? (Array.isArray(data.toptags.tag) ? data.toptags.tag : [data.toptags.tag]).slice(0, 3) : []; // Max 3 tags
        } catch (error) {
            // console.warn(`Could not fetch tags for artist ${artistName}: ${error.message}`);
            return []; // Return empty array on error, don't break item display
        }
    }

    /**
     * Fetches top tags for a track.
     * @async
     * @param {string} trackName - The name of the track.
     * @param {string} artistName - The name of the artist.
     * @returns {Promise<Array<object>>} A list of tag objects, or empty array on error.
     */
    async function fetchTrackTopTags(trackName, artistName) {
        try {
            const data = await fetchData({ method: 'track.getTopTags', track: trackName, artist: artistName, autocorrect: 1 });
            return data.toptags.tag ? (Array.isArray(data.toptags.tag) ? data.toptags.tag : [data.toptags.tag]).slice(0, 3) : []; // Max 3 tags
        } catch (error) {
            // console.warn(`Could not fetch tags for track ${trackName} by ${artistName}: ${error.message}`);
            return [];
        }
    }

    /**
     * Creates HTML for displaying tags.
     * @param {Array<object>} tags - Array of tag objects.
     * @returns {string} HTML string for tags.
     */
    function createTagsHtml(tags) {
        if (!tags || tags.length === 0) return '';
        return `
      <div class="item-tags" style="font-size: 0.8em; color: #555; margin-top: 5px;">
        ${tags.map(tag => `<span class="tag" style="background-color: #eee; padding: 2px 5px; border-radius: 3px; margin-right: 3px;">${tag.name}</span>`).join(' ')}
      </div>
    `;
    }

    // ================================
    // ARTIST FUNCTIONS
    // ================================

    /**
     * Fetches top artists from Last.fm.
     * @async
     * @returns {Promise<Array<object>>} A list of top artist objects.
     */
    async function fetchTopArtists() {
        try {
            const data = await fetchData({ method: 'chart.getTopArtists', limit: 12 });
            return data.artists.artist;
        } catch (error) {
            displayError(`Не удалось загрузить популярных исполнителей: ${error.message}. Попробуйте обновить страницу.`, artistGrid);
            return [];
        }
    }

    /**
     * Displays artists in the grid.
     * @param {Array<object>} artists - Array of artist objects.
     * @param {boolean} [fetchTags=false] - Whether to fetch tags for each artist.
     */
    async function displayArtists(artists, fetchTags = false) {
        if (!artistGrid) return;
        artistGrid.innerHTML = '';

        if (!artists || artists.length === 0) {
            if (!artistGrid.querySelector('.error-message')) { // Avoid double error messages
                artistGrid.innerHTML = '<p style="text-align: center;">Исполнители не найдены.</p>';
            }
            return;
        }

        // Use Promise.all to fetch all tags concurrently if needed, then render
        const artistPromises = artists.map(async (artist) => {
            const imageUrl = getImageUrl(artist.image, artist.name, "130");
            let tagsHtml = '';
            if (fetchTags) {
                const tags = await fetchArtistTopTags(artist.name);
                tagsHtml = createTagsHtml(tags);
            }

            const artistCard = document.createElement('div');
            artistCard.className = 'artist-card';
            artistCard.innerHTML = `
        <img src="${imageUrl}" alt="${artist.name}" class="artist-card__image">
        <p class="artist-card__name">${artist.name}</p>
        ${tagsHtml}
      `;
            return artistCard;
        });

        const artistElements = await Promise.all(artistPromises);
        artistElements.forEach(card => artistGrid.appendChild(card));
    }

    // ================================
    // TRACK FUNCTIONS
    // ================================

    /**
     * Fetches top tracks from Last.fm.
     * @async
     * @returns {Promise<Array<object>>} A list of top track objects.
     */
    async function fetchTopTracks() {
        try {
            const data = await fetchData({ method: 'chart.getTopTracks', limit: 18 });
            return data.tracks.track;
        } catch (error) {
            displayError(`Не удалось загрузить популярные треки: ${error.message}. Попробуйте обновить страницу.`, trackGrid);
            return [];
        }
    }

    /**
     * Displays tracks in the grid.
     * @param {Array<object>} tracks - Array of track objects.
     * @param {string} [title="Popular tracks"] - The title for the tracks section.
     * @param {boolean} [fetchTags=false] - Whether to fetch tags for each track.
     */
    async function displayTracks(tracks, title = "Popular tracks", fetchTags = false) {
        if (!trackGrid || !popularTracksTitle) return;

        popularTracksTitle.textContent = title;
        trackGrid.innerHTML = '';

        if (!tracks || tracks.length === 0) {
            if (!trackGrid.querySelector('.error-message')) {
                trackGrid.innerHTML = '<p style="text-align: center;">Треки не найдены.</p>';
            }
            return;
        }

        const trackPromises = tracks.map(async (track) => {
            const imageUrl = getImageUrl(track.image, `${track.name} - ${track.artist.name || track.artist}`, "64");
            let tagsHtml = '';
            if (fetchTags) {
                const tags = await fetchTrackTopTags(track.name, track.artist.name || track.artist);
                tagsHtml = createTagsHtml(tags);
            }

            const trackItem = document.createElement('div');
            trackItem.className = 'track-item';
            trackItem.innerHTML = `
        <img src="${imageUrl}" alt="${track.name}" class="track-item__album-art">
        <div class="track-item__info">
          <p class="track-item__title">${track.name}</p>
          <p class="track-item__artist">${track.artist.name || track.artist}</p>
          ${tagsHtml}
        </div>
      `;
            return trackItem;
        });
        const trackElements = await Promise.all(trackPromises);
        trackElements.forEach(item => trackGrid.appendChild(item));
    }

    // ================================
    // SEARCH FUNCTIONS
    // ================================

    /**
     * Searches for artists on Last.fm.
     * @async
     * @param {string} query - The search query.
     * @returns {Promise<Array<object>>} A list of artist objects from search results.
     */
    async function searchArtistsAPI(query) {
        try {
            const data = await fetchData({ method: 'artist.search', artist: query, limit: 12 });
            return data.results.artistmatches.artist;
        } catch (error) {
            displayError(`Ошибка при поиске исполнителей "${query}": ${error.message}`, artistGrid);
            return [];
        }
    }

    /**
     * Searches for tracks on Last.fm.
     * @async
     * @param {string} query - The search query.
     * @returns {Promise<Array<object>>} A list of track objects from search results.
     */
    async function searchTracksAPI(query) {
        try {
            const data = await fetchData({ method: 'track.search', track: query, limit: 18 });
            return data.results.trackmatches.track;
        } catch (error) {
            displayError(`Ошибка при поиске треков "${query}": ${error.message}`, trackGrid);
            return [];
        }
    }

    /**
     * Handles the search functionality.
     * @async
     */
    async function handleSearch() {
        const query = searchInput.value.trim();
        // Clear previous global errors
        const globalError = mainContent.querySelector('.global-error-message');
        if (globalError) globalError.remove();

        if (!query) {
            // If search is empty, reload popular artists and tracks with tags
            hotArtistsTitle.textContent = "Hot right now";
            popularTracksTitle.textContent = "Popular tracks";
            loadPopularArtists(true); // Fetch with tags
            loadPopularTracks(true); // Fetch with tags
            return;
        }

        hotArtistsTitle.textContent = `Результаты поиска исполнителей для "${query}"`;
        popularTracksTitle.textContent = `Результаты поиска треков для "${query}"`;

        // Perform searches concurrently
        // For search results, let's not fetch tags by default to keep it faster.
        // Set fetchTags to false for search results display.
        const artistsPromise = searchArtistsAPI(query).then(artists => displayArtists(artists, false));
        const tracksPromise = searchTracksAPI(query).then(tracks => displayTracks(tracks, `Результаты поиска треков для "${query}"`, false));

        try {
            await Promise.all([artistsPromise, tracksPromise]);
        } catch (e) {
            // Errors are already displayed by individual search/display functions
            console.error("Error during search operation:", e);
        }
    }

    // ================================
    // INITIALIZATION
    // ================================

    /**
     * Loads popular artists onto the page.
     * @async
     * @param {boolean} [withTags=true] - Whether to fetch tags for artists.
     */
    async function loadPopularArtists(withTags = true) {
        try {
            const artists = await fetchTopArtists();
            await displayArtists(artists, withTags);
        } catch (e) { /* Error already handled by fetchTopArtists or displayArtists */ }
    }

    /**
     * Loads popular tracks onto the page.
     * @async
     * @param {boolean} [withTags=true] - Whether to fetch tags for tracks.
     */
    async function loadPopularTracks(withTags = true) {
        try {
            const tracks = await fetchTopTracks();
            await displayTracks(tracks, "Popular tracks", withTags);
        } catch (e) { /* Error already handled by fetchTopTracks or displayTracks */ }
    }

    /**
     * Initializes the application.
     */
    async function init() {
        if (API_KEY === 'YOUR_API_KEY') {
            displayError('КРИТИЧЕСКАЯ ОШИБКА: API ключ не настроен. Пожалуйста, укажите ваш API_KEY в файле api.js.');
            if (searchButton) searchButton.disabled = true;
            if (searchInput) searchInput.disabled = true;
            // Clear placeholder content if API key is missing, as it won't be replaced
            if (artistGrid) artistGrid.innerHTML = '';
            if (trackGrid) trackGrid.innerHTML = '';
            return;
        }

        // Load initial data with tags
        // Using Promise.all to load concurrently, but it doesn't strictly matter for UX here
        // as they populate different sections.
        Promise.all([
            loadPopularArtists(true),
            loadPopularTracks(true)
        ]).catch(err => {
            // This catch is for any unhandled rejection from Promise.all itself,
            // though individual load functions should handle their own UI errors.
            console.error("Error during initial data load:", err);
            displayError("Произошла ошибка при загрузке начальных данных. Пожалуйста, проверьте консоль и попробуйте обновить страницу.");
        });


        if (searchButton && searchInput) {
            searchButton.addEventListener('click', handleSearch);
            searchInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    handleSearch();
                }
            });
        } else {
            console.warn("Search elements not found in the DOM.");
        }
    }

    // Start the application
    init();
});