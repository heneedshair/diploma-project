import React from 'react';
import { Track, Image } from '../types/lastfm';
import TagsDisplay from './TagsDisplay';
import { getImageUrl } from '../services/apiService';

interface TrackItemProps {
    track: Track;
}

const TrackItem: React.FC<TrackItemProps> = ({ track }) => {
    const imageUrl = getImageUrl(track.image, 'medium') || `https://via.placeholder.com/64/EEEEEE/808080?text=Art`;
    const artistName = typeof track.artist === 'string' ? track.artist : track.artist.name;

    return (
        <div className="track-item">
            <img src={imageUrl} alt={track.name} className="track-item__album-art" />
            <div className="track-item__info">
                <p className="track-item__title">{track.name}</p>
                <p className="track-item__artist">{artistName}</p>
                <TagsDisplay itemName={track.name} artistName={artistName} type="track" />
            </div>
        </div>
    );
};

export default TrackItem;