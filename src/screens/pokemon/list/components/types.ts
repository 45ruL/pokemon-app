export interface IPokemon {
  name: string;
  types: string[];
  image: string;
  url: string;
  rating: number | null;
}

export interface IPokemonCardProps {
  pokemon: IPokemon;
  onPress: (pokemon: IPokemon) => void;
  onToggleFavorite: (pokemon: IPokemon, isFavorite: boolean) => void;
  isFavorite?: boolean;
  isLoading?: boolean;
  isError?: boolean;
}
