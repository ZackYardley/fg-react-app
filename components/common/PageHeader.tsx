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
  const primaryColor = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={[styles.title, { color: textColor }]}>
          {title}
          <Text style={{ color: primaryColor }}>{titleAlt}</Text>
        </Text>
        <Text style={[styles.subtitle, { color: textColor }]}>{subtitle}</Text>
        {description && <Text style={[styles.description, { color: textColor }]}>{description}</Text>}
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
