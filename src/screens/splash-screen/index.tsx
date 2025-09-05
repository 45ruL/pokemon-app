import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/pokemon");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.decorativeCircles}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.whiteCircle}>
            <Image
              source={require("../../assets/images/pokemon-logo.png")}
              style={styles.pokeballIcon}
            />
          </View>
        </View>

        <Text style={styles.title}>POKÉMON</Text>
        <Text style={styles.subtitle}>ADVENTURE</Text>

        <View style={styles.catchphraseContainer}>
          <Text style={styles.catchphrase}>Gotta Catch Em All!</Text>
          <Text style={styles.description}>
            Embark on an epic journey to discover,{"\n"}
            collect, and train amazing Pokémon{"\n"}
            creatures
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6C5CE7",
    position: "relative",
  },
  decorativeCircles: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  circle1: {
    width: 200,
    height: 200,
    top: 100,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    top: 300,
    left: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    bottom: 150,
    right: 50,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 40,
  },
  whiteCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  pokeballIcon: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    letterSpacing: 4,
    marginBottom: 60,
  },
  catchphraseContainer: {
    alignItems: "center",
  },
  catchphrase: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 20,
  },
});
