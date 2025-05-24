import {
    TopArtistsResponse, ArtistSearchResponse, TopTracksResponse,
    TrackSearchResponse, AlbumSearchResponse, Artist, Track, Album,
    ArtistTagsResponse, TrackTagsResponse, Tag
} from '../types/lastfm';

const API_KEY = '25b8590eafb0eb154165a4b95c013fc3';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

const MAX_TAGS_DISPLAYED = 3;
const SEARCH_RESULTS_LIMIT = 6;
const POPULAR_ARTISTS_LIMIT = 12;
const POPULAR_TRACKS_LIMIT = 18;

interface FetchParams {
    method: string;
    [key: string]: string | number;
}

async function fetchData<T>(params: FetchParams): Promise<T> {
    const queryParams = new URLSearchParams({
        ...params,
        api_key: API_KEY,
        format: 'json',
    } as Record<string, string>);

    const url = `${BASE_URL}?${queryParams}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(`Network error: ${response.status} - ${errorData.message || response.statusText}`);
        }
        const data = await response.json();
        if (data.error) {
            throw new Error(`Last.fm API Error ${data.error}: ${data.message}`);
        }
        return data as T;
    } catch (error) {
        console.error(`API call failed for method ${params.method}:`, error);
        throw error;
    }
}

export const getTopArtists = async (): Promise<Artist[]> => {
    const data = await fetchData<TopArtistsResponse>({ method: 'chart.getTopArtists', limit: POPULAR_ARTISTS_LIMIT });
    return data.artists.artist || [];
};

export const getTopTracks = async (): Promise<Track[]> => {
    const data = await fetchData<TopTracksResponse>({ method: 'chart.getTopTracks', limit: POPULAR_TRACKS_LIMIT });
    return data.tracks.track || [];
};

export const searchArtists = async (query: string): Promise<Artist[]> => {
    const data = await fetchData<ArtistSearchResponse>({ method: 'artist.search', artist: query, limit: SEARCH_RESULTS_LIMIT });
    return data.results.artistmatches.artist || [];
};

export const searchAlbums = async (query: string): Promise<Album[]> => {
    const data = await fetchData<AlbumSearchResponse>({ method: 'album.search', album: query, limit: SEARCH_RESULTS_LIMIT });
    return data.results.albummatches.album || [];
};

export const searchTracks = async (query: string): Promise<Track[]> => {
    const data = await fetchData<TrackSearchResponse>({ method: 'track.search', track: query, limit: SEARCH_RESULTS_LIMIT });
    return data.results.trackmatches.track || [];
};

export const getArtistTopTags = async (artistName: string): Promise<Tag[]> => {
    try {
        const data = await fetchData<ArtistTagsResponse>({ method: 'artist.getTopTags', artist: artistName });
        return (data.toptags?.tag || []).slice(0, MAX_TAGS_DISPLAYED);
    } catch (error) {
        console.warn(`Could not fetch tags for artist ${artistName}:`, error);
        return [];
    }
};

export const getTrackTopTags = async (trackName: string, artistName: string): Promise<Tag[]> => {
    try {
        const data = await fetchData<TrackTagsResponse>({ method: 'track.getTopTags', track: trackName, artist: artistName });
        return (data.toptags?.tag || []).slice(0, MAX_TAGS_DISPLAYED);
    } catch (error) {
        console.warn(`Could not fetch tags for track ${trackName} by ${artistName}:`, error);
        return [];
    }
};

export const getImageUrl = (images: any[], size: 'small' | 'medium' | 'large' | 'extralarge' = 'large'): string | undefined => {
    if (!images || !Array.isArray(images)) return undefined;
    const foundImage = images.find(img => img.size === size);
    return foundImage ? foundImage['#text'] : images.find(img => img['#text'])?.['#text'];
};