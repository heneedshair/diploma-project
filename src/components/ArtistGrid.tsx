import React from 'react';
import { Artist } from '../types/lastfm';
import ArtistCard from './ArtistCard';

interface ArtistGridProps {
    artists: Artist[];
    isLoading?: boolean;
    error?: string | null;
}

const ArtistGrid: React.FC<ArtistGridProps> = ({ artists, isLoading, error }) => {
    if (isLoading) return <p>Loading artists...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!artists || artists.length === 0) return <p>No artists found.</p>;

    return (
        <div className="artist-grid">
            {artists.map((artist) => (
                // Используем artist.mbid или artist.url если имя не уникально, но для Last.fm имя обычно достаточно
                <ArtistCard key={artist.url || artist.name} artist={artist} />
            ))}
        </div>
    );
};

export default ArtistGrid;