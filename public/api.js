/**
 * @file Script to fetch and display music data from Last.fm API,
 * including extended search and tags.
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
    const MAX_TAGS_DISPLAYED = 3; // Максимум тегов для отображения под элементом
    const SEARCH_RESULTS_LIMIT = 6; // Лимит результатов для каждого типа поиска

    // ================================
    // DOM ELEMENTS
    // ================================
    const popularArtistsGrid = document.querySelector('.hot-artists .artist-grid');
    const popularTracksGrid = document.querySelector('.popular-tracks .track-grid');

    const searchInput = document.querySelector('.search-bar__input');
    const searchButton = document.querySelector('.search-bar__button');

    const popularContentSections = document.querySelectorAll('.popular-content');
    const searchResultsSections = document.querySelectorAll('.search-results-section');

    const searchArtistsGrid = document.querySelector('.search-results-artists .artist-grid-search');
    const searchAlbumsGrid = document.querySelector('.search-results-albums .album-grid-search');
    const searchTracksGrid = document.querySelector('.search-results-tracks .track-grid-search');

    const searchArtistsTitle = document.querySelector('.search-results-title-artists');
    const searchAlbumsTitle = document.querySelector('.search-results-title-albums');
    const searchTracksTitle = document.querySelector('.search-results-title-tracks');

    const pageTitle = document.querySelector('.page-title');


    // ================================
    // UTILITY FUNCTIONS
    // ================================

    /**
     * Displays an error message to the user.
     * @param {string} message - The error message to display.
     * @param {HTMLElement} [sectionElement=null] - The HTML element related to the error. If null, uses a general error display.
     */
    function displayError(message, sectionElement = null) {
        console.error('Displaying error:', message);
        if (sectionElement && typeof sectionElement.D === 'function') { // Check if sectionElement is a grid that can be cleared
            sectionElement.innerHTML = `<p class="error-message">${message}</p>`;
        } else {
            // Fallback for general errors or when sectionElement is not a grid
            const errorContainer = document.createElement('div');
            errorContainer.className = 'error-message global-error-message';
            errorContainer.textContent = message;
            errorContainer.style.marginBottom = '15px';

            const mainContent = document.querySelector('.main-content');
            const existingGlobalError = mainContent.querySelector('.global-error-message');
            if (existingGlobalError) {
                existingGlobalError.remove();
            }
            mainContent.insertBefore(errorContainer, pageTitle.nextSibling); // Insert after page title
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
        const queryParams = new URLSearchParams({
            ...params,
            api_key: API_KEY,
            format: 'json',
        });
        const url = `${BASE_URL}?${queryParams}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Network Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            if (data.error) {
                throw new Error(`Last.fm API Error ${data.error}: ${data.message}`);
            }
            return data;
        } catch (error) {
            console.error(`Workspace data error for params ${JSON.stringify(params)}:`, error);
            throw error;
        }
    }

    /**
     * Clears content of specified grid elements.
     * @param {Array<HTMLElement>} grids - Array of grid elements to clear.
     */
    function clearGrids(grids) {
        grids.forEach(grid => {
            if (grid) grid.innerHTML = '';
        });
    }

    // ================================
    // TAGS FUNCTIONS
    // ================================

    /**
     * Fetches top tags for an artist.
     * @async
     * @param {string} artistName - The name of the artist.
     * @returns {Promise<Array<object>>} A list of tag objects.
     */
    async function fetchArtistTags(artistName) {
        try {
            const data = await fetchData({ method: 'artist.getTopTags', artist: artistName });
            return data.toptags.tag || [];
        } catch (error) {
            console.warn(`Could not fetch tags for artist ${artistName}: ${error.message}`);
            return []; // Return empty array on error
        }
    }

    /**
     * Fetches top tags for a track.
     * @async
     * @param {string} trackName - The name of the track.
     * @param {string} artistName - The name of the artist.
     * @returns {Promise<Array<object>>} A list of tag objects.
     */
    async function fetchTrackTags(trackName, artistName) {
        try {
            const data = await fetchData({ method: 'track.getTopTags', track: trackName, artist: artistName });
            return data.toptags.tag || [];
        } catch (error) {
            console.warn(`Could not fetch tags for track ${trackName} by ${artistName}: ${error.message}`);
            return [];
        }
    }

    /**
     * Creates and appends a tags container to a DOM element.
     * @param {HTMLElement} parentElement - The element to append tags to.
     * @param {Array<object>} tags - Array of tag objects from API.
     */
    function displayTags(parentElement, tags) {
        if (!tags || tags.length === 0) return;

        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'tags-container';

        tags.slice(0, MAX_TAGS_DISPLAYED).forEach(tag => {
            const tagElement = document.createElement('a');
            tagElement.className = 'tag';
            tagElement.href = tag.url || '#'; // Link to Last.fm tag page or fallback
            tagElement.textContent = tag.name;
            tagElement.target = '_blank'; // Open in new tab
            tagsContainer.appendChild(tagElement);
        });
        parentElement.appendChild(tagsContainer);
    }

    // ================================
    // ARTIST FUNCTIONS
    // ================================
    /**
     * Displays artists in the specified grid.
     * @param {Array<object>} artists - Array of artist objects.
     * @param {HTMLElement} gridElement - The grid element to display artists in.
     */
    function renderArtists(artists, gridElement) {
        if (!gridElement) return;
        gridElement.innerHTML = '';

        if (!artists || artists.length === 0) {
            gridElement.innerHTML = '<p>Исполнители не найдены.</p>';
            return;
        }

        artists.forEach(artist => {
            const artistCard = document.createElement('div');
            artistCard.className = 'artist-card';

            const imageUrl = artist.image.find(img => img.size === 'extralarge')?.['#text'] ||
                artist.image.find(img => img.size === 'large')?.['#text'] ||
                `https://via.placeholder.com/130/DDDDDD/808080?text=${encodeURIComponent(artist.name)}`;

            const artistCardContent = document.createElement('div'); // Wrapper for content before tags
            artistCardContent.innerHTML = `
        <img src="${imageUrl}" alt="${artist.name}" class="artist-card__image">
        <p class="artist-card__name">${artist.name}</p>
      `;
            artistCard.appendChild(artistCardContent);
            gridElement.appendChild(artistCard);

            // Asynchronously fetch and display tags
            fetchArtistTags(artist.name).then(tags => {
                displayTags(artistCardContent, tags); // Append tags inside content div
            }).catch(err => console.warn(`Failed to load tags for ${artist.name}`, err));
        });
    }

    async function fetchTopArtists() {
        try {
            const data = await fetchData({ method: 'chart.getTopArtists', limit: 12 });
            return data.artists.artist;
        } catch (error) {
            displayError('Не удалось загрузить популярных исполнителей.', popularArtistsGrid);
            return [];
        }
    }

    // ================================
    // ALBUM FUNCTIONS
    // ================================
    /**
     * Displays albums in the specified grid.
     * @param {Array<object>} albums - Array of album objects.
     * @param {HTMLElement} gridElement - The grid element to display albums in.
     */
    function renderAlbums(albums, gridElement) {
        if (!gridElement) return;
        gridElement.innerHTML = '';

        if (!albums || albums.length === 0) {
            gridElement.innerHTML = '<p>Альбомы не найдены.</p>';
            return;
        }

        albums.forEach(album => {
            const albumCard = document.createElement('div');
            albumCard.className = 'album-card';

            const imageUrl = album.image.find(img => img.size === 'extralarge')?.['#text'] ||
                album.image.find(img => img.size === 'large')?.['#text'] ||
                `https://via.placeholder.com/150/DDDDDD/808080?text=${encodeURIComponent(album.name)}`;

            albumCard.innerHTML = `
        <img src="${imageUrl}" alt="${album.name}" class="album-card__image">
        <p class="album-card__name">${album.name}</p>
        <p class="album-card__artist">${album.artist}</p>
      `;
            // Note: Tags for albums are not explicitly requested here but could be added similarly
            // using album.getTopTags (requires artist and album name) if desired.
            gridElement.appendChild(albumCard);
        });
    }

    // ================================
    // TRACK FUNCTIONS
    // ================================
    /**
     * Displays tracks in the specified grid.
     * @param {Array<object>} tracks - Array of track objects.
     * @param {HTMLElement} gridElement - The grid element to display tracks in.
     */
    function renderTracks(tracks, gridElement) {
        if (!gridElement) return;
        gridElement.innerHTML = '';

        if (!tracks || tracks.length === 0) {
            gridElement.innerHTML = '<p>Треки не найдены.</p>';
            return;
        }

        tracks.forEach(track => {
            const trackItem = document.createElement('div');
            trackItem.className = 'track-item';

            const imageUrl = track.image?.find(img => img.size === 'medium')?.['#text'] ||
                track.image?.find(img => img.size === 'large')?.['#text'] ||
                track.image?.find(img => img.size !== '')?.['#text'] ||
                `https://via.placeholder.com/64/EEEEEE/808080?text=Art`;

            const trackInfo = document.createElement('div');
            trackInfo.className = 'track-item__info';
            trackInfo.innerHTML = `
        <p class="track-item__title">${track.name}</p>
        <p class="track-item__artist">${typeof track.artist === 'string' ? track.artist : track.artist.name}</p>
      `;

            trackItem.innerHTML = `<img src="${imageUrl}" alt="${track.name}" class="track-item__album-art">`;
            trackItem.appendChild(trackInfo);
            gridElement.appendChild(trackItem);

            // Asynchronously fetch and display tags
            const artistNameForTags = typeof track.artist === 'string' ? track.artist : track.artist.name;
            fetchTrackTags(track.name, artistNameForTags).then(tags => {
                displayTags(trackInfo, tags);
            }).catch(err => console.warn(`Failed to load tags for ${track.name}`, err));
        });
    }

    async function fetchTopTracks() {
        try {
            const data = await fetchData({ method: 'chart.getTopTracks', limit: 18 });
            return data.tracks.track;
        } catch (error) {
            displayError('Не удалось загрузить популярные треки.', popularTracksGrid);
            return [];
        }
    }

    // ================================
    // SEARCH FUNCTIONS
    // ================================
    async function searchArtists(query) {
        try {
            const data = await fetchData({ method: 'artist.search', artist: query, limit: SEARCH_RESULTS_LIMIT });
            return data.results.artistmatches.artist || [];
        } catch (error) {
            displayError(`Ошибка при поиске исполнителей: ${error.message}`, searchArtistsGrid);
            return [];
        }
    }

    async function searchAlbums(query) {
        try {
            const data = await fetchData({ method: 'album.search', album: query, limit: SEARCH_RESULTS_LIMIT });
            return data.results.albummatches.album || [];
        } catch (error) {
            displayError(`Ошибка при поиске альбомов: ${error.message}`, searchAlbumsGrid);
            return [];
        }
    }

    async function searchTracks(query) {
        try {
            const data = await fetchData({ method: 'track.search', track: query, limit: SEARCH_RESULTS_LIMIT });
            return data.results.trackmatches.track || [];
        } catch (error) {
            displayError(`Ошибка при поиске треков: ${error.message}`, searchTracksGrid);
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
        const globalError = document.querySelector('.global-error-message');
        if (globalError) globalError.remove();

        if (!query) {
            // If search is empty, show popular content and hide search results
            popularContentSections.forEach(s => s.style.display = '');
            searchResultsSections.forEach(s => s.style.display = 'none');
            loadInitialData(); // Reload popular data
            return;
        }

        // Hide popular content, show search sections
        popularContentSections.forEach(s => s.style.display = 'none');
        searchResultsSections.forEach(s => s.style.display = '');

        clearGrids([searchArtistsGrid, searchAlbumsGrid, searchTracksGrid]); // Clear previous search results

        searchArtistsTitle.textContent = `Исполнители по запросу "${query}"`;
        searchAlbumsTitle.textContent = `Альбомы по запросу "${query}"`;
        searchTracksTitle.textContent = `Треки по запросу "${query}"`;

        // Show loading state (optional, could be spinners)
        if (searchArtistsGrid) searchArtistsGrid.innerHTML = "<p>Поиск исполнителей...</p>";
        if (searchAlbumsGrid) searchAlbumsGrid.innerHTML = "<p>Поиск альбомов...</p>";
        if (searchTracksGrid) searchTracksGrid.innerHTML = "<p>Поиск треков...</p>";

        try {
            const [artists, albums, tracks] = await Promise.all([
                searchArtists(query),
                searchAlbums(query),
                searchTracks(query)
            ]);

            renderArtists(artists, searchArtistsGrid);
            renderAlbums(albums, searchAlbumsGrid);
            renderTracks(tracks, searchTracksGrid);

        } catch (error) {
            // This catch might be redundant if individual search functions handle their errors display
            // but can catch errors from Promise.all itself or unhandled rejections.
            displayError('Произошла ошибка во время поиска. Пожалуйста, попробуйте еще раз.', null); // General error
            console.error("Search operation failed:", error);
        }
    }

    // ================================
    // INITIALIZATION
    // ================================
    async function loadInitialData() {
        if (API_KEY === 'YOUR_API_KEY') {
            displayError('КРИТИЧЕСКАЯ ОШИБКА: API ключ не настроен. Пожалуйста, укажите ваш API_KEY в файле api.js.', null);
            return;
        }
        // Clear previous content before loading
        clearGrids([popularArtistsGrid, popularTracksGrid]);

        // Show loading state (optional)
        if (popularArtistsGrid) popularArtistsGrid.innerHTML = "<p>Загрузка популярных исполнителей...</p>";
        if (popularTracksGrid) popularTracksGrid.innerHTML = "<p>Загрузка популярных треков...</p>";


        const [artists, tracks] = await Promise.all([
            fetchTopArtists(),
            fetchTopTracks()
        ]);
        renderArtists(artists, popularArtistsGrid);
        renderTracks(tracks, popularTracksGrid);
    }

    function init() {
        if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
            displayError('КРИТИЧЕСКАЯ ОШИБКА: API ключ не настроен. Пожалуйста, укажите ваш API_KEY в файле api.js.', null);
            if (searchButton) searchButton.disabled = true;
            if (searchInput) searchInput.disabled = true;
            searchInput.placeholder = "API ключ не настроен";
            return;
        }

        loadInitialData();

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