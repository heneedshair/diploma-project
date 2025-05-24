import React from 'react';
import { Track } from '../types/lastfm'; // Убедитесь, что типы импортированы
import TrackItem from './TrackItem';     // Компонент для отображения одного трека

interface TrackGridProps {
    tracks: Track[];
    isLoading?: boolean;
    error?: string | null;
}

const TrackGrid: React.FC<TrackGridProps> = ({ tracks, isLoading, error }) => {
    if (isLoading) return <p>Loading tracks...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!tracks || tracks.length === 0) return <p>No tracks found.</p>;

    return (
        <div className="track-grid">
            {tracks.map((track) => (
                // Ключ должен быть уникальным. Используем URL или комбинацию, если mbid нет.
                <TrackItem key={track.url || `${track.name}-${typeof track.artist === 'string' ? track.artist : track.artist.name}`} track={track} />
            ))}
        </div>
    );
};

export default TrackGrid;