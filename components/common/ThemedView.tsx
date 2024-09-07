import { View, type ViewProps } from "react-native";
import { useThemeColor } from "@/hooks";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const ThemedView = ({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) => {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "card");

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
};

export default ThemedView;
