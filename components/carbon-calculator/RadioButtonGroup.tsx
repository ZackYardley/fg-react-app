import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import { ThemedText } from "../common";

const RadioButtonGroup = ({
  question,
  options,
  value,
  onChange,
}: {
  question: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.questionText}>{question}</ThemedText>
      <View style={styles.optionsContainer}>
        {options.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => onChange(item)}
            activeOpacity={0.7}
          >
            <View style={styles.optionRow}>
              <RadioButton.Android
                value={item}
                status={value === item ? "checked" : "unchecked"}
                onPress={() => onChange(item)}
                color="#44945F"
                uncheckedColor="#808080"
              />
              <ThemedText style={styles.optionText}>{item}</ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default RadioButtonGroup;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  questionText: {
    marginTop: 12,
    marginBottom: 12,
    fontSize: 20,
  },
  optionsContainer: {
    marginLeft: -8,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
  },
});
