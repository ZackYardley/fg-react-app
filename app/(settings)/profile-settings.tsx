import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { getAuth, updateProfile, sendEmailVerification } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { BackButton, PageHeader, ThemedSafeAreaView, ThemedText } from "@/components/common";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks";
import { StatusBar } from "expo-status-bar";

export default function ProfileSettings() {
  const textColor = useThemeColor({}, "text");
  const auth = getAuth();
  const storage = getStorage();

  const [user, setUser] = useState(auth.currentUser);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [profileImage, setProfileImage] = useState(user?.photoURL || null);
  const [isEmailVerified, setIsEmailVerified] = useState(user?.emailVerified || false);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setDisplayName(user?.displayName || "");
      setProfileImage(user?.photoURL || null);
      setIsEmailVerified(user?.emailVerified || false);
    });

    return () => unsubscribe();
  }, [auth]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string | URL | Request) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `profilePictures/${user?.uid}/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);

    try {
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setProfileImage(downloadURL);
    } catch (error) {
      console.error("Error uploading image: ", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
    }
  };

  const saveProfile = async () => {
    if (user) {
      try {
        await updateProfile(user, {
          displayName: displayName,
          photoURL: profileImage,
        });
        Alert.alert("Success", "Profile updated successfully!");
        router.back();
      } catch (error) {
        console.error("Error updating profile: ", error);
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    }
  };

  const sendVerificationEmail = async () => {
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
        Alert.alert("Success", "Verification email sent. Please check your inbox.");
      } catch (error) {
        console.error("Error sending verification email: ", error);
        Alert.alert("Error", "Failed to send verification email. Please try again.");
      }
    }
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView style={styles.container}>
        <PageHeader subtitle="Profile Settings" />
        <BackButton />

        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity style={styles.profileImageButton} onPress={pickImage}>
              {profileImage ? (
                <>
                  <Image style={styles.profileImage} source={{ uri: profileImage }} contentFit="cover" />
                  <View style={styles.iconOverlay}>
                    <Feather name="edit-2" size={24} color="white" />
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.profileImageText}>+</Text>
                  <Text style={styles.uploadText}>Upload a profile picture!</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <ThemedText style={styles.label}>Display Name</ThemedText>
            <TextInput
              style={[styles.input, { color: textColor }]}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your name"
            />

            <ThemedText style={styles.label}>Email</ThemedText>
            <ThemedText style={styles.emailText}>{user?.email}</ThemedText>

            <View style={styles.verificationContainer}>
              <ThemedText style={styles.verificationText}>
                Email Verification Status: {isEmailVerified ? "Verified" : "Not Verified"}
              </ThemedText>
              {!isEmailVerified && (
                <TouchableOpacity style={styles.verifyButton} onPress={sendVerificationEmail}>
                  <ThemedText style={styles.verifyButtonText}>Send Verification Email</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
            <ThemedText style={styles.saveButtonText}>Save</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImageButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  profileImageText: {
    fontSize: 60,
    color: "#fff",
  },
  profileImage: {
    width: 135,
    height: 135,
    borderRadius: 65,
  },
  iconOverlay: {
    position: "absolute",
    bottom: 20,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    padding: 8,
  },
  uploadText: {
    marginTop: 10,
    color: "#22C55E",
    fontSize: 18,
    fontWeight: "500",
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 20,
  },
  emailText: {
    fontSize: 18,
    color: "#878585",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#22C55E",
    borderRadius: 30,
    padding: 10,
    alignItems: "center",
    alignSelf: "flex-end",
    width: 100,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
  },
  verificationContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  verificationText: {
    fontSize: 16,
    marginBottom: 10,
  },
  verifyButton: {
    backgroundColor: "#409858",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
