import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ErrorPageProps = {
  message?: string;
  onRetry: () => void;
};

const ErrorPage: React.FC<ErrorPageProps> = ({
  message = "Something went wrong.",
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry}>
        <Text style={{ color: "#fff" }}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#d32f2f",
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    color: "#333",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#3f51b5",

    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});

export default ErrorPage;
