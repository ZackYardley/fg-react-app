import { View, type ViewProps } from "react-native";
import { useThemeColor } from "@/hooks";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const ThemedView = ({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) => {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "card");
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, "border");
  const textColor = useThemeColor({}, "text");

  return (
    <View
      style={[
        {
          backgroundColor,
          borderColor,
          borderWidth: 1,
          shadowColor: textColor,
          shadowRadius: 2,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
        },
        style,
      ]}
      {...otherProps}
    />
  );
};

export default ThemedView;
