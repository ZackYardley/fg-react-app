import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { fetchEmissionsData } from "@/api/emissions";
import dayjs from "dayjs";
import { Loading } from "@/components/common";

const generateLastSixMonths = (): string[] => {
  const months = [];
  for (let i = 0; i < 6; i++) {
    months.push(dayjs().subtract(i, "month").format("YYYY-MM"));
  }
  return months.reverse();
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
      setEmissionsData(results.map((result) => result?.totalEmissions || 0));
      setOffsetData(results.map((result) => result?.totalOffset || 0));
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const screenWidth = Dimensions.get("window").width;

  if (loading) {
    return <Loading />;
  }

  return (
    <LineChart
      data={{
        labels: generateLastSixMonths().map((month) => dayjs(month).format("MMM")), // Labels formatted as 'Jan', 'Feb', etc.
        datasets: [
          { data: emissionsData, color: (opacity = 1) => `rgba(31, 120, 180, ${opacity})` },
          { data: offsetData, color: (opacity = 1) => `rgba(180, 103, 31, ${opacity})` },
        ],
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
  );
};

export default LineChartBreakdown;
