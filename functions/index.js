const functions = require("firebase-functions");
const admin = require("firebase-admin");

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
