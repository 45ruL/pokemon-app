import { TYPE_COLORS } from "@/src/constants/type-color";
import { StyleSheet, Text, View } from "react-native";
import { KeyMoveCardProps } from "./types";

export const KeyMoveCard: React.FC<KeyMoveCardProps> = ({ move }) => {
  const moveTypeColor = TYPE_COLORS[move.type as string] || "#A8A878";

  return (
    <View style={styles.moveCard}>
      <Text style={styles.moveName}>{move.name}</Text>
      <View style={styles.moveInfo}>
        <View style={[styles.moveTypeTag, { backgroundColor: moveTypeColor }]}>
          <Text style={styles.moveTypeText}>{move.type}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  moveCard: {
    width: "48%",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  moveName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#343A40",
    marginBottom: 8,
  },
  moveInfo: {
    alignItems: "flex-start",
  },
  moveTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  moveTypeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  moveCategoryText: {
    fontSize: 10,
    color: "#6C757D",
  },
});
