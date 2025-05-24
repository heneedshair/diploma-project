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
    tags?: Tag[];
}

export interface ArtistInfo extends Artist {
    stats?: {
        listeners: string;
        playcount: string;
    };
    bio?: {
        summary: string;
        content: string;
    };
    toptags?: {
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
    artist: TrackArtist | string;
    image: Image[];
    mbid?: string;
    streamable?: {
        '#text': string;
        fulltrack: string;
    };
    tags?: Tag[];
}

export interface Album {
    name: string;
    artist: string;
    url: string;
    image: Image[];
    mbid?: string;
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
        '@attr'?: {
            track: string;
            artist: string;
        }
    }
}