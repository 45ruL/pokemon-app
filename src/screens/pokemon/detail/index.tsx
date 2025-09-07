import ErrorPage from "@/src/components/error-page";
import { Skeleton } from "@/src/components/skeleton";
import { STAT_COLORS } from "@/src/constants/stat-color";
import { TYPE_COLORS } from "@/src/constants/type-color";
import { usePokemonDetail } from "@/src/hooks/usePokemon";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyMoveCard } from "./components/key-move";
import { StatBar } from "./components/stat-bar";

const PokemonDetailScreen: React.FC = () => {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();

  const { data, isLoading, isError, refetch } = usePokemonDetail(name!);
  const primaryType = data?.types[0]?.type?.name;
  const headerColor = TYPE_COLORS[primaryType as string] || "#6C5CE7";

  const pokemonImage =
    data?.sprites.other["official-artwork"].front_default ||
    data?.sprites.front_default;

  const abilities = data?.abilities.map((a: any) => ({
    name: a.ability.name,
    isHidden: a.is_hidden,
  }));

  const stats = {
    hp: data?.stats.find((s: any) => s.stat.name === "hp")?.base_stat ?? 0,
    attack:
      data?.stats.find((s: any) => s.stat.name === "attack")?.base_stat ?? 0,
    defense:
      data?.stats.find((s: any) => s.stat.name === "defense")?.base_stat ?? 0,
    spAtk:
      data?.stats.find((s: any) => s.stat.name === "special-attack")
        ?.base_stat ?? 0,
    spDef:
      data?.stats.find((s: any) => s.stat.name === "special-defense")
        ?.base_stat ?? 0,
    speed:
      data?.stats.find((s: any) => s.stat.name === "speed")?.base_stat ?? 0,
  };
  const totalStats = Object.values(stats).reduce((a, b) => a + b, 0);

  const keyMoves = data?.moves.slice(0, 6).map((m: any) => ({
    name: m.move.name,
    type: primaryType,
  }));

  if (isError) {
    return <ErrorPage onRetry={() => refetch()} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={headerColor} />

      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.pokemonName}>{name}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.imageSection, { backgroundColor: headerColor }]}>
          {isLoading ? (
            <Skeleton width={200} height={200} borderRadius={100} />
          ) : (
            <View style={styles.pokemonImageContainer}>
              <View style={styles.pokemonImageBackground}>
                <Image
                  source={{ uri: pokemonImage || "" }}
                  style={styles.pokemonImage}
                />
              </View>

              <View style={styles.typeBadgeContainer}>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: TYPE_COLORS[primaryType as string] },
                  ]}
                >
                  <Text style={styles.typeBadgeIcon}>⚡</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.typeContainer}>
            {isLoading ? (
              <Skeleton width={100} height={32} />
            ) : (
              data?.types?.map((type, index) => (
                <View
                  key={index}
                  style={[
                    styles.typeTag,
                    {
                      backgroundColor:
                        TYPE_COLORS[type?.type?.name] || "#A8A878",
                    },
                  ]}
                >
                  <Text style={styles.typeText}>{type?.type?.name}</Text>
                </View>
              ))
            )}
          </View>

          {isLoading ? (
            <Skeleton width={"100%"} height={64} />
          ) : (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{data?.height}</Text>
                <Text style={styles.statLabel}>Height</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{data?.weight}</Text>
                <Text style={styles.statLabel}>Weight</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{data?.base_experience}</Text>
                <Text style={styles.statLabel}>Base Exp</Text>
              </View>
            </View>
          )}

          {isLoading ? (
            <View style={{ marginTop: 16 }}>
              <Skeleton width={"100%"} height={"100%"} />
            </View>
          ) : (
            <View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Abilities</Text>
                {abilities?.map((ability, index) => (
                  <View key={index} style={styles.abilityRow}>
                    <Text style={styles.abilityName}>{ability.name}</Text>
                    {ability.isHidden && (
                      <View style={styles.hiddenTag}>
                        <Text style={styles.hiddenText}>Hidden</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Base Stats</Text>
                <StatBar label="HP" value={stats?.hp} color={STAT_COLORS.hp} />
                <StatBar
                  label="Attack"
                  value={stats?.attack}
                  color={STAT_COLORS.attack}
                />
                <StatBar
                  label="Defense"
                  value={stats?.defense}
                  color={STAT_COLORS.defense}
                />
                <StatBar
                  label="Sp. Atk"
                  value={stats?.spAtk}
                  color={STAT_COLORS.spAtk}
                />
                <StatBar
                  label="Sp. Def"
                  value={stats?.spDef}
                  color={STAT_COLORS.spDef}
                />
                <StatBar
                  label="Speed"
                  value={stats?.speed}
                  color={STAT_COLORS.speed}
                />

                <View style={styles.totalStatRow}>
                  <Text style={styles.totalStatLabel}>Total</Text>
                  <Text style={styles.totalStatValue}>{totalStats ?? 0}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Key Moves</Text>
                <View style={styles.movesGrid}>
                  {keyMoves?.map((move, index) => (
                    <KeyMoveCard key={index} move={move} />
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  pokemonNumber: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  scrollContainer: {
    flex: 1,
  },
  imageSection: {
    paddingTop: 20,
    paddingBottom: 80,
    alignItems: "center",
  },
  pokemonImageContainer: {
    position: "relative",
    alignItems: "center",
  },
  pokemonImageBackground: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  pokemonImage: {
    width: 160,
    height: 160,
  },
  typeBadgeContainer: {
    position: "absolute",
    bottom: -20,
    right: 20,
  },
  typeBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  typeBadgeIcon: {
    fontSize: 20,
  },
  contentContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -50,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  typeTag: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#343A40",
    marginBottom: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#343A40",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "#6C757D",
    lineHeight: 20,
  },
  abilityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F4",
  },
  abilityName: {
    fontSize: 16,
    color: "#343A40",
  },
  hiddenTag: {
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  hiddenText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  statLabel: {
    width: 60,
    fontSize: 12,
    color: "#6C757D",
    fontWeight: "600",
  },
  totalStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
  },
  totalStatLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343A40",
  },
  totalStatValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#343A40",
  },
  movesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default PokemonDetailScreen;
