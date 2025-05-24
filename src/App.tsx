import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ArtistGrid from './components/ArtistGrid';
import TrackGrid from './components/TrackGrid';
import AlbumGrid from './components/AlbumGrid';
import { Artist, Track, Album } from './types/lastfm';
import * as api from './services/apiService';

const App: React.FC = () => {
    // Состояние для популярного контента
    const [popularArtists, setPopularArtists] = useState<Artist[]>([]);
    const [popularTracks, setPopularTracks] = useState<Track[]>([]);

    // Состояние для результатов поиска
    const [searchedArtists, setSearchedArtists] = useState<Artist[]>([]);
    const [searchedAlbums, setSearchedAlbums] = useState<Album[]>([]);
    const [searchedTracks, setSearchedTracks] = useState<Track[]>([]);

    // Состояние для управления UI
    const [currentSearchQuery, setCurrentSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState({
        popular: true,
        search: false,
    });
    const [error, setError] = useState<{ popular: string | null; search: string | null }>({
        popular: null,
        search: null,
    });

    // Загрузка популярного контента при первом рендере
    const loadInitialData = useCallback(async () => {
        setIsLoading(prev => ({ ...prev, popular: true }));
        setError(prev => ({ ...prev, popular: null }));
        try {
            const [artists, tracks] = await Promise.all([
                api.getTopArtists(),
                api.getTopTracks(),
            ]);
            setPopularArtists(artists);
            setPopularTracks(tracks);
        } catch (err: any) {
            setError(prev => ({ ...prev, popular: err.message || 'Failed to load popular items.' }));
        } finally {
            setIsLoading(prev => ({ ...prev, popular: false }));
        }
    }, []);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    // Обработка поиска
    const handleSearch = useCallback(async (query: string) => {
        setCurrentSearchQuery(query);
        if (!query) {
            // Очищаем результаты поиска, если запрос пуст
            setSearchedArtists([]);
            setSearchedAlbums([]);
            setSearchedTracks([]);
            setError(prev => ({ ...prev, search: null }));
            return;
        }

        setIsLoading(prev => ({ ...prev, search: true }));
        setError(prev => ({ ...prev, search: null }));
        try {
            const [artists, albums, tracks] = await Promise.all([
                api.searchArtists(query),
                api.searchAlbums(query),
                api.searchTracks(query),
            ]);
            setSearchedArtists(artists);
            setSearchedAlbums(albums);
            setSearchedTracks(tracks);
        } catch (err: any) {
            setError(prev => ({ ...prev, search: err.message || 'Search failed.' }));
        } finally {
            setIsLoading(prev => ({ ...prev, search: false }));
        }
    }, []);

    const showSearchResults = !!currentSearchQuery;

    return (
        <div className="app-container">
            <Header onSearch={handleSearch} />
            <main className="main-content">
                <h1 className="page-title">Music</h1>

                {showSearchResults ? (
                    <>
                        {/* Результаты Поиска */}
                        <section className="content-section search-results-section search-results-artists">
                            <h2 className="section-title search-results-title-artists">Artists Found for "{currentSearchQuery}"</h2>
                            <ArtistGrid artists={searchedArtists} isLoading={isLoading.search} error={error.search && searchedArtists.length === 0 ? error.search : null} />
                        </section>
                        <section className="content-section search-results-section search-results-albums">
                            <h2 className="section-title search-results-title-albums">Albums Found for "{currentSearchQuery}"</h2>
                            <AlbumGrid albums={searchedAlbums} isLoading={isLoading.search} error={error.search && searchedAlbums.length === 0 ? error.search : null} />
                        </section>
                        <section className="content-section search-results-section search-results-tracks">
                            <h2 className="section-title search-results-title-tracks">Tracks Found for "{currentSearchQuery}"</h2>
                            <TrackGrid tracks={searchedTracks} isLoading={isLoading.search} error={error.search && searchedTracks.length === 0 ? error.search : null} />
                        </section>
                    </>
                ) : (
                    <>
                        {/* Популярный контент */}
                        <section className="content-section popular-content hot-artists">
                            <h2 className="section-title">Hot right now</h2>
                            <ArtistGrid artists={popularArtists} isLoading={isLoading.popular} error={error.popular} />
                        </section>
                        <section className="content-section popular-content popular-tracks">
                            <h2 className="section-title">Popular tracks</h2>
                            <TrackGrid tracks={popularTracks} isLoading={isLoading.popular} error={error.popular} />
                        </section>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default App;