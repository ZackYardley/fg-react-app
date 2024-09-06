import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { useThemeColor } from "@/hooks";

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
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const backgroundColor = useThemeColor({}, "background");

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
        outlineStyle={{ borderColor: textColor }}
        theme={{ roundness: 9999, colors: { background: backgroundColor } }}
        textColor={textColor}
        secureTextEntry={secureTextEntry}
        left={leftIcon && <TextInput.Icon icon={leftIcon} color={textColor} style={styles.icon} />}
        right={
          rightIcon && <TextInput.Icon icon={rightIcon} color={textColor} style={styles.icon} onPress={onRightIconPress} />
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
