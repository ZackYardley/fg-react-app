import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from "react-native";
import * as Progress from "react-native-progress";
import { PageHeader, BackButton, ThemedSafeAreaView, ThemedText } from "@/components/common";
import { Sticker, Tote, Shirt, WaterBottle, CuttingBoard, Crewneck } from "@/constants/Images";
import { fetchEmissionsData } from "@/api/emissions"; // Assume this function exists to fetch user data
import { useThemeColor } from "@/hooks";

const prizeImages = [Sticker, Tote, Shirt, WaterBottle, CuttingBoard, Crewneck];

const prizeNames = ["Sticker", "Tote Bag", "T-Shirt", "Water Bottle", "Cutting Board", "Crewneck Sweater"];

const prizeMonths = [1, 3, 6, 12, 18, 24];

const prizeDescriptions = [
  "Welcome to the club! Enjoy this cool sticker to rep your new net-zero status 😎",
  "You have been net zero for 3 months! Go get some groceries in a reusable new tote 🛍️",
  "6 whole months of net-zero! Wear your eco-friendly shirt proudly you are awesome! 👕",
  "A year of no emissions! Very few can claim this title, ditch single use plastics with a reusable water bottle!  🚰",
  "Your amazing! Enjoy a sustainably harvested teak cutting board!",
  "You made it two whole years, you are a true part of the Forevergreen Family!",
];

const lockedPrizeDescriptions = [
  "Reach one month net zero and get an awesomw sticker!",
  "If you are net zero for 3 months, you will get this sweet new tote! 🛍️",
  "After 6 whole months of net-zero! You will get a new eco-friendly shirt! 👕",
  "After a full year of no emissions, you can ditch single use plastic bottles with a reusable water bottle!  🚰",
  "After 18 months you will get a sustainably harvested teak cutting board!",
  "After a full two years, you are a true part of the Forevergreen Family and will get a crewneck sweater!",
];

const Journey: React.FC = () => {
  const [selectedPrize, setSelectedPrize] = useState<number | null>(null);
  const cardHeight = 100;
  const cardGap = 16;
  const totalHeight = 6 * cardHeight + 5 * cardGap + 30;
  const [netZeroMonths, setNetZeroMonths] = useState(0);
  const [progress, setProgress] = useState(0);

  const backgroundColor = useThemeColor({}, "background");

  const Popup: React.FC<{ visible: boolean; onClose: () => void; title: string; image: any; description: string }> = ({
    visible,
    onClose,
    title,
    image,
    description,
  }) => (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
        <View style={[styles.modalContent, { backgroundColor }]}>
          <ThemedText style={styles.modalTitle}>{title}</ThemedText>
          <View style={styles.modalBody}>
            <Image source={image} style={styles.modalImage} />
            <View style={styles.modalTextContainer}>
              <ThemedText style={styles.modalDescription}>{description}</ThemedText>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchEmissionsData();
      if (data !== null) {
        const netZero = data.totalOffset >= data.monthlyEmissions;
        if (netZero && data.monthlyEmissions > 0) {
          const months = Math.floor(data.totalOffset - data.monthlyEmissions);
          const cappedMonths = Math.min(24, Math.max(0, months));
          setNetZeroMonths(cappedMonths);
          setProgress(cappedMonths / 24); // 24 months is the maximum
        } else {
          setNetZeroMonths(0);
          setProgress(0);
        }
      }
    };

    loadData();
  }, []);

  const getPrizeDescription = (index: number) => {
    if (netZeroMonths >= prizeMonths[index]) {
      return prizeDescriptions[index];
    } else {
      return `${lockedPrizeDescriptions[index]} You're currently at ${netZeroMonths} months.`;
    }
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PageHeader subtitle="Sustainability Journey" description="Build a sustainable future by living net-zero" />
        <BackButton />

        <View style={styles.mainContent}>
          <View style={styles.progressBarContainer}>
            <Progress.Bar
              progress={progress}
              width={totalHeight}
              height={20}
              color="#409858"
              unfilledColor="#FFF"
              borderColor="#000"
              borderWidth={1.5}
              borderRadius={9999}
              style={styles.progressBar}
            />
          </View>
          <View style={styles.prizesContainer}>
            {prizeImages.map((image, index) => (
              <TouchableOpacity key={index} style={styles.prizeRow} onPress={() => setSelectedPrize(index)}>
                <View style={netZeroMonths >= prizeMonths[index] ? styles.card : styles.grayCard}>
                  <Image source={image} style={styles.cardImage} />
                </View>
                <ThemedText style={styles.boxText}>{prizeMonths[index]}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      {selectedPrize !== null && (
        <Popup
          visible={selectedPrize !== null}
          onClose={() => setSelectedPrize(null)}
          title={prizeNames[selectedPrize]}
          image={prizeImages[selectedPrize]}
          description={getPrizeDescription(selectedPrize)}
        />
      )}
    </ThemedSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 16,
  },
  mainContent: {
    flexDirection: "row",
    flex: 2,
    marginTop: 16,
  },
  progressBarContainer: {
    width: 30,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    transform: [{ rotate: "90deg" }],
  },
  prizesContainer: {
    flex: 1,
    marginLeft: 36,
  },
  prizeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingRight: 16, // Add some padding to the right for the text
  },
  card: {
    backgroundColor: "#409858",
    padding: 12,
    borderRadius: 16,
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  grayCard: {
    backgroundColor: "#A0A0A0",
    padding: 12,
    borderRadius: 16,
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardImage: {
    backgroundColor: "white",
    borderRadius: 12,
    height: 76,
    width: 76,
  },

  boxText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  netZeroMonthsText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalBody: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  modalImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  modalTextContainer: {
    flex: 1,
  },
  modalDescription: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#409858",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Journey;
