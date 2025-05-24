import React from 'react';
import { Album } from '../types/lastfm'; // Убедитесь, что типы импортированы
import AlbumCard from './AlbumCard';   // Компонент для отображения одного альбома

interface AlbumGridProps {
    albums: Album[];
    isLoading?: boolean;
    error?: string | null;
}

const AlbumGrid: React.FC<AlbumGridProps> = ({ albums, isLoading, error }) => {
    if (isLoading) return <p>Loading albums...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!albums || albums.length === 0) return <p>No albums found.</p>;

    return (
        // Используйте класс, который вы определили в CSS для сетки альбомов,
        // например, "album-grid-search" или "album-grid"
        <div className="album-grid-search">
            {albums.map((album) => (
                // Ключ должен быть уникальным. Используем URL или комбинацию, если mbid нет.
                <AlbumCard key={album.url || `${album.name}-${album.artist}`} album={album} />
            ))}
        </div>
    );
};

export default AlbumGrid;