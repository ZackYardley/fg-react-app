import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Slider } from "@react-native-assets/slider";
import { ThemedText } from "../common";

interface QuestionSliderProps {
  question: string;
  value: number;
  onChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  useColoredSlider?: boolean; // New prop to toggle colored slider
}

const QuestionSlider = ({
  question,
  value,
  onChange,
  minimumValue,
  maximumValue,
  useColoredSlider = false, // Default to false for backwards compatibility
}: QuestionSliderProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const getColor = (val: number) => {
    if (!useColoredSlider) {
      return { trackColor: "#8E8F8E", thumbColor: "#8E8F8E" };
    }
    if (val <= 2) {
      return { trackColor: "#008450", thumbColor: "#008450" }; // Green shades
    } else if (val <= 5) {
      return { trackColor: "#EFB700", thumbColor: "#EFB700" }; // Yellow shades
    } else {
      return { trackColor: "#B81D13", thumbColor: "#B81D13" }; // Red shades
    }
  };

  const { trackColor, thumbColor } = getColor(localValue);

  const handleValueChange = (newValue: number) => {
    setLocalValue(newValue);
  };

  const handleSlidingComplete = (newValue: number) => {
    onChange(newValue);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.questionText}>{question}</ThemedText>
      <View style={styles.sliderContainer}>
        <Slider
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={1}
          value={localValue}
          onValueChange={handleValueChange}
          onSlidingComplete={handleSlidingComplete}
          minimumTrackTintColor={trackColor}
          maximumTrackTintColor="#D9D9D9"
          thumbTintColor={thumbColor}
          trackHeight={9}
          thumbSize={20}
          CustomMark={({ value: markValue, active }) => (
            <View style={styles.labelsContainer}>
              <ThemedText style={[styles.labelText, active && styles.activeLabel]}>
                {markValue < 7 ? markValue : "7+"}
              </ThemedText>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 32,
  },
  questionText: {
    fontSize: 20,
    marginTop: 32,
  },
  sliderContainer: {
    marginTop: 16,
  },
  labelsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 64,
    backgroundColor: "transparent",
    height: 18,
    width: 18,
    marginRight: -9,
  },
  labelText: {
    textAlign: "center",
    fontSize: 14,
  },
  activeLabel: {
    fontWeight: "bold",
  },
});

export default QuestionSlider;
