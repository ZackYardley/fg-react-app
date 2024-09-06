import { View, Text, Image, StyleSheet } from "react-native";
import { TreeLogo } from "@/constants/Images";
import { useThemeColor } from "@/hooks";

const TitleWithLogo = ({ title, titleAlt }: { title: string; titleAlt: string }) => {
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");

  return (
    <View style={styles.headerContainer}>
      <Text style={[styles.title, { color: textColor }]}>
        {title} <Text style={[{ color: primaryColor }]}>{titleAlt}</Text>
      </Text>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={TreeLogo} resizeMode="contain" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: -1,
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 320,
    height: 160,
  },
});

export default TitleWithLogo;
