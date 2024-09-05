import { getFirestore, doc, getDoc, setDoc, collection, serverTimestamp, runTransaction } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import dayjs from "dayjs";
import { EmissionsDocument, CommunityEmissionsData } from "@/types";

const saveEmissionsData = async (data: Partial<EmissionsDocument>): Promise<void> => {
  const auth = getAuth();
  const db = getFirestore();

  if (!auth.currentUser) {
    throw new Error("No user logged in");
  }

  const userId = auth.currentUser.uid;
  const formattedMonth = dayjs().format("YYYY-MM");
  const userDocRef = doc(collection(db, "users", userId, "emissions"), formattedMonth);

  try {
    await setDoc(userDocRef, { ...data, lastUpdated: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error("Error saving emissions data:", error);
    throw error;
  }
};

// Fetch emissions data for a specific month
const fetchEmissionsData = async (month?: string, userId?: string) => {
  const auth = getAuth();
  const db = getFirestore();

  if (!auth.currentUser && !userId) {
    console.error("No user logged in and no userId provided");
    return null;
  }

  userId = userId || auth.currentUser!.uid;

  let formattedMonth = month || dayjs().format("YYYY-MM");

  const DocRef = doc(collection(db, "users", userId, "emissions"), formattedMonth);

  try {
    const Doc = await getDoc(DocRef);
    return Doc.exists() ? (Doc.data() as EmissionsDocument) : null;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const saveCommunityEmissionsData = async (amount: number): Promise<void> => {
  const db = getFirestore();
  const communityDocRef = doc(db, "community", "emissions_stats");

  try {
    await runTransaction(db, async (transaction) => {
      const communityDoc = await transaction.get(communityDocRef);

      if (!communityDoc.exists()) {
        transaction.set(communityDocRef, {
          emissions_calculated: amount,
          last_updated: serverTimestamp(),
        });
      } else {
        const currentEmissions = communityDoc.data().emissions_calculated || 0;
        transaction.update(communityDocRef, {
          emissions_calculated: currentEmissions + amount,
          last_updated: serverTimestamp(),
        });
      }
    });

    console.log("Community emissions data updated successfully");
  } catch (error) {
    console.error("Error updating community emissions data:", error);
    throw error;
  }
};

const fetchCommunityEmissionsData = async (): Promise<CommunityEmissionsData | null> => {
  const db = getFirestore();
  const communityDocRef = doc(db, "community", "emissions_stats");

  try {
    const communityDoc = await getDoc(communityDocRef);

    if (communityDoc.exists()) {
      const data = communityDoc.data();
      return {
        emissions_calculated: data.emissions_calculated || 0,
        emissions_offset: data.emissions_offset || 0,
        last_updated: data.last_updated ? data.last_updated.toDate() : new Date(),
      };
    } else {
      console.log("No community emissions data found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching community emissions data:", error);
    throw error;
  }
};

export { saveEmissionsData, fetchEmissionsData, saveCommunityEmissionsData, fetchCommunityEmissionsData };
