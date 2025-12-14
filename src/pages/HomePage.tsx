import Stack from "@mui/material/Stack";
import { useSearchParams } from "react-router-dom";
import { getCommonTitlesByMediaType } from "src/constant";
import HeroSection from "src/components/HeroSection";
import { genreSliceEndpoints, useGetGenresQuery } from "src/store/slices/genre";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import SliderRowForGenre from "src/components/VideoSlider";
import store from "src/store";

export async function loader() {
  // Pre-load both movie and TV genres for faster navigation
  await Promise.all([
    store.dispatch(genreSliceEndpoints.getGenres.initiate(MEDIA_TYPE.Movie)),
    store.dispatch(genreSliceEndpoints.getGenres.initiate(MEDIA_TYPE.Tv)),
  ]);
  return null;
}

export function Component() {
  const [searchParams] = useSearchParams();

  // Get media type from URL parameter, default to 'movie'
  const typeParam = searchParams.get('type');
  const mediaType = typeParam === 'tv' ? MEDIA_TYPE.Tv : MEDIA_TYPE.Movie;

  // Get appropriate common titles based on media type
  const commonTitles = getCommonTitlesByMediaType(mediaType);

  // Fetch genres for the current media type
  const { data: genres, isSuccess } = useGetGenresQuery(mediaType);

  if (isSuccess && genres && genres.length > 0) {
    return (
      <Stack spacing={2}>
        <HeroSection mediaType={mediaType} />
        {[...commonTitles, ...genres].map((genre: Genre | CustomGenre) => (
          <SliderRowForGenre
            key={`${mediaType}-${genre.id || genre.name}`}
            genre={genre}
            mediaType={mediaType}
          />
        ))}
      </Stack>
    );
  }
  return null;
}

Component.displayName = "HomePage";
