import { TYPE_COLORS } from "@/src/constants/type-color";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IFavoritePokemonCardProps } from "./types";

export const FavoritePokemonCard: React.FC<IFavoritePokemonCardProps> = ({
  pokemon,
  onPress,
  onToggleFavorite,
  isFavorite,
}) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons
          key={`star-full-${i}`}
          name="star"
          size={14}
          color="#FFD700"
          style={{ marginRight: 2 }}
        />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Ionicons
          key="star-half"
          name="star-half"
          size={14}
          color="#FFD700"
          style={{ marginRight: 2 }}
        />
      );
    }

    return stars;
  };

  return (
    <TouchableOpacity
      style={styles.pokemonCard}
      onPress={() => onPress(pokemon)}
    >
      <View style={styles.cardContent}>
        {/* Pokemon Image */}
        <View style={styles.pokemonImageContainer}>
          <Image source={{ uri: pokemon.image }} style={styles.pokemonImage} />
        </View>

        {/* Pokemon Info */}
        <View style={styles.pokemonInfo}>
          <View style={styles.pokemonHeader}>
            <Text style={styles.pokemonName}>{pokemon.name}</Text>
          </View>

          {/* Types */}
          <View style={styles.typesContainer}>
            {pokemon?.types?.map((type, index) => (
              <View
                key={index}
                style={[
                  styles.typeTag,
                  { backgroundColor: TYPE_COLORS[type] || "#A8A878" },
                ]}
              >
                <Text style={styles.typeText}>{type}</Text>
              </View>
            ))}
          </View>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <Text style={styles.starsText}>
              {renderStars(pokemon.rating || 0)}
            </Text>
            <Text style={styles.ratingText}>{pokemon.rating}</Text>
          </View>
        </View>

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(pokemon, !!isFavorite)}
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
  typesContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsText: {
    fontSize: 16,
    color: "#FFD700",
    marginRight: 6,
  },
  ratingText: {
    fontSize: 14,
    color: "#6C757D",
    fontWeight: "600",
  },
});
