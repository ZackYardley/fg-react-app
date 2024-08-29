import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CreditItem from "@/components/carbon-credit/CreditItem";
import ProjectCard from "@/components/carbon-credit/ProjectCard";
import { fetchCarbonCreditProducts, fetchCarbonCreditSubscription } from "@/api/products";
import { subscribeToCart } from "@/api/cart";
import { fetchSubscriptionStatus } from "@/api/subscriptions";
import { fetchEmissionsData } from "@/api/emissions";
import { PageHeader } from "@/components/common";
import { ShoppingCartBtn } from "@/components/ShoppingCartBtn";
import { CarbonCredit, CartItem } from "@/types";
import { formatPrice } from "@/utils";
import { router } from "expo-router";

export default function CarbonCreditScreen() {
  const [selectedProject, setSelectedProject] = useState<CarbonCredit | null>(null);
  const [credits, setCredits] = useState<CarbonCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subscriptionPrice, setSubscriptionPrice] = useState<number | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [creditsResult, userEmissionsData] = await Promise.all([
          fetchCarbonCreditProducts(),
          fetchEmissionsData(),
        ]);

        if (creditsResult && creditsResult.length > 0) {
          const credits = await Promise.all(
            creditsResult.map(async (credit) => ({
              ...credit,
              prices: credit.prices.filter((price) => price.active),
            }))
          );
          setCredits(credits);
          setSelectedProject(credits[0]);
        }

        if (userEmissionsData) {
          const userEmissions = userEmissionsData.totalEmissions;
          const subscriptionResult = await fetchCarbonCreditSubscription(userEmissions);
          if (subscriptionResult) {
            setSubscriptionPrice(subscriptionResult.recommendedPrice.unit_amount);
            const subscribed = await fetchSubscriptionStatus(subscriptionResult.product.id || "");
            setIsSubscribed(subscribed);
          }
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      } finally {
        setLoading(false);
      }
    };
    initializeData();

    // Subscribe to cart changes
    const unsubscribe = subscribeToCart((items) => {
      setCartItems(items);
    });

    // Cleanup subscription and prevent state updates on unmounted component
    return () => {
      unsubscribe();
    };
  }, []);

  const numItems = cartItems ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const renderCreditItem = ({ item }: { item: CarbonCredit }) =>
    loading ? (
      <CreditItem name={null} price={null} image={null} colors={["#eee", "#ddd", "#ccc"]} onPress={() => {}} />
    ) : (
      <CreditItem
        name={item.name}
        price={item.prices[0].unit_amount}
        image={item.images[0]}
        colors={[item.stripe_metadata_color_0, item.stripe_metadata_color_1, item.stripe_metadata_color_2]}
        onPress={() => setSelectedProject(item)}
      />
    );

  const renderHeader = () => (
    <>
      <PageHeader subtitle="Carbon Credits" description="Click on a project to learn more or purchase" />
      <ShoppingCartBtn numItems={numItems} />
    </>
  );

  const renderFooter = () => (
    <>
      <View style={styles.projectContainer}>{selectedProject && <ProjectCard project={selectedProject} />}</View>
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Carbon Credit Subscription</Text>
        <Text style={styles.footerText}>
          The Forevergreen carbon credit subscription includes the purchase of the nearest whole number of carbon
          credits to make sure you are net zero every month. This is the easiest way to reduce your impact on the planet
          and support awesome climate projects!
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/carbon-credit-sub")}>
          <Text style={styles.buttonText}>
            {loading
              ? "Loading..."
              : isSubscribed
              ? "Manage Subscription"
              : subscriptionPrice
              ? `${formatPrice(subscriptionPrice)}/Month`
              : "Subscription Unavailable"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexGrow: 1 }}>
        <FlatList
          ListHeaderComponent={renderHeader}
          data={credits}
          renderItem={renderCreditItem}
          keyExtractor={(item) => item.name}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          style={styles.flatList}
          ListFooterComponent={renderFooter}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  projectContainer: {
    padding: 16,
  },
  footer: {
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  footerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  footerText: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#409858",
    padding: 16,
    marginHorizontal: "auto",
    borderRadius: 9999,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    fontSize: 20,
    paddingHorizontal: 8,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
  flatList: {
    paddingHorizontal: 0,
  },
});
