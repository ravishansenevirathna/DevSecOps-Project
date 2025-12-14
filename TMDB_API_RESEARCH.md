# TMDB API Endpoints Research

## Current Implementation Status

### ✅ Already Implemented (Movies Only)
- Movie browsing by genre
- Popular movies
- Movie details view (with trailer, overview, similar movies)
- Movie search and discovery

### ❌ Not Yet Implemented
- TV Shows support
- Trending content (movies/TV)
- Search functionality

---

## Available TMDB API v3 Endpoints

### 🎬 Movies

| Category | Endpoint | Description |
|----------|----------|-------------|
| Popular | `/movie/popular` | Popular movies (refreshed daily) |
| Top Rated | `/movie/top_rated` | Highest-rated movies |
| Now Playing | `/movie/now_playing` | Currently in theaters |
| Upcoming | `/movie/upcoming` | Upcoming releases |
| Trending | `/trending/movie/{time_window}` | Trending movies (day/week) |
| Details | `/movie/{movie_id}` | Full movie details |
| Videos | `/movie/{movie_id}/videos` | Trailers and clips |
| Similar | `/movie/{movie_id}/similar` | Similar movies |
| Recommendations | `/movie/{movie_id}/recommendations` | Recommended movies |
| Discover | `/discover/movie` | Advanced filtering by genre, year, etc. |
| Search | `/search/movie` | Search movies by title |

### 📺 TV Shows

| Category | Endpoint | Description |
|----------|----------|-------------|
| Popular | `/tv/popular` | Popular TV shows |
| Top Rated | `/tv/top_rated` | Highest-rated shows |
| On The Air | `/tv/on_the_air` | Currently airing shows |
| Airing Today | `/tv/airing_today` | Shows airing today |
| Trending | `/trending/tv/{time_window}` | Trending shows (day/week) |
| Details | `/tv/{series_id}` | Full TV show details |
| Videos | `/tv/{series_id}/videos` | Trailers and clips |
| Similar | `/tv/{series_id}/similar` | Similar shows |
| Recommendations | `/tv/{series_id}/recommendations` | Recommended shows |
| Discover | `/discover/tv` | Advanced filtering |
| Search | `/search/tv` | Search TV shows |
| Season Details | `/tv/{series_id}/season/{season_number}` | Season information |
| Episode Details | `/tv/{series_id}/season/{season_number}/episode/{episode_number}` | Episode info |

### 🔥 Trending (All Media Types)

| Endpoint | Description |
|----------|-------------|
| `/trending/all/{time_window}` | Movies, TV shows, and people combined |
| `/trending/movie/{time_window}` | Trending movies only |
| `/trending/tv/{time_window}` | Trending TV shows only |
| `/trending/person/{time_window}` | Trending people/actors |

**Time Windows:** `day` or `week`

### 🔍 Search & Discovery

| Endpoint | Description |
|----------|-------------|
| `/search/multi` | Search all media types in one query |
| `/search/movie` | Search movies only |
| `/search/tv` | Search TV shows only |
| `/search/person` | Search actors/people |
| `/discover/movie` | Advanced movie filtering with many params |
| `/discover/tv` | Advanced TV show filtering |

### 🎭 Genres

| Endpoint | Description |
|----------|-------------|
| `/genre/movie/list` | All movie genres *(already implemented)* |
| `/genre/tv/list` | All TV show genres |

---

## Common Query Parameters

### All List Endpoints Support:
- `api_key` - Your TMDB API key (required)
- `language` - ISO 639-1 language code (e.g., 'en-US')
- `page` - Page number for pagination (default: 1)
- `region` - ISO 3166-1 country code for regional data

### Discover Endpoints Support:
- `with_genres` - Filter by genre IDs (comma-separated)
- `sort_by` - Sort results (e.g., 'popularity.desc', 'vote_average.desc')
- `year` / `first_air_date_year` - Filter by release year
- `vote_average.gte` - Minimum rating
- `with_watch_providers` - Filter by streaming service
- And many more...

---

## Response Structure Examples

### Movie/TV List Response
```json
{
  "page": 1,
  "results": [
    {
      "id": 123456,
      "title": "Movie Title",          // for movies
      "name": "TV Show Name",           // for TV shows
      "overview": "Description...",
      "poster_path": "/path.jpg",
      "backdrop_path": "/path.jpg",
      "vote_average": 8.5,
      "release_date": "2024-01-15",    // for movies
      "first_air_date": "2024-01-15",  // for TV shows
      "genre_ids": [28, 12, 878]
    }
  ],
  "total_pages": 100,
  "total_results": 2000
}
```

### Movie Details Response (append_to_response=videos)
```json
{
  "id": 123456,
  "title": "Movie Title",
  "overview": "Description...",
  "runtime": 142,
  "genres": [{"id": 28, "name": "Action"}],
  "release_date": "2024-01-15",
  "vote_average": 8.5,
  "videos": {
    "results": [
      {
        "key": "YouTube_ID",
        "site": "YouTube",
        "type": "Trailer"
      }
    ]
  }
}
```

### TV Details Response
```json
{
  "id": 123456,
  "name": "TV Show Name",
  "overview": "Description...",
  "number_of_seasons": 5,
  "number_of_episodes": 50,
  "episode_run_time": [45, 60],
  "genres": [{"id": 18, "name": "Drama"}],
  "first_air_date": "2020-01-01",
  "last_air_date": "2024-12-31",
  "status": "Returning Series",
  "seasons": [
    {
      "season_number": 1,
      "episode_count": 10,
      "air_date": "2020-01-01"
    }
  ]
}
```

---

## Implementation Plan for Your App

### Phase 1: Add TV Shows Support ✨
1. Update types to support both Movie and TV media types
2. Add TV show API endpoints to Redux slices
3. Add TV show categories (Popular, Top Rated, On The Air, Airing Today)
4. Create navigation to switch between Movies and TV Shows
5. Update detail modal to show TV-specific info (seasons, episodes)

### Phase 2: Add Trending Section
1. Add trending endpoint to API slice
2. Create "Trending Now" carousel for both movies and TV shows
3. Support day/week time windows

### Phase 3: Add Search (Optional)
1. Add search endpoints
2. Create search UI in header
3. Show mixed results (movies + TV shows)

### Phase 4: Enhanced Discovery (Optional)
1. Add more filtering options (by year, rating, etc.)
2. Add "Recommended for You" based on similar content
3. Add watch provider filtering

---

## Key Differences: Movies vs TV Shows

| Feature | Movies | TV Shows |
|---------|--------|----------|
| **Title field** | `title` | `name` |
| **Release date** | `release_date` | `first_air_date` |
| **Runtime** | `runtime` (single number) | `episode_run_time` (array) |
| **Categories** | Now Playing, Upcoming | On The Air, Airing Today |
| **Additional info** | - | `number_of_seasons`, `number_of_episodes` |
| **Detail endpoint** | `/movie/{id}` | `/tv/{id}` |

---

## Resources

- [TMDB API Documentation](https://developer.themoviedb.org/reference/intro/getting-started)
- [Trending Endpoints](https://developers.themoviedb.org/3/trending)
- [Getting Started Guide](https://developer.themoviedb.org/docs/getting-started)

---

**Next Steps:** Choose which phase to implement first. I recommend starting with Phase 1 (TV Shows support) to match your app's navigation (Movies, TV Shows).
