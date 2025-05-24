import React from 'react';
import { Artist, Image } from '../types/lastfm';
import TagsDisplay from './TagsDisplay';
import { getImageUrl } from '../services/apiService';

interface ArtistCardProps {
    artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
    const imageUrl = getImageUrl(artist.image, 'extralarge') || `https://via.placeholder.com/130/DDDDDD/808080?text=${encodeURIComponent(artist.name)}`;

    return (
        <div className="artist-card">
            <img src={imageUrl} alt={artist.name} className="artist-card__image" />
            <p className="artist-card__name">{artist.name}</p>
            <TagsDisplay itemName={artist.name} type="artist" />
        </div>
    );
};

export default ArtistCard;