import ErrorPage from "@/src/components/error-page";
import LoadingPage from "@/src/components/loading-page";
import { usePokemonList } from "@/src/hooks/usePokemon";
import {
  addFavorite,
  removeFavorite,
} from "@/src/store/favorites/favorite-slice";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { PokemonCard } from "./components/pokemon-card";
import { IPokemon } from "./components/types";

const PokemonHomeScreen: React.FC = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const items = useSelector((state: RootState) => state.favorites.items);
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePokemonList();

  const pokemons = data?.pages.flatMap((page) => page.results) ?? [];

  const handlePokemonPress = (pokemon: IPokemon) => {
    router.push(`/pokemon/${pokemon.name}`);
  };

  const handleToggleFavorite = (pokemon: IPokemon, isFavorite: boolean) => {
    return isFavorite
      ? dispatch(removeFavorite(pokemon.name))
      : dispatch(addFavorite(pokemon));
  };

  if (isLoading) {
    return <LoadingPage />;
  }
  if (isError) {
    return <ErrorPage onRetry={() => refetch()} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Image
            source={require("../../../assets/images/pokemon-logo.png")}
            style={styles.pokeballIcon}
          />
          <Text style={styles.headerText}>PokémonApp</Text>
        </View>
      </View>

      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          const isFavorite = items.some((p) => p.name === item.name);
          return (
            <PokemonCard
              key={item.name}
              pokemon={item}
              onPress={handlePokemonPress}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={isFavorite}
            />
          );
        }}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.containerList}
        columnWrapperStyle={styles.columnWrapper}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
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
    color: "#343A40",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  containerList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});

export default PokemonHomeScreen;
