import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export default function TabsLayout() {
  const favoritesCount =
    useSelector((state: RootState) => state.favorites.items).length || 0;
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="pokemon"
        options={{
          title: "Pokémon",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name={focused ? "list" : "list-outline"} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ focused, size }) => (
            <View>
              <Ionicons name={focused ? "star" : "star-outline"} size={size} />
              {!focused && favoritesCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -4,
                    backgroundColor: "red",
                    borderRadius: 8,
                    paddingHorizontal: 4,
                    minWidth: 16,
                    height: 16,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {favoritesCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={
                focused ? "information-circle" : "information-circle-outline"
              }
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
