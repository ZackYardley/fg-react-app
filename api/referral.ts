import { APP_STORE_URL, APP_URL, PLAY_STORE_URL } from "@/constants";
import { getFirestore, doc, runTransaction, getDoc, serverTimestamp } from "firebase/firestore";
import { sendEmail } from "./email";
import { getAuth } from "firebase/auth";
import { TopReferrer, ReferralLeaderboard } from "@/types";

const sendReferralEmail = async (
  email: string,
  friendName: string,
  referrerName: string,
  note: string
): Promise<void> => {
  const subject = "🌿 Join Forevergreen: Your Friend's Invitation to a Greener Future!";
  const text = `Hi ${friendName}!

Great news! 🎉 Your friend ${referrerName} thinks you'd be a fantastic addition to our Forevergreen community. They've invited you to join us in making a positive impact on our planet!

${note && referrerName + " says: " + note}

Forevergreen is more than just an app—it's a movement towards a sustainable future. Here's what you can look forward to:

- Calculate Your Carbon Footprint: Understand your environmental impact with our intuitive tools.
- Take Meaningful Action: From planting trees to reducing waste, find actionable ways to offset your carbon footprint.
- Track Your Progress: Watch your positive impact grow with our monthly reports.
- Join a Community: Connect with like-minded individuals and inspire others on their sustainability journey.

Ready to start your green adventure? Download the app and sign up today:

iOS: ${APP_STORE_URL}
Android: ${PLAY_STORE_URL}

Or, if you already have the app installed, click here to open it directly: ${APP_URL}

If you have any questions, our friendly support team is always here to help at info@forevergreen.earth.

Let's create a greener world together! 🌍

Best regards,
The Forevergreen Team 🌱`;

  const html = `
    <h2>🌿 Join Forevergreen: Your Friend's Invitation to a Greener Future!</h2>
    <p>Hi ${friendName}!</p>
    <p>Great news! 🎉 Your friend ${referrerName} thinks you'd be a fantastic addition to our Forevergreen community. They've invited you to join us in making a positive impact on our planet!</p>
    <blockquote>${note && referrerName + " says: " + note}</blockquote>
    <p>Forevergreen is more than just an app—it's a movement towards a sustainable future. Here's what you can look forward to:</p>
    <ul>
      <li><strong>Calculate Your Carbon Footprint:</strong> Understand your environmental impact with our intuitive tools.</li>
      <li><strong>Take Meaningful Action:</strong> From planting trees to reducing waste, find actionable ways to offset your carbon footprint.</li>
      <li><strong>Track Your Progress:</strong> Watch your positive impact grow with our monthly reports.</li>
      <li><strong>Join a Community:</strong> Connect with like-minded individuals and inspire others on their sustainability journey.</li>
    </ul>
    <p>Ready to start your green adventure? Download the app and sign up today:</p>
    <p>
      <a href="${APP_STORE_URL}" style="display:inline-block;margin-right:10px;">
        <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="Download on the App Store" height="40">
      </a>
      <a href="${PLAY_STORE_URL}" style="display:inline-block;">
        <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" height="40">
      </a>
    </p>
    <p>Or, if you already have the app installed, <a href="https://fg-react-app.web.app">click here to open it directly</a>.</p>
    <p>If you have any questions, our friendly support team is always here to help at info@forevergreen.earth.</p>
    <p>Let's create a greener world together! 🌍</p>
    <p>Best regards,<br>The Forevergreen Team 🌱</p>
  `;

  await sendEmail([email], subject, text, html);
};

const AGGREGATE_DOC_ID = "emissions_stats";

const incrementUserReferrals = async () => {
  const db = getFirestore();
  const auth = getAuth();

  const userId = auth.currentUser?.uid;
  if (!userId) {
    console.error("User is not authenticated, skipping referral increment");
    return;
  }

  const userRef = doc(db, "users", userId);
  const aggregateDataRef = doc(db, "community", AGGREGATE_DOC_ID);

  try {
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw "User document does not exist!";
      }

      const referralLeaderboardDoc = await transaction.get(aggregateDataRef);
      let referralLeaderboard: ReferralLeaderboard;

      if (!referralLeaderboardDoc.exists()) {
        // Initialize the leaderboard if it doesn't exist
        referralLeaderboard = { topReferrers: [], lastUpdated: new Date() };
      } else {
        referralLeaderboard = referralLeaderboardDoc.data() as ReferralLeaderboard;
        // Ensure topReferrers exists
        if (!referralLeaderboard.topReferrers) {
          referralLeaderboard.topReferrers = [];
        }
      }

      const userData = userDoc.data();
      const newTotalReferrals = (userData.totalReferrals || 0) + 1;
      // Update user's referral count
      transaction.update(userRef, { totalReferrals: newTotalReferrals });

      // Update top referrers
      const userIndex = referralLeaderboard.topReferrers.findIndex((r) => r.userId === userId);
      if (userIndex !== -1) {
        // User is already in top referrers, update their count
        referralLeaderboard.topReferrers[userIndex].totalReferrals++;
      } else {
        // Add user to top referrers
        referralLeaderboard.topReferrers.push({
          userId,
          totalReferrals: newTotalReferrals,
          name: userData.name || "Anonymous",
        });
      }

      // Sort and trim the top referrers
      referralLeaderboard.topReferrers.sort((a, b) => b.totalReferrals - a.totalReferrals);
      referralLeaderboard.topReferrers = referralLeaderboard.topReferrers.slice(0, 3);

      transaction.set(aggregateDataRef, referralLeaderboard);
    });

    console.log(`Successfully incremented referral count for user ${userId}`);
  } catch (error) {
    console.error(`Error incrementing referral count for user ${userId}:`, error);
    throw error;
  }
};

const getTopReferrers = async (): Promise<TopReferrer[]> => {
  const db = getFirestore();
  const aggregateDataRef = doc(db, "community", AGGREGATE_DOC_ID);

  try {
    const referralLeaderboardDoc = await getDoc(aggregateDataRef);

    if (!referralLeaderboardDoc.exists()) {
      return [];
    }

    const referralLeaderboard = referralLeaderboardDoc.data() as ReferralLeaderboard;
    return referralLeaderboard.topReferrers;
  } catch (error) {
    console.error("Error getting top referrers:", error);
    throw error;
  }
};

// todo: add successful referral code

export { sendReferralEmail, incrementUserReferrals, getTopReferrers };
