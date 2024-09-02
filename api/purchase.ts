import { getFirestore, collection, getDoc, addDoc, serverTimestamp, query, getDocs, where } from "firebase/firestore";
import { TransactionItem } from "@/types";
import { getAuth } from "firebase/auth";

// const purchaseCarbonCredits = async (
//   userId: string,
//   items: TransactionItem[],
//   paymentIntentId: string
// ): Promise<{ success: boolean; error?: string }> => {
//   const db = getFirestore();
//   const userRef = doc(db, "users", userId);

//   try {
//     let newTotalOffset = 0;

//     // Use a transaction to ensure data consistency
//     await runTransaction(db, async (transaction) => {
//       const userDoc = await transaction.get(userRef);
//       if (!userDoc.exists()) {
//         throw new Error("User document does not exist!");
//       }

//       // Update user's carbon credits
//       const existingCredits = userDoc.data().carbonCredits || [];
//       const updatedCredits = items.map((item) => {
//         const existingCredit = existingCredits.find((credit: TransactionItem) => credit.id === item.id);
//         newTotalOffset += item.quantity; // Accumulate total offset
//         if (existingCredit) {
//           // If the credit already exists, update the quantity
//           return { id: item.id, quantity: existingCredit.quantity + item.quantity };
//         } else {
//           // If it's a new credit, add it to the array
//           return item;
//         }
//       });

//       // Merge the updated credits with the existing ones
//       const finalCredits = existingCredits
//         .filter((credit: TransactionItem) => !updatedCredits.some((uc) => uc.id === credit.id))
//         .concat(updatedCredits);

//       transaction.update(userRef, { carbonCredits: finalCredits });
//     });

//     const paymentRef = doc(db, "users", userId, "payments", paymentIntentId);

//     // Prepare simplified cart items for metadata
//     const simplifiedItems = items.map((item) => ({
//       id: item.id,
//       name: item.name,
//       productType: "carbon_credit",
//       quantity: item.quantity,
//       price: item.price,
//     }));

//     const updateData = { metadata: { items: simplifiedItems } };
//     await updateDoc(paymentRef, updateData);

//     const emissionsData = await fetchEmissionsData();
//     const oldTotalOffset = emissionsData?.totalOffset || 0;
//     saveEmissionsData({ totalOffset: oldTotalOffset + newTotalOffset });

//     return { success: true };
//   } catch (error) {
//     console.error("Error in purchaseCarbonCredits:", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "An unknown error occurred",
//     };
//   }
// };

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

const fetchSetupPaymentSheetParams = async (
  uid: string
): Promise<{
  setupIntent: string;
  ephemeralKey: string;
  customer: string;
}> => {
  const db = getFirestore();

  try {
    const checkoutSessionRef = collection(db, "users", uid, "checkout_sessions");
    const newSessionDoc = await addDoc(checkoutSessionRef, {
      client: "mobile",
      mode: "setup",
    });

    const maxAttempts = 10;
    const delayMs = 1000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));

      const updatedDoc = await getDoc(newSessionDoc);
      const data = updatedDoc.data();

      if (data?.setupIntentClientSecret && data?.ephemeralKeySecret && data?.customer) {
        return {
          setupIntent: data.setupIntentClientSecret,
          ephemeralKey: data.ephemeralKeySecret,
          customer: data.customer,
        };
      }
    }

    throw new Error("Timeout: Additional fields were not added within the expected time.");
  } catch (error) {
    console.error("Error creating or retrieving setup session:", error);
    throw error;
  }
};

const requestCarbonCredits = async (
  userId: string,
  items: TransactionItem[],
  paymentIntentId: string
): Promise<{ success: boolean; error?: string }> => {
  const db = getFirestore();
  const requestsRef = collection(db, "users", userId, "requests");

  try {
    await addDoc(requestsRef, {
      type: "carbonCredits",
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        productType: item.productType,
        quantity: item.quantity,
        price: item.price,
      })),
      paymentIntentId: paymentIntentId,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { success: false, error: "Failed to fetch user data." };
  }
};

const fetchCreditRequestByPaymentId = async (paymentIntentId: string) => {
  const db = getFirestore();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const requestsRef = collection(db, "users", userId, "requests");

  const q = query(requestsRef, where("paymentIntentId", "==", paymentIntentId));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      tyoe: data.type,
      items: data.items,
      paymentIntentId: data.paymentIntentId,
      status: data.status,
      createdAt: data.createdAt,
    };
  }
};

export {
  fetchOneTimePaymentSheetParams,
  fetchSubscriptionPaymentSheetParams,
  fetchSetupPaymentSheetParams,
  requestCarbonCredits,
  fetchCreditRequestByPaymentId,
};
