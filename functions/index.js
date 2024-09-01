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
exports.handleCarbonCreditPurchase = functions.firestore
    .document("users/{userId}/requests/{requestId}")
    .onCreate(async (snap, context) => {
      const request = snap.data();
      const userId = context.params.userId;
      const requestId = context.params.requestId;

      // Check if the request is in 'pending' status and of type 'carbonCredits'
      if (request.status !== "pending" || request.type !== "carbonCredits") {
        console.log(`Request ${requestId} is not a
           pending carbon credit request. Skipping.`);
        return null;
      }

      const db = admin.firestore();
      const stripe = new Stripe(
          process.env.STRIPE_API_KEY, {apiVersion: "2023-10-16"});

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

        const carbonCreditsRef = db.collection("users")
            .doc(userId)
            .collection("purchased")
            .doc("carbonCredits");

        // Get current year and month for emissions tracking
        const now = new Date();
        const emissionsDocId = `${now.getFullYear()}-${(now.getMonth() + 1)
            .toString().padStart(2, "0")}`;
        const emissionsRef = db.collection("users")
            .doc(userId)
            .collection("emissions")
            .doc(emissionsDocId);

        // Fetch all Stripe products outside the transaction
        const stripeProducts = await Promise.all(
            request.items.map((item) => stripe.products.retrieve(item.id)),
        );

        await db.runTransaction(async (transaction) => {
          // Perform all reads
          const carbonCreditsDoc = await transaction.get(carbonCreditsRef);
          const emissionsDoc = await transaction.get(emissionsRef);

          const carbonCredits = carbonCreditsDoc.exists ?
              carbonCreditsDoc.data().credits : {};
          let totalPurchasedCredits = 0;

          for (let i = 0; i < request.items.length; i++) {
            const item = request.items[i];
            const product = stripeProducts[i];

            if (!item.id || !item.quantity) {
              throw new Error(
                  `Invalid item in request: ${JSON.stringify(item)}`);
            }

            carbonCredits[item.id] = carbonCredits[item.id] || {
              quantity: 0,
              firstPurchaseDate: admin.firestore.FieldValue.serverTimestamp(),
            };
            carbonCredits[item.id].quantity += item.quantity;
            carbonCredits[item.id].lastPurchaseDate = admin.firestore
                .FieldValue.serverTimestamp();

            totalPurchasedCredits += item.quantity;

            const newQuantity = parseInt(product.metadata.quantity) -
                item.quantity;
            if (newQuantity < 0) {
              throw new Error(`Insufficient inventory for product ${item.id}`);
            }
          }

          // Perform all writes
          transaction.set(carbonCreditsRef, {credits: carbonCredits},
              {merge: true});

          if (emissionsDoc.exists) {
            transaction.update(emissionsRef, {
              totalOffset: admin.firestore.FieldValue
                  .increment(totalPurchasedCredits),
            });
          } else {
            transaction.set(emissionsRef, {
              totalOffset: totalPurchasedCredits,
            });
          }
        });

        // Update Stripe products outside the transaction
        for (let i = 0; i < request.items.length; i++) {
          const item = request.items[i];
          const product = stripeProducts[i];
          const newQuantity = parseInt(product.metadata.quantity) -
              item.quantity;
          await stripe.products.update(item.id, {
            metadata: {quantity: newQuantity.toString()},
          });
        }

        // Update the request status to 'success'
        await snap.ref.update({status: "success"});

        console.log(`
          Successfully processed request ${requestId} for user ${userId}`);
        return null;
      } catch (error) {
        console.error(`Error processing request ${requestId}:`, error);
        await snap.ref.update({status: "error", errorMessage: error.message});
        return null;
      }
    });
