import { Video, VideoDetail, Movie, MovieDetail, TVShow, TVShowDetail } from 'src/types/Movie';

// Type guards
export function isMovie(video: Video): video is Movie {
  return 'title' in video;
}

export function isTVShow(video: Video): video is TVShow {
  return 'name' in video && !('title' in video);
}

export function isMovieDetail(detail: VideoDetail): detail is MovieDetail {
  return 'title' in detail;
}

export function isTVShowDetail(detail: VideoDetail): detail is TVShowDetail {
  return 'name' in detail && !('title' in detail);
}

// Helper functions to get common fields
export function getVideoTitle(video: Video): string {
  if (isMovie(video)) {
    return video.title;
  } else {
    return video.name;
  }
}

export function getVideoOriginalTitle(video: Video): string {
  if (isMovie(video)) {
    return video.original_title;
  } else {
    return video.original_name;
  }
}

export function getVideoDate(video: Video): string {
  if (isMovie(video)) {
    return video.release_date || '';
  } else {
    return video.first_air_date || '';
  }
}

export function getVideoYear(video: Video): string {
  const date = getVideoDate(video);
  return date ? date.substring(0, 4) : '';
}

export function getDetailTitle(detail: VideoDetail): string {
  if (isMovieDetail(detail)) {
    return detail.title;
  } else {
    return detail.name;
  }
}

export function getDetailOriginalTitle(detail: VideoDetail): string {
  if (isMovieDetail(detail)) {
    return detail.original_title;
  } else {
    return detail.original_name;
  }
}

export function getDetailDate(detail: VideoDetail): string {
  if (isMovieDetail(detail)) {
    return detail.release_date || '';
  } else {
    return detail.first_air_date || '';
  }
}

export function getDetailYear(detail: VideoDetail): string {
  const date = getDetailDate(detail);
  return date ? date.substring(0, 4) : '';
}

// Get runtime/duration display text
export function getDetailDuration(detail: VideoDetail): string {
  if (isMovieDetail(detail)) {
    return `${detail.runtime} min`;
  } else {
    if (detail.number_of_seasons === 1) {
      return `${detail.number_of_episodes} Episodes`;
    }
    return `${detail.number_of_seasons} Seasons`;
  }
}

// Get average episode runtime for TV shows
export function getTVShowEpisodeRuntime(detail: TVShowDetail): number {
  if (detail.episode_run_time && detail.episode_run_time.length > 0) {
    return detail.episode_run_time[0];
  }
  return 45; // Default to 45 minutes if not available
}
