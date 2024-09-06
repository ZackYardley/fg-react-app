import React from "react";
import { BarChart } from "react-native-chart-kit";
import { useThemeColor } from "@/hooks";
import { darkenColor } from "@/utils";

type BarChartProps = {
  names: string[];
  values: number[];
  colors: string[];
  width: number;
};

const BarChartBreakdown = ({ names, values, colors, width }: BarChartProps) => {
  const backgroundColor = useThemeColor({}, "primaryContainer");
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
    decimalPlaces: 0,
    color: (opacity = 1) => darkenColor(textColor, 50),
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
      yLabelsOffset={0}
    />
  );
};

export default BarChartBreakdown;
