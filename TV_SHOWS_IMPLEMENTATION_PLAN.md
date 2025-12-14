# TV Shows Implementation Plan

## Overview
Add complete TV Shows support to the Netflix clone while maintaining all existing Movie functionality.

## Implementation Strategy

### Phase 1: Type System (Foundation)
**Goal:** Create flexible types that work for both Movies and TV Shows

1. **Create `src/types/TVShow.ts`**
   - Define `TVShow` type (basic list item)
   - Define `TVShowDetail` type (detailed view)
   - Include TV-specific fields: `name`, `first_air_date`, `number_of_seasons`, `number_of_episodes`

2. **Create generic `Video` type**
   - Union type: `Movie | TVShow`
   - Helper functions: `getVideoTitle()`, `getVideoDate()`, `getVideoYear()`

3. **Update `src/types/Common.ts`**
   - Change `PaginatedMovieResult` to generic `PaginatedVideoResult`
   - Create `VideoDetail` union type: `MovieDetail | TVShowDetail`

### Phase 2: Constants & Configuration

1. **Update `src/constant/index.ts`**
   - Create `MOVIE_COMMON_TITLES` (Popular, Top Rated, Now Playing, Upcoming)
   - Create `TV_COMMON_TITLES` (Popular, Top Rated, On The Air, Airing Today)
   - Add helper: `getCommonTitlesByMediaType(mediaType)`

### Phase 3: Redux Store Updates

1. **Update `src/store/slices/discover.ts`**
   - Change return types from `PaginatedMovieResult` to `PaginatedVideoResult`
   - Ensure all endpoints remain generic (they already use `mediaType` param)

2. **Update `src/providers/DetailModalProvider.tsx`**
   - Change `mediaDetail?: MovieDetail` to `mediaDetail?: VideoDetail`
   - Update type handling

3. **Update `src/providers/PortalProvider.tsx`**
   - Change `Movie` type to `Video` type

### Phase 4: Navigation & Routing

1. **Add Media Type Navigation to `src/components/layouts/MainHeader.tsx`**
   - Add "Movies" and "TV Shows" navigation tabs
   - Highlight active tab based on route
   - Use `/browse?type=movie` and `/browse?type=tv` URLs

2. **Update `src/routes/index.tsx`**
   - Keep same routes but support query parameter for media type

### Phase 5: Page Updates

1. **Update `src/pages/HomePage.tsx`**
   - Read `type` query parameter (default to 'movie')
   - Load appropriate genres based on media type
   - Pass media type to all child components
   - Show appropriate COMMON_TITLES based on media type

2. **Update `src/pages/GenreExplore.tsx`**
   - Read media type from query parameter
   - Load appropriate genres
   - Pass media type to GridPage

### Phase 6: Component Updates

**All components need to:**
- Use `Video` type instead of `Movie` type
- Use helper functions for title/date access
- Handle media-type-specific metadata

**Priority Order:**

1. **HeroSection.tsx**
   - Change `video.title` to `getVideoTitle(video)`
   - Change `video.release_date` to `getVideoDate(video)`

2. **VideoCardPortal.tsx** (CRITICAL)
   - Add `mediaType` prop
   - Change hardcoded `MEDIA_TYPE.Movie` to use prop
   - Load genres based on media type
   - Handle title/date fields

3. **DetailModal.tsx**
   - Use `getVideoTitle()` and `getVideoDate()`
   - Add conditional rendering for TV metadata (seasons, episodes)
   - Show different metadata layout for TV vs Movies

4. **SimilarVideoCard.tsx**
   - Use helper functions for title/date

5. **GridWithInfiniteScroll.tsx**
   - Change "Movies" text to dynamic based on media type
   - Add `mediaType` prop

6. **SlickSlider.tsx**
   - Change "Movies" text to dynamic
   - Add `mediaType` prop
   - Pass mediaType to children

7. **VideoItemWithHover.tsx**
   - Add `mediaType` prop
   - Pass to portal

8. **VideoSlider.tsx**
   - Already accepts mediaType - ensure it's passed through

### Phase 7: Testing

1. Test Movies still work correctly
2. Test TV Shows load and display
3. Test switching between Movies and TV Shows
4. Test detail modals for both media types
5. Test similar content recommendations
6. Test genre filtering for both types

## File Changes Checklist

### New Files
- [ ] `src/types/TVShow.ts`
- [ ] `src/utils/videoHelpers.ts` (helper functions)

### Modified Files
- [ ] `src/types/Movie.ts` (add Video union type)
- [ ] `src/types/Common.ts`
- [ ] `src/constant/index.ts`
- [ ] `src/store/slices/discover.ts`
- [ ] `src/providers/DetailModalProvider.tsx`
- [ ] `src/providers/PortalProvider.tsx`
- [ ] `src/components/layouts/MainHeader.tsx`
- [ ] `src/pages/HomePage.tsx`
- [ ] `src/pages/GenreExplore.tsx`
- [ ] `src/components/HeroSection.tsx`
- [ ] `src/components/VideoCardPortal.tsx`
- [ ] `src/components/DetailModal.tsx`
- [ ] `src/components/SimilarVideoCard.tsx`
- [ ] `src/components/GridWithInfiniteScroll.tsx`
- [ ] `src/components/slick-slider/SlickSlider.tsx`
- [ ] `src/components/VideoItemWithHover.tsx`

## Implementation Order

1. Types (TVShow, Video, helpers)
2. Constants (TV categories)
3. Store types
4. Providers
5. Navigation header
6. Pages (HomePage, GenreExplore)
7. Components (HeroSection → VideoCardPortal → DetailModal → others)
8. Testing

## Expected Result

- Users can click "Movies" or "TV Shows" in navigation
- Each shows appropriate categories:
  - Movies: Popular, Top Rated, Now Playing, Upcoming
  - TV Shows: Popular, Top Rated, On The Air, Airing Today
- Clicking on any show opens detail modal with TV-specific info
- Genre filtering works for both media types
- All existing Movie functionality preserved
