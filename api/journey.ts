import { getFirestore, doc, getDoc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import dayjs from "dayjs";
import { JourneyDocument } from "@/types";

const saveJourneyData = async (data: Partial<JourneyDocument>): Promise<void> => {
    const auth = getAuth();
    const db = getFirestore();
  
    if (!auth.currentUser) {
      throw new Error("No user logged in");
    }
  
    const userId = auth.currentUser.uid;
    const userDocRef = doc(collection(db, "users", userId, "journey"), "progress");
  
    try {
      await setDoc(userDocRef, { ...data, lastUpdated: serverTimestamp() }, { merge: true });
    } catch (error) {
      console.error("Error saving journey data:", error);
      throw error;
    }
  };
  
  const fetchJourneyData = async (userId?: string): Promise<JourneyDocument | null> => {
    const auth = getAuth();
    const db = getFirestore();
  
    if (!auth.currentUser && !userId) {
      console.error("No user logged in and no userId provided");
      return null;
    }
  
    userId = userId || auth.currentUser!.uid;
  
    const docRef = doc(collection(db, "users", userId, "journey"), "progress");
  
    try {
      const journeyDoc = await getDoc(docRef);
      return journeyDoc.exists() ? (journeyDoc.data() as JourneyDocument) : null;
    } catch (error) {
      console.error("Error fetching journey data:", error);
      return null;
    }
  };
  
  
  
  export { saveJourneyData, fetchJourneyData };