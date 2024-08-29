import { Alert } from "react-native";
import { router } from "expo-router";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  signInAnonymously,
  EmailAuthProvider,
  linkWithCredential,
  signOut,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  deleteUser,
  reauthenticateWithCredential,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { fetchEmissionsData } from "./emissions";
import { sendAccountDeletionEmail, sendWelcomeEmail } from "./email";

// Helper function to check if a user exists in the database
const checkUserExists = async (uid: string): Promise<boolean> => {
  try {
    const db = getFirestore();
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (error) {
    console.error("Error checking if user exists:", error);
    return false;
  }
};

// Function to create a user profile
const createUserProfile = async (userData: {
  uid: string;
  name?: string | null;
  email?: string | null;
  photoURL?: string | null;
  isAnonymous?: boolean;
}): Promise<void> => {
  try {
    const db = getFirestore();
    const userDocRef = doc(db, "users", userData.uid);

    await setDoc(
      userDocRef,
      {
        id: userData.uid,
        isAnonymous: userData.isAnonymous || false,
        name: userData.name || undefined,
        photoURL: userData.photoURL || undefined,
        emailAddress: userData.email || "",
        firstName: userData.name?.split(" ")[0] || undefined,
        lastName: userData.name?.split(" ")[1] || undefined,
        isSubscribed: true,
      },
      { merge: true }
    );

    if (userData.email && userData.name) {
      await sendWelcomeEmail(userData.email, userData.name);
    }

    console.log(`User profile created for UID: ${userData.uid}`);
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

// Function to handle user redirection based on emissions data
const handleUserRedirection = async () => {
  const data = await fetchEmissionsData();
  if (data?.totalEmissions) {
    router.replace("/home");
  } else {
    router.replace("/pre-survey");
  }
};

/* Function to sign up the user with the email and password */
const onSignup = async (email: string, password: string, name: string) => {
  const auth = getAuth();

  try {
    if (auth.currentUser && auth.currentUser.isAnonymous) {
      // Link anonymous account with email/password
      const credential = EmailAuthProvider.credential(email, password);
      await linkWithCredential(auth.currentUser, credential);
      await updateProfile(auth.currentUser, { displayName: name });
      await createUserProfile({
        uid: auth.currentUser.uid,
        name,
        email,
        isAnonymous: false,
      });
    } else {
      // Create new account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await createUserProfile({
        uid: userCredential.user.uid,
        name,
        email,
        isAnonymous: false,
      });
    }

    await handleUserRedirection();
  } catch (error: any) {
    Alert.alert("Error", `Code: ${error.code}\nMessage: ${error.message}`);
    console.error(`Error: Code: ${error.code}\nMessage: ${error.message}`);
  }
};

const onGoogleSignUp = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const user = await GoogleSignin.signIn();

    const auth = getAuth();
    const credential = GoogleAuthProvider.credential(user.idToken);

    let currentUser;
    if (auth.currentUser && auth.currentUser.isAnonymous) {
      // Link anonymous account with Google
      currentUser = (await linkWithCredential(auth.currentUser, credential)).user;
    } else {
      // Sign in with Google
      currentUser = (await signInWithCredential(auth, credential)).user;
    }

    const userExists = await checkUserExists(currentUser.uid);
    if (!userExists) {
      await createUserProfile({
        uid: currentUser.uid,
        name: currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL,
        isAnonymous: false,
      });
    }

    await handleUserRedirection();
  } catch (error: any) {
    Alert.alert("Error", `Code: ${error.code}\nMessage: ${error.message}`);
    console.error(`Error: Code: ${error.code}\nMessage: ${error.message}`);
  }
};

const onContinueAnonymously = async () => {
  const auth = getAuth();

  try {
    const userCredential = await signInAnonymously(auth);
    await createUserProfile({
      uid: userCredential.user.uid,
      isAnonymous: true,
    });
  } catch (error: any) {
    Alert.alert("Error", `Code: ${error.code}\nMessage: ${error.message}`);
    console.error(`Error: Code: ${error.code}\nMessage: ${error.message}`);
  }
};

/* Function to sign up the user with the email and password */
const onLogin = async (email: string, password: string) => {
  const auth = getAuth();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    await handleUserRedirection();
  } catch (error: any) {
    Alert.alert("Error", `Code: ${error.code}\nMessage: ${error.message}`);
    console.error(`Error: Code: ${error.code}\nMessage: ${error.message}`);
  }
};

const onGoogleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const user = await GoogleSignin.signIn();

    const auth = getAuth();
    const credential = GoogleAuthProvider.credential(user.idToken);
    const userCredential = await signInWithCredential(auth, credential);

    const userExists = await checkUserExists(userCredential.user.uid);
    if (!userExists) {
      await createUserProfile({
        uid: userCredential.user.uid,
        name: userCredential.user.displayName,
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL,
        isAnonymous: false,
      });
    }
    await handleUserRedirection();
  } catch (error: any) {
    Alert.alert("Error", `Code: ${error.code}\nMessage: ${error.message}`);
    console.error(`Error: Code: ${error.code}\nMessage: ${error.message}`);
  }
};

const logout = async () => {
  const auth = getAuth();
  try {
    await signOut(auth);
  } catch (error: any) {
    Alert.alert("Error", "Failed to logout. Please try again.");
    console.error("Error: Failed to logout. Please try again.", error);
  }
};

const handleResetPassword = async (email: string) => {
  const auth = getAuth();
  if (email.trim() === "") {
    Alert.alert("Error", "Please enter your email address.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    Alert.alert("Success", "Password reset email sent. Please check your inbox.", [
      { text: "OK", onPress: () => router.push("/login") },
    ]);
  } catch (error: any) {
    Alert.alert("Error", `Failed to send reset email: ${error.message}`);
    console.error(`Error: Failed to send reset email: ${error.message}`);
  }
};

const deleteUserAccount = async (password?: string) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user is currently signed in.");
  }

  try {
    const providerData = user.providerData;
    const isGoogleUser = providerData.some((provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID);

    if (isGoogleUser) {
      // Re-authenticate with Google
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const credential = GoogleAuthProvider.credential(idToken);
      await reauthenticateWithCredential(user, credential);
    } else {
      // For email/password users
      if (!password) {
        throw new Error("Password is required to delete your account.");
      }

      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
    }

    // Delete the user's authentication account
    await sendAccountDeletionEmail(user.email || "", user.displayName || "User");
    await deleteUser(user);

    console.log("User account deleted successfully");
  } catch (error: any) {
    console.error("Error deleting user account:", error);
    throw error;
  }
};

export {
  onSignup,
  onGoogleSignUp,
  onContinueAnonymously,
  onLogin,
  onGoogleLogin,
  logout,
  handleResetPassword,
  deleteUserAccount,
};
