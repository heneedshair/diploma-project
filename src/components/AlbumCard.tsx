import React from 'react';
import { Album, Image } from '../types/lastfm';
import { getImageUrl } from '../services/apiService';

interface AlbumCardProps {
    album: Album;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
    const imageUrl = getImageUrl(album.image, 'extralarge') || `https://via.placeholder.com/150/DDDDDD/808080?text=${encodeURIComponent(album.name)}`;

    return (
        <div className="album-card">
            <img src={imageUrl} alt={album.name} className="album-card__image" />
            <p className="album-card__name">{album.name}</p>
            <p className="album-card__artist">{album.artist}</p>
        </div>
    );
};

export default AlbumCard;