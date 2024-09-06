import { useRef } from "react";
import { View, useWindowDimensions, TouchableOpacity, StyleSheet, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { router } from "expo-router";
import { Sticker, Tote, Shirt, WaterBottle, CuttingBoard, Crewneck } from "@/constants/Images";
import { ThemedText, ThemedView } from "../common";
import { useThemeColor } from "@/hooks";

const Prizes = ({ isNetZero, displayNetZeroMonths }: { isNetZero: boolean; displayNetZeroMonths: string }) => {
  const backgroundColor = useThemeColor({}, "background");
  const positive = useThemeColor({}, "primary");
  const negative = useThemeColor({}, "negative");
  const carouselRef = useRef(null);
  const { width: screenWidth } = useWindowDimensions();
  const carouselData = [
    { title: "1 Month Net-Zero", image: Sticker },
    { title: "3 Months Net-Zero", image: Tote },
    { title: "6 Months Net-Zero", image: Shirt },
    { title: "1 Months Net-Zero", image: WaterBottle },
    { title: "18 Months Net-Zero", image: CuttingBoard },
    { title: "24 Months Net-Zero", image: Crewneck },
  ];

  const renderCarouselItem = ({ item }: any) => (
    <View style={styles.carouselItem}>
      <Image source={item.image} style={styles.carouselImage} />
      <ThemedText style={styles.carouselText}>{item.title}</ThemedText>
    </View>
  );
  return (
    <ThemedView style={styles.chartsSection}>
      <View style={[styles.chartBox, { backgroundColor }]}>
        <ThemedText style={styles.chartTitle}>Be Net-Zero, Earn Prizes!</ThemedText>
        <View style={styles.prizeSection}>
          <TouchableOpacity
            style={[styles.prizeBox, isNetZero ? {backgroundColor: positive} : {backgroundColor: negative}]}
            onPress={() => router.push("/journey")}
          >
            <ThemedText style={styles.monthNetZeroText}>{displayNetZeroMonths}</ThemedText>
            <ThemedText style={styles.subtitleText}>Months Net-Zero</ThemedText>
          </TouchableOpacity>
          <View style={styles.prizeSection}>
            <Carousel
              ref={carouselRef}
              loop
              width={screenWidth * 0.4}
              height={screenWidth * 0.4}
              autoPlay={true}
              data={carouselData}
              scrollAnimationDuration={1000}
              renderItem={renderCarouselItem}
            />
          </View>
        </View>
      </View>
    </ThemedView>
  );
};

export default Prizes;

const styles = StyleSheet.create({
  chartsSection: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  chartBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 24,
    marginBottom: 16,
  },
  prizeSection: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },
  prizeBox: {
    borderRadius: 16,
    width: "40%",
    padding: 16,
    // ADD BUTTON IS GREEN OR RED IF NET ZERO
  },
  monthNetZeroText: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitleText: {
    fontSize: 18,
    textAlign: "center",
  },
  carouselItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  carouselImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  carouselText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
