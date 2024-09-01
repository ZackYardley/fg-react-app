import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, Image, TouchableOpacity, Modal } from 'react-native';
import * as Progress from 'react-native-progress';
import { PageHeader, BackButton } from '@/components/common';
import { Sticker, Tote, Shirt, WaterBottle, CuttingBoard, Crewneck } from "@/constants/Images";

const prizeImages = [
  Sticker,
  Tote, 
  Shirt, 
  WaterBottle,
  CuttingBoard,
  Crewneck,
];

const prizeNames = [
  "Sticker",
  "Tote Bag",
  "T-Shirt",
  "Water Bottle",
  "Cutting Board",
  "Crewneck Sweater",
];

const prizeDescriptions = [
  "Welcome to the club! Enjoy this cool sticker to rep your new net-zero status 😎",
  "You have been net zero for 3 months! Go get some groceries in a reusable new tote 🛍️",
  "6 whole months of net-zero! Wear your eco-friendly shirt proudly you are awesome! 👕",
  "A year of no emissions! Very few can claim this title, ditch single use plastics with a reusable water bottle!  🚰",
  "Your amazing! Enjoy a sustainably harvested teak cutting board!",
  "You made it two whole years, you are a true part of the Forevergreen Family!",
];

const SCREEN_WIDTH = Dimensions.get('window').width;

const Popup: React.FC<{ visible: boolean; onClose: () => void; title: string; image: any; description: string }> = ({ visible, onClose, title, image, description }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{title}</Text>
        <View style={styles.modalBody}>
          <Image source={image} style={styles.modalImage} />
          <View style={styles.modalTextContainer}>
            <Text style={styles.modalDescription}>{description}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </Modal>
);

const LearnScreen: React.FC = () => {
  const [selectedPrize, setSelectedPrize] = useState<number | null>(null);
  const progress = 0.5; // You can adjust this value based on your logic
  const cardHeight = 100;
  const cardGap = 16;
  const totalHeight = (6 * cardHeight + 5 * cardGap) + 30;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <PageHeader title="Forever" titleAlt="green" subtitle="Sustainability Journey" description="Each month you are net-zero!" />
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
              <TouchableOpacity 
                key={index} 
                style={styles.prizeRow}
                onPress={() => setSelectedPrize(index)}
              >
                <View style={styles.card}>
                  <Image source={image} style={styles.cardImage} />
                </View>
                <Text style={styles.boxText}>{index + 1}</Text>
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
          description={prizeDescriptions[selectedPrize]}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  mainContent: {
    flexDirection: 'row',
    flex: 2,
    marginTop: 16,
  },
  progressBarContainer: {
    width: 30,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    transform: [{ rotate: '90deg' }],
  },
  prizesContainer: {
    flex: 1,
    marginLeft: 36,
  },
  prizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  cardImage: {
    backgroundColor: "white",
    borderRadius: 12,
    height: 76,
    width: 76,
  },
  boxText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalBody: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: '#409858',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LearnScreen;