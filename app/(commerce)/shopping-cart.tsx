import { useEffect, useState, useCallback, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import { getAuth } from "firebase/auth";
import { incrementQuantity, decrementQuantity, getCart, clearCart } from "@/api/cart";
import { TransactionItem, CarbonCredit } from "@/types";
import { router } from "expo-router";
import { PageHeader, BackButton } from "@/components/common";
import { fetchOneTimePaymentSheetParams, requestCarbonCredits } from "@/api/purchase";
import { formatPrice } from "@/utils";
import { fetchSpecificCarbonCreditProduct } from "@/api/products";
import { useStripe } from "@/utils/stripe";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-paper";

interface CartCarbonCredits extends TransactionItem, CarbonCredit {}

export default function ShoppingCartScreen() {
  const auth = getAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
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

  // Render cart items
  const renderItem = ({ item }: { item: CartCarbonCredits }) => (
    <View style={styles.itemContainer}>
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
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => handleDecrementQuantity(item.id)} style={styles.quantityButton}>
            <Icon name="minus" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleIncrementQuantity(item.id)} style={styles.quantityButton}>
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.itemPrice}>{formatPrice(item.prices[0].unit_amount * item.quantity)}</Text>
      </View>
    </View>
  );

  const ListHeaderComponent = () => (
    <View style={{ marginBottom: 16 }}>
      <PageHeader subtitle="Shopping Cart" description="Make a Positive Impact on the Environment Today!" />
      <BackButton />
    </View>
  );

  // TODO: This needs some flair
  const ListEmptyComponent = () =>
    loading ? (
      <View style={[styles.centered, { marginBottom: 16 }]}>
        <ActivityIndicator size="large" color="#409858" />
      </View>
    ) : (
      <View style={styles.emptyCartContainer}>
        <Ionicons name="cart" size={64} color="#409858" />
        <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
        <Text style={styles.emptyCartText}>
          Start adding carbon credits to make a positive impact on the environment!
        </Text>
      </View>
    );

  const ListFooterComponent = () => (
    <View style={styles.footer}>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValueText}>{formatPrice(getCartTotal())}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.purchaseButton,
          (credits.length === 0 || isUpdatingQuantity || isProcessingPayment) && styles.disabledButton,
        ]}
        onPress={openPaymentSheet}
        disabled={credits.length === 0 || isUpdatingQuantity || isProcessingPayment}
      >
        <Text style={styles.purchaseButtonText}>
          {loading
            ? "Loading..."
            : isUpdatingQuantity
            ? "Updating..."
            : isProcessingPayment
            ? "Processing..."
            : "Buy Now"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.continueButton} onPress={() => router.navigate("/carbon-credit")}>
        <Text style={styles.continueButtonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.greenCircleLarge} />
      <View style={styles.greenCircleSmall} />
      <View>
        <FlatList
          data={credits}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          ListFooterComponent={ListFooterComponent}
          contentContainerStyle={styles.flatList}
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
  flatList: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  greenCircleLarge: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "#409858",
    borderRadius: 150,
    bottom: "15%",
    right: "-35%",
  },
  greenCircleSmall: {
    position: "absolute",
    width: 300,
    height: 300,
    backgroundColor: "#409858",
    borderRadius: 9999,
    top: "25%",
    left: "-25%",
  },
  creditList: {
    marginBottom: 24,
  },
  footer: {
    backgroundColor: "#eeeeee",
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
    backgroundColor: "#409858",
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
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#409858",
    borderRadius: 50,
    padding: 16,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#409858",
    fontSize: 20,
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    marginBottom: 24,
    backgroundColor: "#EEEEEE",
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
    backgroundColor: "#eee",
    paddingVertical: 48,
    borderRadius: 20,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#409858",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});
