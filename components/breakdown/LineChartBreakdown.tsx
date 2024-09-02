import React, { useEffect, useState } from "react";
import { Dimensions, View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { fetchEmissionsData } from "@/api/emissions";
import dayjs from "dayjs";
import { Loading } from "@/components/common";

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
          <Text style={styles.legendText}>{dataset.label}</Text>
        </View>
      ))}
    </View>
  );
};

const LineChartBreakdown = ({ userId }: { userId?: string }) => {
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
      color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`,
      label: "Emissions this month"
    },
    { 
      data: offsetData, 
      color: (opacity = 1) => `rgba(64, 152, 88, ${opacity})`,
      label: "Offsets this month"
    },
  ];

  return (
    <View>
      <LineChart
        data={{
          labels: generateLastSixMonths().map((month) => dayjs(month).format("MMM")),
          datasets: datasets,
        }}
        width={screenWidth - 67}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#eeeeee",
          backgroundGradientTo: "#eeeeee",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(27, 117, 179, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          fillShadowGradientOpacity: 0,
          fillShadowGradientToOpacity: 0,
          propsForBackgroundLines: { stroke: "transparent" },
        }}
        bezier
        withInnerLines={false}
        withOuterLines={false}
        style={{ borderRadius: 16 }}
      />
      <Legend datasets={datasets} />
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
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