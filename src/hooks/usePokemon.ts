import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import {
  fetchPokemonDetail,
  fetchPokemonList,
} from "../services/pokemon/pokemon";
import {
  PokemonDetailResponse,
  PokemonListResponse,
} from "../services/pokemon/types";

export const usePokemonList = () => {
  return useInfiniteQuery<PokemonListResponse>({
    queryKey: ["pokemon-list"],
    queryFn: async ({ pageParam = 0 }) => fetchPokemonList(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      const offset = url.searchParams.get("offset");
      return offset ? Number(offset) : undefined;
    },
    select: (data) => {
      const merged = data.pages.flatMap((page) => page.results);

      const unique = merged.filter(
        (p, index, self) => index === self.findIndex((x) => x.name === p.name)
      );

      return {
        ...data,
        pages: [
          {
            ...data.pages[data.pages.length - 1],
            results: unique,
          },
        ],
      };
    },
  });
};

export const usePokemonDetail = (name: string) => {
  return useQuery<PokemonDetailResponse>({
    queryKey: ["pokemon-detail", name],
    queryFn: () => fetchPokemonDetail(name),
    enabled: !!name,
  });
};

export const usePokemonListWithLazyTypeInfinite = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isListLoading,
    isError: isListError,
    error: listError,
    refetch: listRefetch,
  } = usePokemonList();

  const flatList = data?.pages.flatMap((page) => page.results) ?? [];

  const typeAndStatsQueries = useQueries({
    queries: flatList.map((p, i) => ({
      queryKey: ["pokemon-stats-and-types", i, p.url],
      queryFn: async () => {
        const data = await fetchPokemonDetail(p.name);
        const image = data.sprites.other["official-artwork"].front_default;
        const types = data.types.map((t) => t.type.name);

        const avgStat =
          data.stats.reduce((acc, s) => acc + s.base_stat, 0) /
          data.stats.length;

        const rating = Math.round((avgStat / 255) * 5);

        return { types, rating, image };
      },
    })),
  });

  const pokemons = flatList.map((p, i) => ({
    ...p,
    image: typeAndStatsQueries[i]?.data?.image ?? "",
    types: typeAndStatsQueries[i]?.data?.types ?? [],
    rating: typeAndStatsQueries[i]?.data?.rating ?? null,
  }));

  return {
    pokemons,
    isListLoading,
    isListError,
    listError,
    listRefetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    typeAndStatsStatus: typeAndStatsQueries.map((q) => ({
      isLoading: q.isLoading,
      isError: q.isError,
      error: q.error,
    })),
  };
};
