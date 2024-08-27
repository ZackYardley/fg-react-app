import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

const CustomTextInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  leftIcon,
  rightIcon,
  onRightIconPress,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        mode="outlined"
        dense={true}
        outlineStyle={{ borderColor: "#000" }}
        theme={{ roundness: 9999, colors: { background: "#fff" } }}
        textColor="#000"
        secureTextEntry={secureTextEntry}
        left={leftIcon && <TextInput.Icon icon={leftIcon} color="#000" style={styles.icon} />}
        right={
          rightIcon && <TextInput.Icon icon={rightIcon} color="#000" style={styles.icon} onPress={onRightIconPress} />
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
  },
  textInput: {
    width: "100%",
  },
  icon: {
    height: "100%",
    width: "100%",
  },
});

export default CustomTextInput;
