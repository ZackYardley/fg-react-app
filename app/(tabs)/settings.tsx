import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Href, useRouter } from "expo-router";
import { fetchEmissionsData } from "@/api/emissions";
import { Image } from "expo-image";
import { PageHeader } from "@/components/common";
import { logout, deleteUserAccount } from "@/api/auth";
import { useStripe } from "@/utils/stripe";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchSetupPaymentSheetParams } from "@/api/purchase";
import { fetchSubscriptionStatus } from "@/api/subscriptions";
import { fetchCarbonCreditSubscription } from "@/api/products";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

interface SettingsItemProps {
  title: string;
  screen?: Href<string>;
  isDisabled?: boolean;
}

export default function ProfileScreen() {
  const { resetPaymentSheetCustomer, initPaymentSheet, presentPaymentSheet } = useStripe();

  const [user, setUser] = useState<User | null>(null);
  const [totalEmissions, setTotalEmissions] = useState<number>(0);
  const [monthlyEmissions, setMonthlyEmissions] = useState<number>(0);
  const [isUpdatingPaymentMethod, setIsUpdatingPaymentMethod] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [totalOffset, setTotalOffset] = useState(0);

  const router = useRouter();
  const auth = getAuth();
  const profileIcon = auth.currentUser?.photoURL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsGoogleUser(currentUser.providerData.some((provider) => provider.providerId === "google.com"));
        checkSubscriptionStatus();
      } else {
        router.replace("/get-started");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  const checkSubscriptionStatus = async () => {
    try {
      const userEmissionsData = await fetchEmissionsData();
      if (userEmissionsData) {
        const userEmissions = userEmissionsData.totalEmissions;
        const result = await fetchCarbonCreditSubscription(userEmissions);
        if (result) {
          const isSubscribed = await fetchSubscriptionStatus(result.product.id || "");
          setIsSubscribed(isSubscribed);
        }
      }
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchEmissionsData();
      if (data) {
        setTotalEmissions(data.totalEmissions || 0);
        setMonthlyEmissions(data.monthlyEmissions || 0);
        setTotalOffset(data.totalOffset || 0);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await resetPaymentSheetCustomer();
            await logout();
          } catch (error) {
            console.error(error);
          } finally {
            router.replace("/get-started");
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    if (isSubscribed) {
      Alert.alert(
        "Active Subscription",
        "You cannot delete your account while you have an active subscription. Please cancel your subscription first and then try again.",
        [{ text: "OK" }]
      );
      return;
    }

    if (isGoogleUser && deleteConfirmation !== "DELETE") {
      Alert.alert("Error", "Please type DELETE to confirm account deletion.");
      return;
    }

    try {
      setIsDeleteModalVisible(false); // Close the modal before proceeding
      await deleteUserAccount(isGoogleUser ? undefined : deleteConfirmation);
    } catch (error: any) {
      // Delay the error alert to ensure the delete modal is closed
      setTimeout(() => {
        Alert.alert("Error", error.message);
      }, 100);
    } finally {
      setDeleteConfirmation(""); // Reset the confirmation text
    }
  };

  const handleUpdatePaymentMethod = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to update your payment method.");
      return;
    }

    if (isUpdatingPaymentMethod) {
      return; // Prevent multiple calls while already processing
    }

    setIsUpdatingPaymentMethod(true);

    try {
      const { setupIntent, ephemeralKey, customer } = await fetchSetupPaymentSheetParams(user.uid);

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Forevergreen",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        setupIntentClientSecret: setupIntent,
        allowsDelayedPaymentMethods: true,
        returnURL: "com.fgdevteam.fgreactapp://stripe-redirect",
      });

      if (error) {
        console.error("Error initializing payment sheet:", error);
        Alert.alert("Error", "Failed to initialize payment update. Please try again.");
        return;
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Alert.alert(`Error code: ${presentError.code}`, presentError.message);
      } else {
        Alert.alert("Success", "Your payment method has been updated successfully.");
      }
    } catch (error) {
      console.error("Error updating payment method:", error);
      Alert.alert("Error", "Failed to update payment method. Please try again.");
    } finally {
      setIsUpdatingPaymentMethod(false);
    }
  };

  const SettingsItem: React.FC<SettingsItemProps> = ({ title, screen, isDisabled }) => (
    <TouchableOpacity
      onPress={() => (title === "Payment Methods" ? handleUpdatePaymentMethod() : screen ? router.push(screen) : null)}
      style={[styles.settingsItem, isDisabled && styles.disabledSettingsItem]}
      disabled={isDisabled}
    >
      <Text style={[styles.settingsItemTitle, isDisabled && styles.disabledSettingsItemTitle]}>{title}</Text>
      <Icon name="chevron-right" size={48} color={isDisabled ? "#999" : "#000"} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container}>
        <PageHeader subtitle="Settings" />
        <View style={styles.profileContainer}>
          <View style={styles.profileInfo}>
            <View style={styles.profileImageBG}>
              {profileIcon ? (
                <Image
                  style={styles.profileImage}
                  source={{ uri: profileIcon }}
                  placeholder={blurhash}
                  contentFit="cover"
                />
              ) : (
                <Icon
                  color="#fff"
                  name={"user"}
                  size={64}
                  style={{ marginHorizontal: "auto", marginVertical: "auto" }}
                />
              )}
            </View>
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>{user?.displayName || "Guest"}</Text>
              <Text style={styles.profileEmail}>{user?.email || ""}</Text>
            </View>
          </View>

          <SettingsItem title="Profile Settings" screen="/profile-settings" />
          <SettingsItem title="Payment Methods" isDisabled={isUpdatingPaymentMethod} />
          <SettingsItem title="Purchase History" screen="/purchase-history" />
          {/*<SettingsItem title="Notifications" screen="/notifications-settings" />*/}
          <SettingsItem title="Manage Subscriptions" screen="/subscriptions" />

          <View style={styles.carbonFootprint}>
            <Text style={styles.carbonFootprintTitle}>Your Carbon Footprint...</Text>
            <View style={styles.carbonFootprintContent}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Emissions</Text>
                <Text style={styles.emissionText}>
                  {monthlyEmissions.toFixed(2)}
                  <Text style={styles.emissionUnit}> tons of CO₂</Text>
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Offsets</Text>
                <Text style={styles.offsetText}>
                  {totalOffset.toFixed(2)}
                  <Text style={styles.emissionUnit}> tons of CO₂</Text>
                </Text>
              </View>
            </View>

            {monthlyEmissions <= totalOffset ? (
              <Text style={styles.netZeroText}>You are net zero this month!</Text>
            ) : (
              <Text style={styles.netZeroText}>You are not net zero this month!</Text>
            )}

            <TouchableOpacity onPress={() => router.push("/offset-now")} style={styles.offsetButton}>
              <Text style={styles.offsetButtonText}>Offset Now!</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteAccountButton} onPress={() => setIsDeleteModalVisible(true)}>
            <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isDeleteModalVisible}
            onRequestClose={() => setIsDeleteModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Delete Account</Text>
                <Text style={styles.modalText}>
                  Are you sure you want to delete your account? This action cannot be undone.
                </Text>
                {isGoogleUser ? (
                  <>
                    <Text style={styles.modalText}>To confirm, please type DELETE in all caps:</Text>
                    <TextInput
                      style={styles.deleteConfirmationInput}
                      placeholder="Type DELETE here"
                      value={deleteConfirmation}
                      onChangeText={setDeleteConfirmation}
                      autoCapitalize="characters"
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.modalText}>Please enter your password to confirm:</Text>
                    <TextInput
                      style={styles.deleteConfirmationInput}
                      placeholder="Enter your password"
                      value={deleteConfirmation}
                      onChangeText={setDeleteConfirmation}
                      secureTextEntry
                    />
                  </>
                )}
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setIsDeleteModalVisible(false);
                      setDeleteConfirmation("");
                    }}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={handleDeleteAccount}>
                    <Text style={styles.modalButtonText}>Delete Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  profileContainer: {
    paddingHorizontal: 20,
  },
  profileInfo: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginLeft: 5,
    marginTop: 5,
  },
  profileImageBG: {
    backgroundColor: "#337946",
    width: 110,
    height: 110,
    borderRadius: 60,
    marginRight: 10,
  },
  profileEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  profileTextContainer: {
    marginLeft: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
  },
  profileEmail: {
    fontSize: 16,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e5e7eb",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  settingsItemTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  disabledSettingsItem: {
    opacity: 0.5,
  },
  disabledSettingsItemTitle: {
    color: "#999",
  },
  carbonFootprint: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 30,
    backgroundColor: "#e5e7eb",
  },
  carbonFootprintTitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "700",
  },
  emissionsTitle: {
    fontSize: 20,
    textAlign: "left",
    marginBottom: 12,
    fontWeight: "700",
  },
  offsetTitle: {
    fontSize: 20,
    textAlign: "right",
    marginBottom: 12,
    fontWeight: "700",
  },
  carbonFootprintContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emissionText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#b91c1c",
  },
  offsetText: {
    fontSize: 24,
    fontWeight: "700",
    color: "green",
  },
  emissionUnit: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
  },
  offsetButton: {
    backgroundColor: "#409858",
    borderRadius: 999, // Slightly rounded corners
    paddingHorizontal: 28,
    paddingVertical: 12,
    width: "50%", // Set a specific width, adjust as needed
    alignSelf: "center",
    marginTop: 10, // Add some space above the button
  },
  offsetButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center", // Ensure text is centered
  },
  logoutButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 42,
    backgroundColor: "#e5e7eb",
  },
  logoutButtonText: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 20,
  },
  deleteAccountButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: "#b91c1c",
    marginBottom: 15,
  },
  deleteAccountButtonText: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 20,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  deleteConfirmationInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: "45%",
  },
  cancelButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#FF0000",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: "auto",
  },
  section: {
    flex: 1,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  netZeroText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
});
