const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Stripe = require("stripe");

admin.initializeApp();

exports.sendNotification = functions.https.onCall(async (data, context) => {
  console.log("Function called with data:", data);

  const {token, topic, notificationType, title, body} = data;
  console.log("Notification details:", {token, topic,
    notificationType, title, body});

  const message = {
    data: {
      type: notificationType,
      title: title,
      body: body,
    },
  };

  if (token) {
    message.token = token;
  } else if (topic) {
    message.topic = topic;
  } else {
    console.log("Neither token nor topic provided");
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Either token or topic must be provided.",
    );
  }

  try {
    console.log("Attempting to send message:", message);
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
    return {success: true, response: response};
  } catch (error) {
    console.error("Error sending message:", error);
    throw new functions.https.HttpsError("internal",
        "Error sending notification", error);
  }
});

// Function to add carbon credits to user's account
// Triger: document created in users/{uid}/requests
exports.handleCarbonCreditOneTimePurchase = functions.firestore
    .document("users/{userId}/requests/{requestId}")
    .onCreate(async (snap, context) => {
      const request = snap.data();
      const userId = context.params.userId;
      const requestId = context.params.requestId;

      // Check if the request is in 'pending' status and of type 'carbonCredits'
      if (request.status !== "pending" || request.type !== "carbonCredits") {
        console.log(`Request ${requestId} is not a pending carbon credit request. Skipping.`);
        return null;
      }

      const db = admin.firestore();
      const stripe = new Stripe(process.env.STRIPE_API_KEY, {apiVersion: "2023-10-16"});

      try {
        // Get the payment document and verify the payment intent ID
        const paymentSnapshot = await db
            .collection("users")
            .doc(userId)
            .collection("payments")
            .where("id", "==", request.paymentIntentId)
            .limit(1)
            .get();

        if (paymentSnapshot.empty) {
          console.error(`No matching payment found for request ${requestId}`);
          return null;
        }

        const paymentDoc = paymentSnapshot.docs[0];
        const paymentRef = paymentDoc.ref;

        const carbonCreditsRef = db.collection("users")
            .doc(userId)
            .collection("purchased")
            .doc("carbonCredits");

        // Get current year and month for emissions tracking
        const now = new Date();
        const emissionsDocId = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;
        const emissionsRef = db.collection("users")
            .doc(userId)
            .collection("emissions")
            .doc(emissionsDocId);

        // Fetch all Stripe products outside the transaction
        const stripeProducts = await Promise.all(
            request.items.map((item) => stripe.products.retrieve(item.id)),
        );

        const simplifiedItems = [];

        await db.runTransaction(async (transaction) => {
          // Perform all reads
          const carbonCreditsDoc = await transaction.get(carbonCreditsRef);
          const emissionsDoc = await transaction.get(emissionsRef);

          const carbonCredits = carbonCreditsDoc.exists ? carbonCreditsDoc.data() : {};
          let totalPurchasedCredits = 0;

          for (let i = 0; i < request.items.length; i++) {
            const item = request.items[i];
            const product = stripeProducts[i];

            if (!item.id || !item.quantity) {
              throw new Error(`Invalid item in request: ${JSON.stringify(item)}`);
            }

            if (!carbonCredits[item.id]) {
              carbonCredits[item.id] = {
                name: product.name,
                description: product.description,
                image: product.images[0],
                metadata: product.metadata,
                quantity: 0,
                firstPurchaseDate: admin.firestore.FieldValue.serverTimestamp(),
              };
            }

            carbonCredits[item.id].quantity += item.quantity;
            carbonCredits[item.id].lastPurchaseDate = admin.firestore.FieldValue.serverTimestamp();

            totalPurchasedCredits += item.quantity;

            simplifiedItems.push({
              id: item.id,
              name: product.name,
              productType: "carbon_credit",
              quantity: item.quantity,
              price: item.price, // Assuming price is available in the request item
            });

            const newQuantity = parseInt(product.metadata.quantity) - item.quantity;
            if (newQuantity < 0) {
              throw new Error(`Insufficient inventory for product ${item.id}`);
            }
          }

          // Update top-level fields
          carbonCredits.lastPurchaseDate = admin.firestore.FieldValue.serverTimestamp();
          carbonCredits.lastPurchaseAmount = totalPurchasedCredits;

          // Perform all writes
          transaction.set(carbonCreditsRef, carbonCredits, {merge: true});

          if (emissionsDoc.exists) {
            transaction.update(emissionsRef, {
              totalOffset: admin.firestore.FieldValue.increment(totalPurchasedCredits),
            });
          } else {
            transaction.set(emissionsRef, {
              totalOffset: totalPurchasedCredits,
            });
          }

          // Update payment document with metadata
          transaction.update(paymentRef, {
            metadata: {items: simplifiedItems},
          });
        });

        // Update Stripe products outside the transaction
        for (let i = 0; i < request.items.length; i++) {
          const item = request.items[i];
          const product = stripeProducts[i];
          const newQuantity = parseInt(product.metadata.quantity) - item.quantity;
          await stripe.products.update(item.id, {
            metadata: {quantity: newQuantity.toString()},
          });
        }

        // Update the request status to 'success'
        await snap.ref.update({status: "success"});

        console.log(`Successfully processed request ${requestId} for user ${userId}`);
        return null;
      } catch (error) {
        console.error(`Error processing request ${requestId}:`, error);
        await snap.ref.update({status: "error", errorMessage: error.message});
        return null;
      }
    });

// Function to handle subscription payments for carbon credits
// Trigger: document created in users/{uid}/payments
// (only subscription payments)
exports.handleCarbonCreditSubscriptionPayment = functions.firestore
    .document("users/{userId}/payments/{paymentId}")
    .onWrite(async (change, context) => {
      const payment = change.after.exists ? change.after.data() : null;
      const oldPayment = change.before.exists ? change.before.data() : null;
      const userId = context.params.userId;
      const paymentId = context.params.paymentId;

      // If the document was deleted, or if it's not an invoice payment, skip processing
      if (!payment || !payment.invoice) {
        console.log(`Payment ${paymentId} is not a valid subscription payment. Skipping.`);
        return null;
      }

      // Check if the payment status changed to "succeeded"
      if (payment.status !== "succeeded" || (oldPayment && oldPayment.status === "succeeded")) {
        console.log(`Payment ${paymentId} is not a newly succeeded payment. Skipping.`);
        return null;
      }

      const db = admin.firestore();
      const stripe = new Stripe(process.env.STRIPE_API_KEY, {apiVersion: "2023-10-16"});

      try {
        // Calculate the number of carbon credits (1 credit per 1000 cents, or $10)
        const creditsPurchased = Math.floor(payment.amount / 1000);

        // This should never happen, but just in case
        if (creditsPurchased <= 0) {
          console.log(`Payment ${paymentId} does not meet the minimum amount for carbon credits. Skipping.`);
          return null;
        }

        // Fetch all Stripe products outside the transaction
        const stripeProductsResponse = await stripe.products.list({limit: 100, active: true});

        // Filter for carbon credit products
        const carbonCreditProducts = stripeProductsResponse.data.filter((product) =>
          product.metadata && product.metadata.product_type === "Carbon Credit",
        );

        // This should also never happen, but just in case
        if (carbonCreditProducts.length === 0) {
          throw new Error("No carbon credit products available");
        }

        // Select a random carbon credit product
        // todo: get this reviewed by Jack
        const randomProduct = carbonCreditProducts[Math.floor(Math.random() * carbonCreditProducts.length)];

        const carbonCreditsRef = db.collection("users").doc(userId).collection("purchased").doc("carbonCredits");

        // Get current year and month for emissions tracking
        const now = new Date();
        const emissionsDocId = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`;
        const emissionsRef = db.collection("users").doc(userId).collection("emissions").doc(emissionsDocId);

        await db.runTransaction(async (transaction) => {
          // Perform reads
          const carbonCreditsDoc = await transaction.get(carbonCreditsRef);
          const emissionsDoc = await transaction.get(emissionsRef);

          // Update carbon credits
          const currentCredits = carbonCreditsDoc.exists ? carbonCreditsDoc.data() : {};

          if (!currentCredits[randomProduct.id]) {
            currentCredits[randomProduct.id] = {
              name: randomProduct.name,
              description: randomProduct.description,
              image: randomProduct.images[0],
              metadata: randomProduct.metadata,
              quantity: 0,
            };
          }

          currentCredits[randomProduct.id].quantity += creditsPurchased;
          currentCredits[randomProduct.id].lastPurchaseDate = admin.firestore.FieldValue.serverTimestamp();

          // Add or update top-level fields
          currentCredits.lastPurchaseDate = admin.firestore.FieldValue.serverTimestamp();
          currentCredits.lastPurchaseAmount = creditsPurchased;

          transaction.set(carbonCreditsRef, currentCredits, {merge: true});

          // Update emissions document
          if (emissionsDoc.exists) {
            transaction.update(emissionsRef, {
              totalOffset: admin.firestore.FieldValue.increment(creditsPurchased),
            });
          } else {
            transaction.set(emissionsRef, {
              totalOffset: creditsPurchased,
            });
          }
        });

        // Update Stripe product quantity
        const newQuantity = parseInt(randomProduct.metadata.quantity) - creditsPurchased;
        await stripe.products.update(randomProduct.id, {
          metadata: {...randomProduct.metadata, quantity: newQuantity.toString()},
        });

        console.log(`Successfully processed payment ${paymentId} for user ${userId}`);
        return null;
      } catch (error) {
        console.error(`Error processing payment ${paymentId}:`, error);
        // You might want to add error handling here, such as updating a status field in the payment document
        return null;
      }
    });
