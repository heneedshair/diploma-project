import React from 'react';
import { Album } from '../types/lastfm';
import AlbumCard from './AlbumCard';

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
        <div className="album-grid-search">
            {albums.map((album) => (
                <AlbumCard key={album.url || `${album.name}-${album.artist}`} album={album} />
            ))}
        </div>
    );
};

export default AlbumGrid;