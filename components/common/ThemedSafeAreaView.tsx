import { SafeAreaView, type NativeSafeAreaViewProps } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks";

export type ThemedSafeAreaViewProps = NativeSafeAreaViewProps & {
  lightColor?: string;
  darkColor?: string;
};

const ThemedSafeAreaView = ({ style, lightColor, darkColor, ...otherProps }: ThemedSafeAreaViewProps) => {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  return <SafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />;
};

export default ThemedSafeAreaView;
