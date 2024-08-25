import { getFirestore, collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { CarbonCredit, Price } from "@/types";

// Fetch prices for a specific product
const fetchPricesForProduct = async (productId: string): Promise<Price[]> => {
  const db = getFirestore();
  const pricesCollection = collection(db, "products", productId, "prices");
  const prices: Price[] = [];

  try {
    const querySnapshot = await getDocs(pricesCollection);
    querySnapshot.forEach((doc) => {
      const price = doc.data() as Omit<Price, "id">;
      prices.push({ ...price, id: doc.id });
    });
    return prices;
  } catch (error) {
    console.error(`Error fetching prices for product ${productId}:`, error);
    throw error;
  }
};

// Fetch all Carbon Credit products
const fetchCarbonCreditProducts = async (): Promise<CarbonCredit[]> => {
  const db = getFirestore();
  const productsCollection = collection(db, "products");
  const carbonCreditProducts: CarbonCredit[] = [];

  try {
    const q = query(productsCollection, where("stripe_metadata_product_type", "==", "Carbon Credit"));
    const querySnapshot = await getDocs(q);

    for (const doc of querySnapshot.docs) {
      const product = doc.data() as Omit<CarbonCredit, "id" | "prices">;
      const prices = await fetchPricesForProduct(doc.id);
      carbonCreditProducts.push({ ...product, id: doc.id, prices });
    }

    return carbonCreditProducts;
  } catch (error) {
    console.error("Error fetching Carbon Credit products from Firestore:", error);
    throw error;
  }
};

// Fetch a specific product by ID
const fetchSpecificCarbonCreditProduct = async (productId: string): Promise<CarbonCredit | null> => {
  const db = getFirestore();
  const productDocRef = doc(db, "products", productId);

  try {
    const productDoc = await getDoc(productDocRef);

    if (productDoc.exists()) {
      const productData = productDoc.data() as Omit<CarbonCredit, "id" | "prices">;
      const prices = await fetchPricesForProduct(productId);
      return { ...productData, id: productDoc.id, prices };
    } else {
      console.log("No such product found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching specific product from Firestore:", error);
    throw error;
  }
};

const fetchCarbonCreditSubscription = async (
  productId: string,
  userEmissions: number
): Promise<{ product: CarbonCredit; recommendedPrice: Price } | null> => {
  const db = getFirestore();
  const productDocRef = doc(db, "products", productId);

  try {
    const productDoc = await getDoc(productDocRef);

    if (productDoc.exists()) {
      const productData = productDoc.data() as Omit<CarbonCredit, "id" | "prices">;
      const prices = await fetchPricesForProduct(productId);
      const product: CarbonCredit = { ...productData, id: productDoc.id, prices };

      // Calculate the recommended price based on emissions
      const targetEmissions = 16; // Assuming 16 is the target
      const emissionsDifference = Math.max(0, userEmissions - targetEmissions);
      const priceIndex = Math.min(Math.floor(emissionsDifference / 2), 4);
      const priceValues = [1000, 2000, 3000, 4000, 5000];
      const recommendedPriceValue = priceValues[priceIndex];

      // Find the closest price in the product's price list
      const recommendedPrice = prices.reduce((closest, current) => {
        return Math.abs(current.unit_amount - recommendedPriceValue) <
          Math.abs(closest.unit_amount - recommendedPriceValue)
          ? current
          : closest;
      });

      return { product, recommendedPrice };
    } else {
      console.log("No such product found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching carbon credit subscription:", error);
    throw error;
  }
};

export {
  fetchPricesForProduct,
  fetchCarbonCreditProducts,
  fetchSpecificCarbonCreditProduct,
  fetchCarbonCreditSubscription,
};
