import React from "react";
import { BarChart } from "react-native-chart-kit";
import { useThemeColor } from "@/hooks";
import { darkenColor } from "@/utils";

type BarChartProps = {
  names: string[];
  values: number[];
  colors: string[];
  width: number;
  backgroundColor: string;
};

const BarChartBreakdown = ({ names, values, colors, width, backgroundColor }: BarChartProps) => {
  const textColor = useThemeColor({}, "text");

  const data = {
    labels: names,
    datasets: [
      {
        data: values,
        colors: values.map((value, index) => () => colors[index]),
      },
    ],
  };

  const chartConfig = {
    backgroundColor: backgroundColor,
    backgroundGradientFrom: backgroundColor,
    backgroundGradientTo: backgroundColor,
    decimalPlaces: 0,
    color: (opacity = 1) => "#999999",
    labelColor: (opacity = 1) => textColor,
    barPercentage: 1.5,
  };

  return (
    <BarChart
      data={data}
      width={width}
      height={220}
      chartConfig={chartConfig}
      fromZero
      showBarTops={false}
      yAxisLabel=""
      yAxisSuffix=""
      withCustomBarColorFromData={true}
      flatColor={true}
      style={{}}
      yLabelsOffset={width / 7}
    />
  );
};

export default BarChartBreakdown;
