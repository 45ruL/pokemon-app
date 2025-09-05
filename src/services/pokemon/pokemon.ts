import { api } from "@/src/lib/axios";
import { PokemonDetailResponse, PokemonListResponse } from "./types";

export const fetchPokemonList = async (
  offset: number
): Promise<PokemonListResponse> => {
  try {
    const limit = 20;
    const res = await api.get<PokemonListResponse>(
      `/pokemon?limit=${limit}&offset=${offset}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPokemonDetail = async (
  name: string
): Promise<PokemonDetailResponse> => {
  try {
    const res = await api.get<PokemonDetailResponse>(`/pokemon/${name}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};
