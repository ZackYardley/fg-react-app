import { useState, useEffect } from "react";
import { View, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { router } from "expo-router";
import { fetchEmissionsData } from "@/api/emissions";
import { fetchCarbonCreditProducts, fetchCarbonCreditSubscription } from "@/api/products";
import { subscribeToCart } from "@/api/cart";
import { fetchSubscriptionStatus } from "@/api/subscriptions";
import { PageHeader, ThemedSafeAreaView, ThemedView } from "@/components/common";
import CreditItem from "@/components/carbon-credit/CreditItem";
import ProjectCard from "@/components/carbon-credit/ProjectCard";
import { ShoppingCartBtn } from "@/components/ShoppingCartBtn";
import { darkenColor, formatPrice } from "@/utils";
import { CarbonCredit, CartItem } from "@/types";
import { ThemedText } from "@/components/common";
import { useThemeColor } from "@/hooks";
import { StatusBar } from "expo-status-bar";

export default function CarbonCreditScreen() {
  const [selectedProject, setSelectedProject] = useState<CarbonCredit | null>(null);
  const [credits, setCredits] = useState<CarbonCredit[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subscriptionPrice, setSubscriptionPrice] = useState<number | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const card = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");

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

          // Add placeholder credits to fill out the rows
          const placeholderCount = credits.length % 3 === 0 ? 0 : 3 - (credits.length % 3);
          const placeholderCredits = Array(placeholderCount).fill({
            name: "Coming Soon",
            prices: [{ unit_amount: 0 }],
            images: [],
            stripe_metadata_color_0: "#BBBBBB",
            stripe_metadata_color_1: "#EEEEEE",
            stripe_metadata_color_2: "#B4B4B4",
            isPlaceholder: true,
          });

          setCredits([...credits, ...placeholderCredits]);
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

  const renderCreditItem = ({ item }: { item: CarbonCredit }) => (
    <CreditItem
      name={item.name}
      price={item.prices[0].unit_amount}
      image={item.images[0]}
      colors={[item.stripe_metadata_color_0, item.stripe_metadata_color_1, item.stripe_metadata_color_2]}
      onPress={() => !item.isPlaceholder && setSelectedProject(item)}
      isPlaceholder={item.isPlaceholder}
    />
  );

  const renderSkeletonItem = () => (
    <CreditItem
      name={null}
      price={null}
      image={null}
      colors={[card, darkenColor(card, 0.1), darkenColor(card, 0.2)]}
      onPress={() => {}}
      isSkeleton={true}
    />
  );

  const renderHeader = () => (
    <>
      <PageHeader subtitle="Carbon Credits" description="Click on a project to learn more or purchase" />
    </>
  );

  const renderFooter = () => (
    <>
      <View style={styles.projectContainer}>
        {loading ? (
          <View style={[styles.skeletonCard, { height: 200, backgroundColor: card }]} />
        ) : (
          selectedProject && <ProjectCard project={selectedProject} />
        )}
      </View>
      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerTitle}>Carbon Credit Subscription</ThemedText>
        <ThemedText style={styles.footerText}>
          The Forevergreen carbon credit subscription includes the purchase of the nearest whole number of carbon
          credits to make sure you are net zero every month. This is the easiest way to reduce your impact on the planet
          and support awesome climate projects!
        </ThemedText>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: primary }]}
          onPress={() => router.push("/carbon-credit-sub")}
        >
          <ThemedText style={styles.buttonText}>
            {loading
              ? "Loading..."
              : isSubscribed
                ? "Manage Subscription"
                : subscriptionPrice
                  ? `${formatPrice(subscriptionPrice)}/Month`
                  : "Subscription Unavailable"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <FlatList
          ListHeaderComponent={renderHeader}
          data={[...Array(6)]} // Render 6 skeleton items
          renderItem={renderSkeletonItem}
          keyExtractor={(_, index) => `skeleton-${index}`}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          style={styles.flatList}
          ListFooterComponent={renderFooter}
        />
      );
    }

    return (
      <>
        <ShoppingCartBtn numItems={numItems} />
        <FlatList
          ListHeaderComponent={renderHeader}
          data={credits}
          renderItem={renderCreditItem}
          keyExtractor={(item, index) => item.name + index}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          style={styles.flatList}
          ListFooterComponent={renderFooter}
        />
      </>
    );
  };

  return (
    <ThemedSafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar />
      <View style={{ flexGrow: 1 }}>{renderContent()}</View>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  projectContainer: {
    padding: 16,
  },
  footer: {
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
    padding: 16,
    marginHorizontal: "auto",
    borderRadius: 9999,
    marginTop: 16,
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
  skeletonCard: {
    borderRadius: 8,
  },
});
