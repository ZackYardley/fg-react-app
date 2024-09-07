import { useEffect, useState } from "react";
import { Dimensions, View, StyleSheet, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { fetchEmissionsData } from "@/api/emissions";
import dayjs from "dayjs";
import { Loading, ThemedText } from "@/components/common";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks";

type Dataset = {
  data: number[];
  color: (opacity: number) => string;
  label: string;
};

const generateLastSixMonths = (): string[] => {
  const months = [];
  for (let i = 0; i < 6; i++) {
    months.push(dayjs().subtract(i, "month").format("YYYY-MM"));
  }
  return months.reverse();
};

const Legend: React.FC<{ datasets: Dataset[] }> = ({ datasets }) => {
  return (
    <View style={styles.legendContainer}>
      {datasets.map((dataset, index) => (
        <View key={index} style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: dataset.color(1) }]} />
          <ThemedText style={styles.legendText}>{dataset.label}</ThemedText>
        </View>
      ))}
    </View>
  );
};

const LineChartBreakdown = ({ userId }: { userId?: string }) => {
  const positive = useThemeColor({}, "primary");
  const negative = useThemeColor({}, "error");
  const backgroundColor = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const [emissionsData, setEmissionsData] = useState<number[]>([]);
  const [offsetData, setOffsetData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const months = generateLastSixMonths();
      const promises = months.map((month) => fetchEmissionsData(month, userId));
      const results = await Promise.all(promises);
      setEmissionsData(results.map((result) => result?.monthlyEmissions || 0));
      setOffsetData(results.map((result) => result?.totalOffset || 0));
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const screenWidth = Dimensions.get("window").width;

  if (loading) {
    return <Loading />;
  }

  const datasets: Dataset[] = [
    {
      data: emissionsData,
      color: (opacity = 1) => negative,
      label: "Emissions this month",
    },
    {
      data: offsetData,
      color: (opacity = 1) => positive,
      label: "Offsets this month",
    },
  ];

  return (
    <View style={[styles.emissionsGraph, { backgroundColor }]}>
      <ThemedText style={styles.sectionTitle}>Your net-zero journey</ThemedText>
      <View style={styles.graphContainer}>
        <View>
          <LineChart
            data={{
              labels: generateLastSixMonths().map((month) => dayjs(month).format("MMM")),
              datasets: datasets,
            }}
            width={screenWidth - 67}
            height={220}
            chartConfig={{
              backgroundGradientFrom: backgroundColor,
              backgroundGradientTo: backgroundColor,
              decimalPlaces: 0,
              color: (opacity = 1) => textColor,
              labelColor: (opacity = 1) => textColor,
              fillShadowGradientOpacity: 0,
              fillShadowGradientToOpacity: 0,
              propsForBackgroundLines: { stroke: "transparent" },
            }}
            bezier
            withInnerLines={false}
            withOuterLines={false}
            style={{ borderRadius: 16 }}
          />
        </View>
        <Legend datasets={datasets} />
      </View>
      <TouchableOpacity
        style={styles.offsetButton}
        onPress={() => {
          router.push("/offset-now");
        }}
      >
        <ThemedText style={styles.offsetButtonText}>Offset Now!</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  emissionsGraph: {
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  graphContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  offsetButton: {
    marginTop: 10,
    backgroundColor: "#22C55E",
    borderRadius: 50,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    height: 40,
    width: 150,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  offsetButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
});

export default LineChartBreakdown;
