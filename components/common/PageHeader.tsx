import { View, Text, StyleSheet } from "react-native";
import { ThemedText } from "@/components/common";
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
  const primaryColor = useThemeColor({}, "primary");

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <ThemedText style={styles.title}>
          {title}
          <Text style={{ color: primaryColor }}>{titleAlt}</Text>
        </ThemedText>
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        {description && <ThemedText style={styles.description}>{description}</ThemedText>}
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
