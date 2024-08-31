import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';

const SCREEN_WIDTH = Dimensions.get('window').width;

const LearnScreen: React.FC = () => {
  const progress = 0.5; // You can adjust this value based on your logic
  const cardHeight = 100;
  const cardGap = 16;
  const totalHeight = (6 * cardHeight + 5 * cardGap) + 30 ;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Sustainability Journey</Text>
        <Text style={styles.subtitle}>Each month you are net-zero!</Text>
       
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
            {[1, 2, 3, 4, 5, 6].map((prize) => (
              <View key={prize} style={styles.prizeRow}>
                <View style={styles.card}>
                  <View style={styles.cardImage} />
                </View>
                <Text style={styles.boxText}>{prize}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
});

export default LearnScreen;