import React, { useRef } from "react";
import { Text, StyleSheet } from "react-native";
import { TextInput, HelperText } from "react-native-paper";
import { useThemeColor } from "@/hooks";
import { ThemedText } from "../common";

const NumberInput = ({
  question,
  value,
  onChange,
  unit,
  label,
  error,
  disabled,
}: {
  question: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}) => {
  const inputRef = useRef<any>(null);
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "border");
  const primaryColor = useThemeColor({}, "primary");

  return (
    <>
      <ThemedText style={styles.question}>{question}</ThemedText>
      <TextInput
        ref={inputRef}
        placeholder={disabled ? "Loading..." : "Your Answer"}
        value={disabled ? "Loading" : value}
        onChangeText={onChange}
        keyboardType="numeric"
        mode="outlined"
        outlineStyle={styles.outlineStyle}
        outlineColor={borderColor}
        activeOutlineColor={primaryColor}
        style={[styles.input, { backgroundColor }]}
        textColor={textColor}
        right={label ? <TextInput.Affix text={label} textStyle={[styles.affixText, { color: textColor }]} /> : null}
        left={unit ? <TextInput.Affix text={unit} textStyle={[styles.affixText, { color: textColor }]} /> : null}
        disabled={disabled}
      />
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>
    </>
  );
};

const styles = StyleSheet.create({
  question: {
    marginTop: 24,
    fontSize: 20,
  },
  input: {
    width: "100%",
    marginTop: 16,
  },
  outlineStyle: {
    borderWidth: 1,
    borderRadius: 10,
  },
  affixText: {
    color: "#000",
  },
});

export default NumberInput;
