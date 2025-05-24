import React, { useState, useEffect } from 'react';
import { Tag } from '../types/lastfm';
import { getArtistTopTags, getTrackTopTags } from '../services/apiService';

interface TagsDisplayProps {
    itemName: string;
    artistName?: string; // For tracks
    type: 'artist' | 'track';
}

const TagsDisplay: React.FC<TagsDisplayProps> = ({ itemName, artistName, type }) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTags = async () => {
            setLoading(true);
            try {
                if (type === 'artist') {
                    const fetchedTags = await getArtistTopTags(itemName);
                    setTags(fetchedTags);
                } else if (type === 'track' && artistName) {
                    const fetchedTags = await getTrackTopTags(itemName, artistName);
                    setTags(fetchedTags);
                }
            } catch (error) {
                console.error(`Error fetching tags for ${type} ${itemName}:`, error);
                // setTags([]); // Уже обрабатывается в apiService
            } finally {
                setLoading(false);
            }
        };

        if (itemName && (type === 'artist' || (type === 'track' && artistName))) {
            fetchTags();
        }
    }, [itemName, artistName, type]);

    if (loading || tags.length === 0) {
        return null; // Не отображаем ничего, если загрузка или нет тегов
    }

    return (
        <div className="tags-container">
            {tags.map((tag) => (
                <a key={tag.name} href={tag.url} className="tag" target="_blank" rel="noopener noreferrer">
                    {tag.name}
                </a>
            ))}
        </div>
    );
};

export default TagsDisplay;