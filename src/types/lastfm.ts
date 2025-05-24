export interface Image {
    '#text': string;
    size: 'small' | 'medium' | 'large' | 'extralarge' | 'mega' | '';
}

export interface Tag {
    name: string;
    url: string;
}

export interface Artist {
    name: string;
    url: string;
    mbid?: string;
    image: Image[];
    listeners?: string; // от chart.getTopArtists
    playcount?: string; // от artist.search
    streamable?: string;
    tags?: Tag[]; // Будем добавлять это поле сами после доп. запроса
}

export interface ArtistInfo extends Artist { // Для artist.getInfo, которое включает теги
    stats?: {
        listeners: string;
        playcount: string;
    };
    bio?: {
        summary: string;
        content: string;
    };
    toptags?: { // artist.getTopTags возвращает toptags.tag
        tag: Tag[];
    };
}

export interface TrackArtist {
    name: string;
    mbid?: string;
    url: string;
}

export interface Track {
    name: string;
    url: string;
    duration?: string;
    listeners?: string;
    playcount?: string;
    artist: TrackArtist | string; // chart.getTopTracks дает объект, track.search дает строку
    image: Image[];
    mbid?: string;
    streamable?: {
        '#text': string;
        fulltrack: string;
    };
    tags?: Tag[]; // Будем добавлять это поле сами
}

export interface Album {
    name: string;
    artist: string;
    url: string;
    image: Image[];
    mbid?: string;
    // Теги для альбомов тоже можно добавить по аналогии, если нужно
}

// Типы для ответов API
export interface TopArtistsResponse {
    artists: {
        artist: Artist[];
    };
}

export interface TopTracksResponse {
    tracks: {
        track: Track[];
    };
}

export interface ArtistSearchResponse {
    results: {
        'opensearch:totalResults': string;
        artistmatches: {
            artist: Artist[];
        };
    };
}

export interface AlbumSearchResponse {
    results: {
        'opensearch:totalResults': string;
        albummatches: {
            album: Album[];
        };
    };
}

export interface TrackSearchResponse {
    results: {
        'opensearch:totalResults': string;
        trackmatches: {
            track: Track[];
        };
    };
}

export interface ArtistTagsResponse {
    toptags: {
        tag: Tag[];
        '@attr': {
            artist: string;
        }
    }
}
export interface TrackTagsResponse {
    toptags: {
        tag: Tag[];
        '@attr'?: { // Может отсутствовать, если тегов нет
            track: string;
            artist: string;
        }
    }
}