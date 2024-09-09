import { useEffect, useState, useCallback, useRef } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, Alert, StatusBar } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { useStripe } from "@/utils/stripe";
import { ActivityIndicator } from "react-native-paper";
import { incrementQuantity, decrementQuantity, getCart, clearCart } from "@/api/cart";
import { PageHeader, BackButton, ThemedSafeAreaView, ThemedView, GreenCircles, ThemedText } from "@/components/common";
import { fetchOneTimePaymentSheetParams, requestCarbonCredits } from "@/api/purchase";
import { fetchSpecificCarbonCreditProduct } from "@/api/products";
import { useThemeColor } from "@/hooks";
import { formatPrice } from "@/utils";
import { TransactionItem, CarbonCredit } from "@/types";

interface CartCarbonCredits extends TransactionItem, CarbonCredit {}

export default function ShoppingCartScreen() {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const primary = useThemeColor({}, "primary");
  const error = useThemeColor({}, "error");
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const auth = getAuth();

  const [credits, setCredits] = useState<CartCarbonCredits[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const paymentIntentIdRef = useRef<string | null>(null);

  // Function to calculate cart total
  const getCartTotal = useCallback(() => {
    let total = 0;
    total += credits.reduce(
      (total, credit) => total + credit.prices.filter((price) => price.active)[0].unit_amount * credit.quantity,
      0
    );
    return total;
  }, [credits]);

  // Fetch cart items and calculate total on page mount
  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const cartItems = await getCart();
        const creditDetails = await Promise.all(
          cartItems
            .filter((item) => item.productType === "carbon_credit")
            .map(async (item) => {
              const creditDetails = await fetchSpecificCarbonCreditProduct(item.id);
              return {
                ...item,
                price: creditDetails?.prices.filter((price) => price.active)[0].unit_amount,
                ...creditDetails,
              };
            })
        );
        setCredits(creditDetails as CartCarbonCredits[]);
      } catch (error) {
        console.error("Error fetching cart:", error);
        Alert.alert("Error", "Failed to load your cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartDetails();
  }, []);

  // Initialize PaymentSheet
  const initializePaymentSheet = useCallback(async () => {
    if (!auth.currentUser) {
      router.replace("/login");
    }

    // Fetch payment sheet parameters
    try {
      setIsProcessingPayment(true);
      const { paymentIntent, ephemeralKey, customer } = await fetchOneTimePaymentSheetParams(
        getCartTotal(),
        auth.currentUser?.uid || ""
      );

      // Extract the Payment Intent ID without the secret
      const paymentIntentId = paymentIntent.split("_secret_")[0];
      paymentIntentIdRef.current = paymentIntentId;

      // Stripe configuration to open the payment sheet
      const { error } = await initPaymentSheet({
        merchantDisplayName: "Forevergreen",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: auth.currentUser?.displayName || "",
          email: auth.currentUser?.email || "",
        },
        applePay: {
          merchantCountryCode: "US",
          testEnv: true,
        },
        googlePay: {
          merchantCountryCode: "US",
          testEnv: true, // use test environment
        },
        returnURL: "com.fgdevteam.fgreactapp://stripe-redirect",
      });

      if (error) {
        console.error("Error initializing payment sheet:", error);
        Alert.alert("Error", "Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Error initializing payment:", error);
      Alert.alert("Error", "Failed to initialize payment. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  }, [auth.currentUser, getCartTotal, initPaymentSheet]);

  // Open payment sheet when user taps on "Buy Now"
  const openPaymentSheet = async () => {
    await initializePaymentSheet();

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      handleSuccessfulPurchase(paymentIntentIdRef.current || "");
    }
  };

  // Successful purchase logic
  const handleSuccessfulPurchase = async (paymentIntentId: string) => {
    try {
      setIsProcessingPayment(true);
      const result = await requestCarbonCredits(auth.currentUser?.uid || "", credits, paymentIntentId);

      if (result.success) {
        await clearCart();
        setCredits([]);

        Alert.alert("Purchase Successful", "Your carbon credits have been added to your account.");
        router.replace({
          pathname: "/purchase-complete",
          params: { paymentIntentId: paymentIntentId },
        });
      } else {
        throw new Error("Purchase failed");
      }
    } catch (error) {
      console.error("Error during purchase:", error);
      Alert.alert("Purchase Failed", "There was an error processing your purchase. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Increment quantity of a cart item
  const handleIncrementQuantity = async (itemId: string) => {
    try {
      setIsUpdatingQuantity(true);
      await incrementQuantity(itemId);
      const updatedCart = await getCart();
      const updatedItemsWithDetails = await Promise.all(
        updatedCart.map(async (item) => {
          const creditDetails = await fetchSpecificCarbonCreditProduct(item.id);
          return { ...item, ...creditDetails };
        })
      );
      setCredits(updatedItemsWithDetails as CartCarbonCredits[]);
    } catch (error) {
      console.error("Error incrementing quantity:", error);
      Alert.alert("Error", "Failed to update quantity. Please try again.");
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  // Decrement quantity of a cart item
  const handleDecrementQuantity = async (itemId: string) => {
    try {
      setIsUpdatingQuantity(true);
      await decrementQuantity(itemId);
      const updatedCart = await getCart();
      const updatedItemsWithDetails = await Promise.all(
        updatedCart.map(async (item) => {
          const creditDetails = await fetchSpecificCarbonCreditProduct(item.id);
          return { ...item, ...creditDetails };
        })
      );
      setCredits(updatedItemsWithDetails as CartCarbonCredits[]);
    } catch (error) {
      console.error("Error decrementing quantity:", error);
      Alert.alert("Error", "Failed to update quantity. Please try again.");
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setLoading(true);
      await clearCart();
      setCredits([]);
      Alert.alert("Cart Cleared", "All items have been removed from your cart.");
    } catch (error) {
      console.error("Error clearing cart:", error);
      Alert.alert("Error", "Failed to clear the cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Render cart items
  const renderItem = ({ item }: { item: CartCarbonCredits }) => (
    <ThemedView style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <LinearGradient
          colors={[item.stripe_metadata_color_0, item.stripe_metadata_color_1, item.stripe_metadata_color_2]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.gradient}
        >
          <Image source={item.images[0]} style={styles.itemImage} />
        </LinearGradient>
      </View>
      <View style={styles.itemActions}>
        <ThemedText style={styles.itemName}>{item.name}</ThemedText>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            onPress={() => handleDecrementQuantity(item.id)}
            style={[styles.quantityButton, { backgroundColor: textColor }]}
          >
            <Icon name="minus" size={24} color={backgroundColor} />
          </TouchableOpacity>
          <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
          <TouchableOpacity
            onPress={() => handleIncrementQuantity(item.id)}
            style={[styles.quantityButton, { backgroundColor: textColor }]}
          >
            <Icon name="plus" size={24} color={backgroundColor} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <ThemedText style={styles.itemPrice}>{formatPrice(item.prices[0].unit_amount * item.quantity)}</ThemedText>
      </View>
    </ThemedView>
  );

  const ListHeaderComponent = () => (
    <View style={{ marginBottom: 16 }}>
      <PageHeader subtitle="Shopping Cart" description="Make a Positive Impact on the Environment Today!" />
      <BackButton />
    </View>
  );

  const ListEmptyComponent = () =>
    loading ? (
      <View style={[styles.centered, { marginBottom: 16 }]}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    ) : (
      <ThemedView style={styles.emptyCartContainer}>
        <Ionicons name="cart" size={64} color={primary} />
        <ThemedText style={[styles.emptyCartTitle, { color: primary }]}>Your cart is empty</ThemedText>
        <ThemedText style={styles.emptyCartText}>
          Start adding carbon credits to make a positive impact on the environment!
        </ThemedText>
      </ThemedView>
    );

  const ListFooterComponent = () => (
    <ThemedView style={styles.footer}>
      <View style={styles.totalContainer}>
        <ThemedText style={styles.totalLabel}>Total:</ThemedText>
        <ThemedText style={styles.totalValueText}>{formatPrice(getCartTotal())}</ThemedText>
      </View>
      <TouchableOpacity
        style={[
          styles.purchaseButton,
          { backgroundColor: primary },
          (credits.length === 0 || isUpdatingQuantity || isProcessingPayment) && styles.disabledButton,
        ]}
        onPress={openPaymentSheet}
        disabled={credits.length === 0 || isUpdatingQuantity || isProcessingPayment}
      >
        <ThemedText style={styles.purchaseButtonText}>
          {loading
            ? "Loading..."
            : isUpdatingQuantity
              ? "Updating..."
              : isProcessingPayment
                ? "Processing..."
                : "Buy Now"}
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor, borderColor: primary }]}
        onPress={() => router.navigate("/carbon-credit")}
      >
        <ThemedText style={[styles.continueButtonText, { color: primary }]}>Continue Shopping</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.clearCartButton, { backgroundColor, borderColor: error }]}
        onPress={handleClearCart}
        disabled={credits.length === 0 || loading}
      >
        <ThemedText style={[styles.clearCartButtonText, { color: error }]}>Clear Cart</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <ThemedSafeAreaView style={styles.container}>
      <StatusBar />
      <GreenCircles />
      <FlatList
        data={credits}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        contentContainerStyle={styles.flatList}
      />
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flexGrow: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  creditList: {
    marginBottom: 24,
  },
  footer: {
    padding: 24,
    borderRadius: 20,
    marginTop: "auto",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 24,
    fontWeight: "bold",
  },
  totalValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalValueText: {
    marginLeft: 4,
    fontSize: 24,
    fontWeight: "bold",
  },
  purchaseButton: {
    borderRadius: 50,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  purchaseButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  continueButton: {
    borderWidth: 2,
    borderRadius: 50,
    padding: 16,
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  clearCartButton: {
    borderWidth: 2,
    borderRadius: 50,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  clearCartButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    marginBottom: 24,
    borderRadius: 20,
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  gradient: {
    width: 112,
    height: 112,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
  },
  itemImage: {
    width: 80,
    height: 86,
  },
  itemActions: {
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  itemName: {
    marginLeft: 16,
    fontWeight: "bold",
    fontSize: 18,
    maxWidth: 160,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: "black",
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "bold",
    height: 30,
    marginHorizontal: 8,
    textAlign: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinImage: {
    width: 20,
    height: 20,
  },
  itemPrice: {
    marginLeft: 8,
    fontSize: 20,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 48,
    borderRadius: 20,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});
