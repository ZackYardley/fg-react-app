import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet, LayoutAnimation } from "react-native";
import { Image } from "expo-image";
import Icon from "react-native-vector-icons/Feather";
import { CarbonCredit } from "@/types";
import { addToCart } from "@/api/cart";
import { formatPrice } from "@/utils";
import { ThemedText, ThemedView } from "@/components/common";
import { useThemeColor } from "@/hooks";

const ProjectCard: React.FC<{ project: CarbonCredit }> = ({ project }) => {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const [quantity, setQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  }, []);

  const incrementQuantity = useCallback(() => setQuantity((prev) => prev + 1), []);
  const decrementQuantity = useCallback(() => setQuantity((prev) => Math.max(1, prev - 1)), []);

  const details = [
    { title: "Key Features", content: project.stripe_metadata_key_features },
    { title: "Project Overview", content: project.stripe_metadata_project_overview },
    { title: "Your Purchase", content: project.stripe_metadata_your_purchase },
  ];

  const navigateDetails = useCallback(
    (direction: "next" | "prev") => {
      setCurrentPage((prev) => {
        if (direction === "next") {
          return (prev + 1) % details.length;
        } else {
          return (prev - 1 + details.length) % details.length;
        }
      });
    },
    [details.length]
  );

  const handleAddToCart = useCallback(() => {
    addToCart(project.id, project.name, "carbon_credit", quantity);
    setQuantity(1);
  }, [project, quantity]);

  if (!project) return null;

  const currentDetail = details[currentPage];

  return (
    <ThemedView style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <ThemedText style={styles.title}>{project.name}</ThemedText>
        <Image source={project.images[0]} style={styles.projectImage} />
      </View>

      <View style={styles.detailsContainer}>
        <ThemedText style={styles.detailTitle}>{currentDetail.title}</ThemedText>
        <ThemedText
          style={[styles.detailContent, !expanded && styles.detailContentCollapsed]}
          numberOfLines={expanded ? undefined : 3}
        >
          {currentDetail.content}
        </ThemedText>
        <TouchableOpacity onPress={toggleExpanded} style={styles.showMoreButton}>
          <ThemedText style={styles.showMoreText}>{expanded ? "Show Less" : "Show More"}</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => navigateDetails("prev")}>
          <Icon name="chevron-left" size={48} color={textColor} />
        </TouchableOpacity>

        <View style={styles.priceContainer}>
          <View style={styles.coinContainer}>
            <ThemedText style={styles.priceText}>{formatPrice(project.prices[0].unit_amount)}</ThemedText>
          </View>
          <View style={styles.perTonContainer}>
            <ThemedText style={styles.perTonText}>per ton</ThemedText>
            <ThemedText style={styles.perTonText}>CO2</ThemedText>
          </View>
        </View>

        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decrementQuantity} style={[styles.quantityButton, { backgroundColor: textColor }]}>
            <Icon name="minus" size={24} color={backgroundColor} />
          </TouchableOpacity>
          <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
          <TouchableOpacity onPress={incrementQuantity} style={[styles.quantityButton, { backgroundColor: textColor }]}>
            <Icon name="plus" size={24} color={backgroundColor} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigateDetails("next")}>
          <Icon name="chevron-right" size={48} color={textColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.totalContainer}>
        <ThemedText style={styles.totalText}>Total:</ThemedText>
        <View style={styles.totalPriceContainer}>
          <ThemedText style={styles.totalPriceText}>{formatPrice(project.prices[0].unit_amount * quantity)}</ThemedText>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Icon name="shopping-cart" size={18} color="#fff" style={styles.cartIcon} />
          <ThemedText style={styles.addToCartText}>Add to Cart</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

export default ProjectCard;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 15,
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailContentCollapsed: {
    height: 72, // Approximately 3 lines of ThemedText
  },
  showMoreButton: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  showMoreText: {
    color: "#409994",
    fontWeight: "bold",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    gap: 16,
  },
  projectImage: {
    height: 75,
    width: 70,
  },
  priceContainer: {
    flexDirection: "row",
    gap: 0,
    alignItems: "baseline",
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  priceText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  perTonContainer: {
    marginLeft: 8,
    marginTop: 24,
  },
  perTonText: {
    lineHeight: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "bold",
    height: 30,
    marginHorizontal: 8,
    textAlign: "center",
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 32,
    justifyContent: "flex-end",
  },
  totalText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  totalPriceContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  totalPriceText: {
    fontSize: 30,
  },
  addToCartButton: {
    backgroundColor: "#22C55E",
    padding: 8,
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cartIcon: {
    padding: 8,
  },
  addToCartText: {
    color: "white",
    fontWeight: "bold",
    padding: 8,
  },
});
