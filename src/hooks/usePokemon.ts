import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
      return lastPage.results.length * 20;
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
