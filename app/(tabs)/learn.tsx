import { useState, useEffect } from "react";
import { ScrollView, Text, Pressable, View, StyleSheet, StatusBar, Dimensions, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { isUserSubscribedMailChimp, updateUserSubscriptionMailChimp } from "@/api/subscriptions";
import { getAuth } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { PageHeader } from "@/components/common";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Book, Camera, Blog, FastFacts, Credit, Newsletter, Methodology,} from "@/constants/Images";
import { useRouter } from 'expo-router';


const { width: screenWidth } = Dimensions.get('window');


const LearnScreen = () => {
  const [loading, setLoading] = useState(true);
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const subscribed = await isUserSubscribedMailChimp(user?.uid || "");
        setIsNewsletterSubscribed(subscribed);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user?.uid]);

  const handleOpenLink = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  const handleOpenPdf = () => {
    router.push('/pdf');
  };

  const handleNewsletterSubscription = async () => {
    try {
      const newStatus = !isNewsletterSubscribed;
      await updateUserSubscriptionMailChimp(user?.uid || "", newStatus);
      setIsNewsletterSubscribed(newStatus);
    } catch (error) {
      console.error("Error updating newsletter subscription:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={[styles.circle, styles.topLeftCircle]} />
          <View style={[styles.circle, styles.bottomRightCircle]} />

          <PageHeader subtitle="Learn" />

          { /* Resource Guides */}
        
          <View style={styles.resource}>
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Resource Guides</Text>
                <Text style={styles.cardText}>
                Check out our  guides with info about how to live a sustainable lifestyle!                </Text>
                <Pressable style={styles.button} onPress={() => handleOpenLink("https://www.forevergreen.earth/")}>
                  <Text style={styles.buttonText}>Explore</Text>
                </Pressable>
              </View>
              <View style={styles.imageContainer}>
                <Image source={Book} style={styles.image} resizeMode="contain" />
              </View>        
            </View>
          </View>

          { /* Course */}
        
          <View style={styles.resource}>
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Courses</Text>
                <Text style={styles.cardText}>  
                  Follow at your own pace: courses about sustainable living!                </Text>
                <Pressable style={styles.button} onPress={() => handleOpenLink("https://www.forevergreen.earth/")}>
                  <Text style={styles.buttonText}>Explore</Text>
                </Pressable>
              </View>
              <View style={styles.imageContainer}>
                <Image source={Camera} style={styles.image} resizeMode="contain" />
              </View>        
            </View>
          </View>

          { /* Blogs */}
        
          <View style={styles.resource}>
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Blogs</Text>
                <Text style={styles.cardText}>
                Blogs about hot climate topics: easy to read and educational!
                </Text>
                <Pressable style={styles.button} onPress={() => handleOpenLink("https://www.forevergreen.earth/")}>
                  <Text style={styles.buttonText}>Read Now</Text>
                </Pressable>
              </View>
              <View style={styles.imageContainer}>
                <Image source={Blog} style={styles.image} resizeMode="contain" />
              </View>        
            </View>
          </View>

          { /* Fast Facts */}
        
          <View style={styles.resource}>
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Fast Facts</Text>
                <Text style={styles.cardText}>
                  Want a quick fact about climate related topics to expand your view?                </Text>
                <Pressable style={styles.button} onPress={() => handleOpenLink("https://www.forevergreen.earth/")}>
                  <Text style={styles.buttonText}>View</Text>
                </Pressable>
              </View>
              <View style={styles.imageContainer}>
                <Image source={FastFacts} style={styles.image} resizeMode="contain" />
              </View>        
            </View>
          </View>

          { /* Credit */}
        
          <View style={styles.resource}>
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Carbon Credits</Text>
                <Text style={styles.cardText}>
                  Learn more about Carbon Credits and what goes into our projects!            </Text>
                <Pressable style={styles.button} onPress={() => handleOpenLink("https://www.forevergreen.earth/")}>
                  <Text style={styles.buttonText}>View</Text>
                </Pressable>
              </View>
              <View style={styles.imageContainer}>
                <Image source={Credit} style={styles.image} resizeMode="contain" />
              </View>        
            </View>
          </View>


          { /* Methodology */}
        
          <View style={styles.resource}>
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Methodology</Text>
                <Text style={styles.cardText}>
                  Find out how we calculate your emissions first-hand!            </Text>
                <Pressable style={styles.button} onPress={handleOpenPdf}>
                  <Text style={styles.buttonText}>Learn More</Text>
                </Pressable>
              </View>
              <View style={styles.imageContainer}>
                <Image source={Methodology} style={styles.image} resizeMode="contain" />
              </View>        
            </View>
          </View>

          { /* Methodology */}


          <View style={styles.resource}>
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Newsletter</Text>
                <Text style={styles.cardText}>
                Stay up to date with the latest sustainability tips and eco-friendly news!                  </Text>
                <Pressable style={styles.button} onPress={() => handleOpenLink("https://www.forevergreen.earth/")}>
                  <Text style={styles.buttonText}>View</Text>
                </Pressable>
              </View>
              <View style={styles.imageContainer}>
                <Image source={Newsletter} style={styles.image} resizeMode="contain" />
              </View>        
            </View>
          </View>

          
        

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LearnScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 2,
    flexDirection: "column",
    paddingHorizontal: 24,
  },
  circle: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "#409858",
    borderRadius: 150,
  },
  topLeftCircle: {
    top: 150,
    left: -150,
  },
  bottomRightCircle: {
    top: 500,
    left: 300,
  },
  header: {
    alignItems: "center",
    marginTop: 32,
  },
  titleText: {
    fontSize: 48,
    fontWeight: "bold",
  },
  greenText: {
    color: "#409858",
  },
  subtitleText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  card: {
    width: '80%',
    backgroundColor: "#eeeeee",
    padding: 16,
    borderRadius: 16,
    marginRight: '2%',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 8,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#409858",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 160,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  resource: {
    flex: 2,
    flexDirection: "row",
    marginTop: 24,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '20%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '200%',
    height: '200%',
  },
});
