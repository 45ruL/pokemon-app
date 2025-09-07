export interface IPokemon {
  name: string;
  types: string[];
  image: string;
  url: string;
  rating: number | null;
}

export interface IFavoritePokemonCardProps {
  pokemon: IPokemon;
  onPress: (pokemon: IPokemon) => void;
  onToggleFavorite: (pokemon: IPokemon, isFavorite: boolean) => void;
  isFavorite?: boolean;
}
