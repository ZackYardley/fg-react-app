import { View, Text, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks";

const PageHeader = ({
  title = "Forever",
  titleAlt = "green",
  subtitle,
  description,
}: {
  title?: string;
  titleAlt?: string;
  subtitle?: string;
  description?: string;
}) => {
  const testColor = useThemeColor({}, "text");
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={[styles.title, { color: testColor }]}>
          {title}
          <Text style={styles.titleGreen}>{titleAlt}</Text>
        </Text>
        <Text style={[styles.subtitle, { color: testColor }]}>{subtitle}</Text>
        <Text style={[styles.description, { color: testColor }]}>{description}</Text>
      </View>
    </View>
  );
};

export default PageHeader;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
  },
  headerContent: {
    alignItems: "center",
    marginTop: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: 256,
  },
  titleGreen: {
    color: "#22C55E",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
});
