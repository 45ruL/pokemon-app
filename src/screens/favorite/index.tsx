import {
  addFavorite,
  removeFavorite,
} from "@/src/store/favorites/favorite-slice";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { FavoritePokemonCard } from "./components/favorite-card";
import { IPokemon } from "./components/types";

const PokemonFavoritesScreen: React.FC = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [searchText, setSearchText] = useState<string>("");

  const items = useSelector((state: RootState) => state.favorites.items);

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handlePokemonPress = (pokemon: IPokemon) => {
    router.push(`/pokemon/${pokemon.name}`);
  };

  const handleToggleFavorite = (pokemon: IPokemon, isFavorite: boolean) => {
    return isFavorite
      ? dispatch(removeFavorite(pokemon.name))
      : dispatch(addFavorite(pokemon));
  };
  const filteredItems: IPokemon[] = items.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalFavorites = items?.length || 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Image
            source={require("../../assets/images/pokemon-logo.png")}
            style={styles.pokeballIcon}
          />
          <Text style={styles.headerText}>PokémonApp</Text>
        </View>
        <Text style={styles.totalText}>Total: {totalFavorites}</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Pokémon..."
          value={searchText}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        style={styles.scrollContainer}
        data={filteredItems}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          const isFavorite = items.some((p) => p.name === item.name);

          return (
            <FavoritePokemonCard
              key={item.name}
              pokemon={item}
              onPress={handlePokemonPress}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  pokeballIcon: { width: 24, height: 24, marginRight: 8 },

  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#343A40",
  },
  totalText: {
    fontSize: 16,
    color: "#6C757D",
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: "#343A40",
  },
  scrollContainer: {
    flex: 1,
    marginTop: 8,
    paddingHorizontal: 20,
  },
});

export default PokemonFavoritesScreen;
