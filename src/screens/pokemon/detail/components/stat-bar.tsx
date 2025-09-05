import { StyleSheet, Text, View } from "react-native";
import { StatBarProps } from "./types";

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  maxValue,
  color,
}) => {
  const percentage = (value / maxValue) * 100;

  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statBarContainer}>
        <View style={styles.statBarBackground}>
          <View
            style={[
              styles.statBarFill,
              { width: `${percentage}%`, backgroundColor: color },
            ]}
          />
        </View>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabel: {
    width: 60,
    fontSize: 12,
    color: "#6C757D",
    fontWeight: "600",
  },
  statBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  statBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#E9ECEF",
    borderRadius: 4,
    marginRight: 12,
  },
  statBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  statValue: {
    fontSize: 12,
    color: "#343A40",
    fontWeight: "600",
    minWidth: 24,
    textAlign: "right",
  },
});
