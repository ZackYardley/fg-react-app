import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { formatPrice } from "@/utils";
import { ComingSoon } from "@/constants/Images";
import { ThemedText } from "@/components/common";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

interface CreditItemProps {
  name: string | null;
  price: number | null;
  image: string | null;
  colors: string[];
  onPress: () => void;
  isPlaceholder?: boolean;
  isSkeleton?: boolean;
}

const CreditItem: React.FC<CreditItemProps> = ({
  name,
  price,
  image,
  colors,
  onPress,
  isPlaceholder = false,
  isSkeleton = false,
}) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onPress} style={styles.touchable} disabled={isSkeleton || isPlaceholder}>
      <LinearGradient
        colors={colors.length >= 2 ? colors : ["#ffffff", "#ffffff"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        {!isSkeleton &&
          (isPlaceholder ? (
            <Image source={ComingSoon} placeholder={blurhash} style={styles.icon} contentFit="cover" />
          ) : image ? (
            <Image source={{ uri: image }} placeholder={blurhash} style={styles.icon} contentFit="cover" />
          ) : null)}
      </LinearGradient>
      {!isSkeleton && (
        <>
          <ThemedText style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {isPlaceholder ? "Coming Soon" : name || ""}
          </ThemedText>
          <View style={styles.amountContainer}>
            <ThemedText style={styles.amount}>{isPlaceholder ? "??" : price ? formatPrice(price) : ""}</ThemedText>
          </View>
        </>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 176,
    width: 112,
  },
  touchable: {
    marginBottom: 16,
  },
  gradient: {
    width: 112,
    height: 112,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
  },
  icon: {
    height: 75,
    width: 70,
  },
  name: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 16,
    minHeight: 48,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreditItem;
