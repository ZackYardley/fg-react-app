import React from "react";
import { BarChart } from "react-native-chart-kit";

type BarChartProps = {
  names: string[];
  values: number[];
  colors: string[];
  width: number;
};

const BarChartBreakdown = ({ names, values, colors, width }: BarChartProps) => {
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
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(68, 148, 95, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
      yLabelsOffset={width / 6}
    />
  );
};

export default BarChartBreakdown;
