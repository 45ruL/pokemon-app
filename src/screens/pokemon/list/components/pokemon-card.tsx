import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IPokemonCardProps } from "./types";

export const PokemonCard: React.FC<IPokemonCardProps> = ({
  pokemon,
  onPress,
  onToggleFavorite,
  isFavorite,
}) => {
  const id = pokemon.url?.split("/").filter(Boolean).pop();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  return (
    <TouchableOpacity
      style={styles.pokemonCard}
      onPress={() => onPress(pokemon)}
    >
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() =>
          onToggleFavorite && onToggleFavorite(pokemon, !!isFavorite)
        }
      >
        <Ionicons
          name="heart"
          size={20}
          color={isFavorite ? "#FF6B6B" : "#DDD"}
        />
      </TouchableOpacity>

      <View style={styles.pokemonImageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
      </View>

      <View style={styles.pokemonInfo}>
        <Text style={styles.pokemonName}>{pokemon.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pokemonCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
  },
  pokemonImageContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  pokemonImage: {
    width: 80,
    height: 80,
  },
  pokemonInfo: {
    alignItems: "center",
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343A40",
    marginBottom: 6,
  },
});
