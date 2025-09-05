import { Image } from "expo-image";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FeatureCard } from "./components/feature-card";
import { appData, developer, features } from "./data";

const PokemonAboutScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.header}>
        <Text style={styles.headerText}>About</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.appInfoSection}>
          <View style={styles.appLogoContainer}>
            <View style={styles.appLogo}>
              <Image source={appData.logo} style={styles.logoImage} />
            </View>
          </View>

          <Text style={styles.appName}>{appData.name}</Text>
          <Text style={styles.appTagline}>{appData.tagline}</Text>

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version {appData.version}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What is PokéApp?</Text>
            <Text style={styles.sectionDescription}>{appData.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <View style={styles.featuresContainer}>
              {features.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Developer</Text>
            <View style={styles.developerCard}>
              <View style={styles.developerAvatar}>
                <Image
                  source={{ uri: developer.avatar }}
                  style={styles.avatarImage}
                />
              </View>
              <View style={styles.developerInfo}>
                <Text style={styles.developerName}>{developer.name}</Text>
                <Text style={styles.developerRole}>{developer.role}</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2025 PokéApp. All rights reserved.
            </Text>
          </View>
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
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 20,
    color: "#343A40",
    fontWeight: "bold",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#343A40",
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  appInfoSection: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  appLogoContainer: {
    marginBottom: 20,
  },
  appLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 20,
  },
  versionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  versionText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  contentContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#343A40",
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6C757D",
    lineHeight: 22,
  },
  featuresContainer: {
    gap: 12,
  },
  developerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 16,
  },
  developerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  developerInfo: {
    flex: 1,
  },
  developerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#343A40",
    marginBottom: 2,
  },
  developerRole: {
    fontSize: 14,
    color: "#6C757D",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
  },
  footerText: {
    fontSize: 12,
    color: "#6C757D",
    marginBottom: 4,
  },
  footerSubText: {
    fontSize: 11,
    color: "#ADB5BD",
  },
  bottomNavigation: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default PokemonAboutScreen;
