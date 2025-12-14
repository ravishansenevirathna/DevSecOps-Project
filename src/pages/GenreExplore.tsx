import {
  LoaderFunctionArgs,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";
import { getCommonTitlesByMediaType } from "src/constant";
import GridPage from "src/components/GridPage";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import { genreSliceEndpoints } from "src/store/slices/genre";
import store from "src/store";

export async function loader({ params, request }: LoaderFunctionArgs) {
  // Get media type from URL search params
  const url = new URL(request.url);
  const typeParam = url.searchParams.get('type');
  const mediaType = typeParam === 'tv' ? MEDIA_TYPE.Tv : MEDIA_TYPE.Movie;

  // Get appropriate common titles for this media type
  const commonTitles = getCommonTitlesByMediaType(mediaType);

  let genre: CustomGenre | Genre | undefined = commonTitles.find(
    (t) => t.apiString === (params.genreId as string)
  );

  if (!genre) {
    const genres = await store
      .dispatch(genreSliceEndpoints.getGenres.initiate(mediaType))
      .unwrap();
    genre = genres?.find((t) => t.id.toString() === (params.genreId as string));
  }

  return genre;
}

export function Component() {
  const genre: CustomGenre | Genre | undefined = useLoaderData() as
    | CustomGenre
    | Genre
    | undefined;

  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type');
  const mediaType = typeParam === 'tv' ? MEDIA_TYPE.Tv : MEDIA_TYPE.Movie;

  if (genre) {
    return <GridPage mediaType={mediaType} genre={genre} />;
  }
  return null;
}

Component.displayName = "GenreExplore";
