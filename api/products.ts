import { getFirestore, collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { CarbonCredit, CarbonCreditSubscription, Price } from "@/types";

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
  userEmissions: number
): Promise<{ product: CarbonCreditSubscription; recommendedPrice: Price } | null> => {
  const db = getFirestore();
  const productsCollection = collection(db, "products");

  try {
    // Query for the product with the specific metadata
    const q = query(
      productsCollection,
      where("stripe_metadata_product_type", "==", "Subscription"),
      where("stripe_metadata_subscription_type", "==", "Carbon Credit")
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching Carbon Credit Subscription product found");
      return null;
    }

    // Assume there's only one matching product, take the first one
    const productDoc = querySnapshot.docs[0];
    const productData = productDoc.data() as Omit<CarbonCreditSubscription, "id" | "prices">;
    const product: CarbonCreditSubscription = { ...productData, id: productDoc.id, prices: [] };

    // Fetch prices for this product
    const pricesCollection = collection(db, "products", product.id, "prices");
    const pricesSnapshot = await getDocs(pricesCollection);
    product.prices = pricesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Price));

    // Calculate the recommended price based on emissions
    const targetEmissions = 16;
    const roundedEmissions = Math.ceil(userEmissions);
    const emissionsDifference = Math.max(0, roundedEmissions - targetEmissions);

    // Sort prices by unit_amount to ensure we're selecting from low to high
    const sortedPrices = product.prices.sort((a, b) => a.unit_amount - b.unit_amount);

    // Find the appropriate price based on the emissions difference
    let recommendedPrice: Price;
    if (emissionsDifference <= 0) {
      recommendedPrice = sortedPrices[0]; // Lowest price
    } else if (emissionsDifference >= 5) {
      recommendedPrice = sortedPrices[sortedPrices.length - 1]; // Highest price
    } else {
      recommendedPrice = sortedPrices[emissionsDifference - 1];
    }

    return { product, recommendedPrice };
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
