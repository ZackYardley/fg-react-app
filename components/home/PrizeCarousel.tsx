import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const prizes = [
  { name: 'Net Zero Tote Bag', image: require('@/assets/Images/tote.png') },
  { name: 'Reusable Water Bottle', image: require('@/assets/Images/waterbottle.png') },
  { name: 'Teak Cutting Board', image: require('@/assets/Images/cuttingboard.png') },
];

const PrizeCarousel: React.FC = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = Math.floor(scrollX._value / width) + 1;
      if (nextIndex < prizes.length) {
        scrollX.setValue(nextIndex * width);
      } else {
        scrollX.setValue(0);
      }
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Be Net-Zero, Win Prizes!</Text>
      <TouchableOpacity
        style={styles.prizeBox}
        onPress={() => router.push("/journey")}
      >
        <Text style={styles.netZeroText}>3</Text>
        <Text style={styles.subtitleText}>Months Net-Zero</Text>
      </TouchableOpacity>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      >
        {prizes.map((prize, index) => (
          <View style={styles.slide} key={index}>
            <Image source={prize.image} style={styles.image} />
            <Text style={styles.prizeText}>{prize.name}</Text>
          </View>
        ))}
      </Animated.ScrollView>
      <TouchableOpacity
        style={styles.allPrizesButton}
        onPress={() => router.push("/journey")}
      >
        <Text style={styles.allPrizesText}>All Prizes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  prizeBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  netZeroText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  subtitleText: {
    fontSize: 16,
    color: '#4CAF50',
  },
  slide: {
    width: width - 40, // Adjust based on your container's padding
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  prizeText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  allPrizesButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  allPrizesText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PrizeCarousel;