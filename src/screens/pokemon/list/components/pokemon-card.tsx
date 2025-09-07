import { Skeleton } from "@/src/components/skeleton";
import { TYPE_COLORS } from "@/src/constants/type-color";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IPokemonCardProps } from "./types";

export const PokemonCard: React.FC<IPokemonCardProps> = ({
  pokemon,
  onPress,
  onToggleFavorite,
  isFavorite,
  isLoading,
  isError,
}) => {
  return (
    <TouchableOpacity
      style={styles.pokemonCard}
      onPress={() => onPress(pokemon)}
    >
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => onToggleFavorite(pokemon, !!isFavorite)}
      >
        <Ionicons
          name="heart"
          size={20}
          color={isFavorite ? "#FF6B6B" : "#DDD"}
        />
      </TouchableOpacity>

      <View style={styles.pokemonImageContainer}>
        {isLoading || isError ? (
          isLoading ? (
            <Skeleton width={80} height={80} />
          ) : (
            <Text>image cant load</Text>
          )
        ) : (
          <Image source={{ uri: pokemon.image }} style={styles.pokemonImage} />
        )}
      </View>
      <View style={styles.pokemonInfo}>
        <Text style={styles.pokemonName}>{pokemon.name}</Text>
        {isLoading || isError ? (
          isLoading ? (
            <Skeleton width={60} height={18} />
          ) : (
            <Text>type cant load</Text>
          )
        ) : (
          <View style={{ flexDirection: "row", gap: 5 }}>
            {pokemon.types?.map((type, index) => {
              const typeColor = TYPE_COLORS[type] || "#A8A878";

              return (
                <View
                  key={`${pokemon.name}-${type}-${index}`}
                  style={[styles.typeTag, { backgroundColor: typeColor }]}
                >
                  <Text style={styles.typeText}>{type}</Text>
                </View>
              );
            })}
          </View>
        )}
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
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
