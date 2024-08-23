import { getFirestore, doc, runTransaction, serverTimestamp, collection, getDoc, addDoc } from "firebase/firestore";
import { CartItem, CarbonCredit } from "@/types";

// Purchase carbon credits
const purchaseCarbonCredits = async (userId: string, items: CartItem[], paymentIntentId: string) => {
  const db = getFirestore();
  const userRef = doc(db, "users", userId);

  try {
    // Calculate total amount
    let totalAmount = 0;
    const creditPromises = items.map(async (item) => {
      const creditRef = doc(db, "carbonCredits", item.id);
      const creditDoc = await getDoc(creditRef);
      if (!creditDoc.exists()) {
        throw new Error(`Carbon credit with ID ${item.id} does not exist`);
      }
      const creditData = creditDoc.data() as CarbonCredit;
      totalAmount += creditData.price * item.quantity;
      return { id: item.id, quantity: item.quantity };
    });
    const purchasedCredits = await Promise.all(creditPromises);

    // Use a transaction to ensure data consistency
    const result = await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error("User document does not exist!");
      }

      // Create a new transaction document
      const transactionRef = doc(collection(db, "users", userId, "transactions"));
      const transactionData = {
        credits: purchasedCredits,
        totalAmount,
        purchaseDate: serverTimestamp(),
        paymentIntentId: paymentIntentId, // Add the paymentIntentId to the transaction data
      };

      transaction.set(transactionRef, transactionData);

      // Update user's carbon credits
      const existingCredits = userDoc.data().carbonCredits || [];
      const updatedCredits = purchasedCredits.map((item) => {
        const existingCredit = existingCredits.find((credit: CartItem) => credit.id === item.id);
        if (existingCredit) {
          // If the credit already exists, update the quantity
          return {
            id: item.id,
            quantity: existingCredit.quantity + item.quantity,
          };
        } else {
          // If it's a new credit, add it to the array
          return item;
        }
      });

      // Merge the updated credits with the existing ones
      const finalCredits = existingCredits
        .filter((credit: CartItem) => !updatedCredits.some((uc) => uc.id === credit.id))
        .concat(updatedCredits);

      transaction.update(userRef, {
        carbonCredits: finalCredits,
      });

      return transactionRef.id; // Return the transaction ID
    });

    return {
      success: true,
      transactionId: result,
    };
  } catch (error) {
    console.error("Error in purchaseCarbonCredits:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

const fetchOneTimePaymentSheetParams = async (
  amount: number,
  uid: string
): Promise<{
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
}> => {
  const db = getFirestore();

  try {
    const checkoutSessionRef = collection(db, "users", uid, "checkout_sessions");
    const newSessionDoc = await addDoc(checkoutSessionRef, {
      client: "mobile",
      mode: "payment",
      amount: amount,
      currency: "usd",
    });
    // console.log("New session doc:", newSessionDoc);

    // Poll for the additional fields
    const maxAttempts = 10;
    const delayMs = 1000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      // console.log("Polling for additional fields...");
      // console.log("Attempt:", attempt);

      const updatedDoc = await getDoc(newSessionDoc);
      const data = updatedDoc.data();

      if (data?.paymentIntentClientSecret && data?.ephemeralKeySecret && data?.customer) {
        // console.log("Additional fields added to the session:", data);
        return {
          paymentIntent: data.paymentIntentClientSecret,
          ephemeralKey: data.ephemeralKeySecret,
          customer: data.customer,
        };
      }
    }

    throw new Error("Timeout: Additional fields were not added within the expected time.");
  } catch (error) {
    console.error("Error creating or retrieving checkout session:", error);
    throw error;
  }
};

const fetchSubscriptionPaymentSheetParams = async (
  price: string,
  uid: string
): Promise<{
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
}> => {
  const db = getFirestore();

  try {
    const checkoutSessionRef = collection(db, "users", uid, "checkout_sessions");
    const newSessionDoc = await addDoc(checkoutSessionRef, {
      client: "mobile",
      mode: "subscription",
      price: price,
    });
    // console.log("New session doc:", newSessionDoc);

    // Poll for the additional fields
    const maxAttempts = 10;
    const delayMs = 1000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      // console.log("Polling for additional fields...");
      // console.log("Attempt:", attempt);

      const updatedDoc = await getDoc(newSessionDoc);
      const data = updatedDoc.data();

      if (data?.paymentIntentClientSecret && data?.ephemeralKeySecret && data?.customer) {
        // console.log("Additional fields added to the session:", data);
        return {
          paymentIntent: data.paymentIntentClientSecret,
          ephemeralKey: data.ephemeralKeySecret,
          customer: data.customer,
        };
      }
    }

    throw new Error("Timeout: Additional fields were not added within the expected time.");
  } catch (error) {
    console.error("Error creating or retrieving checkout session:", error);
    throw error;
  }
};

export { purchaseCarbonCredits, fetchOneTimePaymentSheetParams, fetchSubscriptionPaymentSheetParams };
