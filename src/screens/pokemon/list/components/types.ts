export interface IPokemon {
  name: string;
  url?: string;
}

export interface IPokemonCardProps {
  pokemon: IPokemon;
  onPress: (pokemon: IPokemon) => void;
  onToggleFavorite: (pokemon: IPokemon, isFavorite: boolean) => void;
  isFavorite?: boolean;
}
