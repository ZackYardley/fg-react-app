import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { RadioButton, TextInput, HelperText } from "react-native-paper";
import { ThemedText } from "../common";
import { useThemeColor } from "@/hooks";

const TransportQuestion = ({
  question,
  useTransport,
  setUseTransport,
  frequency,
  setFrequency,
  frequencyError,
  label,
}: {
  question: string;
  useTransport: string;
  setUseTransport: (value: string) => void;
  frequency: string;
  setFrequency: (value: string) => void;
  frequencyError?: string;
  label?: string;
}) => {
  const inputRef = useRef<any>(null);
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "primary");
  const borderColor = useThemeColor({}, "border");

  return (
    <View style={styles.container}>
      <ThemedText style={styles.questionText}>{question}</ThemedText>
      <View style={styles.optionsContainer}>
        <View style={styles.optionsColumn}>
          {["Yes", "No"].map((option) => (
            <TouchableOpacity key={option} onPress={() => setUseTransport(option)} activeOpacity={0.7}>
              <View style={styles.optionRow}>
                <RadioButton.Android
                  value={option}
                  status={useTransport === option ? "checked" : "unchecked"}
                  onPress={() => setUseTransport(option)}
                  color={primaryColor}
                  uncheckedColor="#808080"
                />
                <ThemedText style={styles.optionText}>{option}</ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {useTransport === "Yes" && (
          <View style={styles.frequencyContainer}>
            <ThemedText style={styles.frequencyLabel}>How many times a week?</ThemedText>
            <TextInput
              ref={inputRef}
              placeholder=""
              value={frequency}
              onChangeText={(value) => setFrequency(value)}
              keyboardType="numeric"
              mode="outlined"
              outlineStyle={{
                borderWidth: 1,
                borderRadius: 10,
              }}
              outlineColor={borderColor}
              activeOutlineColor={primaryColor}
              style={[styles.textInput, { backgroundColor }]}
              dense={true}
              textColor={textColor}
              right={label ? <TextInput.Affix text={label} textStyle={{ color: textColor }} /> : null}
            />
            <HelperText type="error" visible={!!frequencyError}>
              {frequencyError}
            </HelperText>
          </View>
        )}
      </View>
    </View>
  );
};

export default TransportQuestion;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  questionText: {
    fontSize: 20,
    marginTop: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  optionsColumn: {
    marginLeft: -8,
    width: "50%",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
  },
  frequencyContainer: {
    width: "50%",
  },
  frequencyLabel: {
    fontSize: 14,
  },
  textInput: {
    height: 40,
    width: "auto",
    borderRadius: 10,
    marginTop: 12,
  },
});
