import { CustomGenre } from "src/types/Genre";
import { MEDIA_TYPE } from "src/types/Common";

export const API_ENDPOINT_URL = import.meta.env.VITE_APP_API_ENDPOINT_URL;
export const TMDB_V3_API_KEY = import.meta.env.VITE_APP_TMDB_V3_API_KEY;

export const MAIN_PATH = {
  root: "",
  browse: "browse",
  genreExplore: "genre",
  watch: "watch",
};

export const ARROW_MAX_WIDTH = 60;

// Movie-specific categories
export const MOVIE_COMMON_TITLES: CustomGenre[] = [
  { name: "Popular", apiString: "popular" },
  { name: "Top Rated", apiString: "top_rated" },
  { name: "Now Playing", apiString: "now_playing" },
  { name: "Upcoming", apiString: "upcoming" },
];

// TV Show-specific categories
export const TV_COMMON_TITLES: CustomGenre[] = [
  { name: "Popular", apiString: "popular" },
  { name: "Top Rated", apiString: "top_rated" },
  { name: "On The Air", apiString: "on_the_air" },
  { name: "Airing Today", apiString: "airing_today" },
];

// Legacy export for backward compatibility (defaults to movies)
export const COMMON_TITLES = MOVIE_COMMON_TITLES;

// Helper function to get appropriate categories based on media type
export function getCommonTitlesByMediaType(mediaType: MEDIA_TYPE): CustomGenre[] {
  return mediaType === MEDIA_TYPE.Tv ? TV_COMMON_TITLES : MOVIE_COMMON_TITLES;
}

export const YOUTUBE_URL = "https://www.youtube.com/watch?v=";
export const APP_BAR_HEIGHT = 70;

export const INITIAL_DETAIL_STATE = {
  id: undefined,
  mediaType: undefined,
  mediaDetail: undefined,
};
