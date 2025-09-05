export interface IPokemon {
  name: string;
  url?: string;
}

export interface FavoritePokemonCardProps {
  pokemon: IPokemon;
  onPress: (pokemon: IPokemon) => void;
  onToggleFavorite: (pokemon: IPokemon, isFavorite: boolean) => void;
  isFavorite?: boolean;
}
