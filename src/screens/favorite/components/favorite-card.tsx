import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FavoritePokemonCardProps } from "./types";

export const FavoritePokemonCard: React.FC<FavoritePokemonCardProps> = ({
  pokemon,
  onPress,
  onToggleFavorite,
  isFavorite,
}) => {
  const API_IMAGE_URL = process.env.EXPO_PUBLIC_API_IMAGE_URL;
  const id = pokemon.url?.split("/").filter(Boolean).pop();
  const imageUrl = `${API_IMAGE_URL}/${id}.png`;

  return (
    <TouchableOpacity
      style={styles.pokemonCard}
      onPress={() => onPress(pokemon)}
    >
      <View style={styles.cardContent}>
        <View style={styles.pokemonImageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
        </View>

        <View style={styles.pokemonInfo}>
          <View style={styles.pokemonHeader}>
            <Text style={styles.pokemonName}>{pokemon.name}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() =>
            onToggleFavorite && onToggleFavorite(pokemon, !!isFavorite)
          }
        >
          <Ionicons
            name="trash"
            size={20}
            color={isFavorite ? "#FF6B6B" : "#DDD"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pokemonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    position: "relative",
  },
  pokemonImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  pokemonImage: {
    width: 50,
    height: 50,
  },
  pokemonInfo: {
    flex: 1,
  },
  pokemonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#343A40",
  },
  pokemonNumber: {
    fontSize: 14,
    color: "#6C757D",
    fontWeight: "600",
  },
  favoriteButton: {
    padding: 8,
  },
});
