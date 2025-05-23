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

    // ================================
    // UTILITY FUNCTIONS
    // ================================

    /**
     * Displays an error message to the user.
     * @param {string} message - The error message to display.
     * @param {HTMLElement} sectionElement - The HTML element related to the error (e.g., artistGrid or trackGrid).
     */
    function displayError(message, sectionElement) {
        if (sectionElement) {
            sectionElement.innerHTML = `<p class="error-message" style="color: red; text-align: center;">${message}</p>`;
        } else {
            // Fallback if no specific section is provided, e.g., for global errors
            const mainContent = document.querySelector('.main-content');
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
        console.error(message); // Log error to console as well
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
                throw new Error(`Network response was not ok: ${response.statusText} (status: ${response.status})`);
            }
            const data = await response.json();
            if (data.error) {
                throw new Error(`Last.fm API error ${data.error}: ${data.message}`);
            }
            return data;
        } catch (error) {
            console.error('Fetch data error:', error);
            throw error; // Re-throw to be caught by calling function
        }
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
            displayError('Не удалось загрузить популярных исполнителей. Попробуйте обновить страницу.', artistGrid);
            return []; // Return empty array on error to prevent further issues
        }
    }

    /**
     * Displays artists in the grid.
     * @param {Array<object>} artists - Array of artist objects.
     */
    function displayArtists(artists) {
        if (!artistGrid) return;
        artistGrid.innerHTML = ''; // Clear existing content or placeholders

        if (!artists || artists.length === 0) {
            // displayError could have been called already by fetchTopArtists
            // This is a fallback or for cases where artists array is empty for other reasons
            if (!artistGrid.querySelector('.error-message')) {
                artistGrid.innerHTML = '<p style="text-align: center;">Исполнители не найдены.</p>';
            }
            return;
        }

        artists.forEach(artist => {
            const artistCard = document.createElement('div');
            artistCard.className = 'artist-card';

            // Last.fm API provides images in different sizes. We pick 'extralarge'.
            // Image URL: artist.image is an array of objects, each with #text (url) and size.
            const imageUrl = artist.image.find(img => img.size === 'extralarge')?.['#text'] ||
                artist.image.find(img => img.size === 'large')?.['#text'] ||
                `https://via.placeholder.com/130/DDDDDD/808080?text=${encodeURIComponent(artist.name)}`;


            artistCard.innerHTML = `
        <img src="${imageUrl}" alt="${artist.name}" class="artist-card__image">
        <p class="artist-card__name">${artist.name}</p>
      `;
            artistGrid.appendChild(artistCard);
        });
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
            displayError('Не удалось загрузить популярные треки. Попробуйте обновить страницу.', trackGrid);
            return [];
        }
    }

    /**
     * Displays tracks in the grid.
     * @param {Array<object>} tracks - Array of track objects.
     * @param {string} [title="Popular tracks"] - The title for the tracks section.
     */
    function displayTracks(tracks, title = "Popular tracks") {
        if (!trackGrid || !popularTracksTitle) return;

        popularTracksTitle.textContent = title;
        trackGrid.innerHTML = ''; // Clear existing content or placeholders

        if (!tracks || tracks.length === 0) {
            if (!trackGrid.querySelector('.error-message')) {
                trackGrid.innerHTML = '<p style="text-align: center;">Треки не найдены.</p>';
            }
            return;
        }

        tracks.forEach(track => {
            const trackItem = document.createElement('div');
            trackItem.className = 'track-item';

            // Image URL: track.image is an array. We pick 'medium' or 'large'.
            const imageUrl = track.image.find(img => img.size === 'medium')?.['#text'] ||
                track.image.find(img => img.size === 'large')?.['#text'] ||
                track.image.find(img => img.size !== '')?.['#text'] || // any available image
                `https://via.placeholder.com/64/EEEEEE/808080?text=Art`;

            trackItem.innerHTML = `
        <img src="${imageUrl}" alt="${track.name}" class="track-item__album-art">
        <div class="track-item__info">
          <p class="track-item__title">${track.name}</p>
          <p class="track-item__artist">${track.artist.name || track.artist}</p> </div>
      `;
            trackGrid.appendChild(trackItem);
        });
    }

    // ================================
    // SEARCH FUNCTIONS
    // ================================

    /**
     * Searches for tracks on Last.fm.
     * @async
     * @param {string} query - The search query.
     * @returns {Promise<Array<object>>} A list of track objects from search results.
     */
    async function searchTracks(query) {
        if (!query.trim()) {
            displayError('Пожалуйста, введите поисковый запрос.', trackGrid);
            return [];
        }
        try {
            // Clear previous global errors if any
            const globalError = document.querySelector('.global-error-message');
            if (globalError) globalError.remove();

            const data = await fetchData({ method: 'track.search', track: query, limit: 18 });
            return data.results.trackmatches.track;
        } catch (error) {
            displayError(`Ошибка при поиске треков "${query}". Попробуйте еще раз или измените запрос. (${error.message})`, trackGrid);
            return [];
        }
    }

    /**
     * Handles the search functionality.
     * @async
     */
    async function handleSearch() {
        const query = searchInput.value;
        if (!query.trim()) {
            // If search is empty, reload popular tracks
            loadPopularTracks();
            return;
        }
        hotArtistsTitle.textContent = `Результаты поиска по исполнителям для "${query}" (API не поддерживает поиск по исполнителям в этой демо-версии)`;
        if (artistGrid) artistGrid.innerHTML = '<p style="text-align:center;">Функция поиска по исполнителям не реализована в этой версии. Показаны результаты по трекам ниже.</p>';

        const tracks = await searchTracks(query);
        displayTracks(tracks, `Результаты поиска по трекам для "${query}"`);
    }


    // ================================
    // INITIALIZATION
    // ================================

    /**
     * Loads popular artists onto the page.
     * @async
     */
    async function loadPopularArtists() {
        if (API_KEY === 'YOUR_API_KEY') {
            displayError('Пожалуйста, укажите ваш API ключ в файле api.js для загрузки исполнителей.', artistGrid);
            return;
        }
        const artists = await fetchTopArtists();
        displayArtists(artists);
    }

    /**
     * Loads popular tracks onto the page.
     * @async
     */
    async function loadPopularTracks() {
        if (API_KEY === 'YOUR_API_KEY') {
            displayError('Пожалуйста, укажите ваш API ключ в файле api.js для загрузки треков.', trackGrid);
            return;
        }
        const tracks = await fetchTopTracks();
        displayTracks(tracks, "Popular tracks");
    }

    /**
     * Initializes the application.
     */
    function init() {
        if (!API_KEY || API_KEY === 'YOUR_API_KEY') {
            displayError('КРИТИЧЕСКАЯ ОШИБКА: API ключ не настроен. Пожалуйста, укажите ваш API_KEY в файле api.js.', document.querySelector('.main-content'));
            // Disable search if API key is missing
            if (searchButton) searchButton.disabled = true;
            if (searchInput) searchInput.disabled = true;
            return;
        }

        loadPopularArtists();
        loadPopularTracks();

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