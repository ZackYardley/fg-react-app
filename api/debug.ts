import { fetchCarbonCreditProducts, fetchSpecificCarbonCreditProduct } from "./products";

// Test function to print out the data
const testFetchCarbonCreditProducts = async () => {
  try {
    console.log("Fetching Carbon Credit products...");
    const products = await fetchCarbonCreditProducts();
    console.log(`Found ${products.length} Carbon Credit products:`);
    products.forEach((product, index) => {
      console.log(`\nProduct ${index + 1}:`);
      console.log(`ID: ${product.id}`);
      console.log(`Name: ${product.name}`);
      console.log(`Description: ${product.description}`);
      console.log(`Active: ${product.active}`);
      console.log(`Images: ${product.images.join(", ")}`);
      console.log(`Role: ${product.role}`);
      console.log(`Tax Code: ${product.tax_code}`);
      console.log("Metadata:");
      Object.entries(product.metadata).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
      console.log("Stripe Metadata:");
      console.log(`  CTA: ${product.stripe_metadata_cta}`);
      console.log(`  Key Features: ${product.stripe_metadata_key_features}`);
      console.log(`  Product Type: ${product.stripe_metadata_product_type}`);
      console.log(`  Project Overview: ${product.stripe_metadata_project_overview}`);
      console.log(`  Registry Link: ${product.stripe_metadata_registry_link}`);
      console.log(`  Registry Title: ${product.stripe_metadata_registry_title}`);
      console.log(`  Your Purchase: ${product.stripe_metadata_your_purchase}`);
      console.log(`  Color 0: ${product.stripe_metadata_color_0}`);
      console.log(`  Color 1: ${product.stripe_metadata_color_1}`);
      console.log(`  Color 2: ${product.stripe_metadata_color_2}`);
      console.log("Prices:");
      product.prices.forEach((price, priceIndex) => {
        console.log(`  Price ${priceIndex + 1}:`);
        console.log(`    ID: ${price.id}`);
        console.log(`    Active: ${price.active}`);
        console.log(`    Billing Scheme: ${price.billing_scheme}`);
        console.log(`    Currency: ${price.currency}`);
        console.log(`    Unit Amount: ${price.unit_amount}`);
        if (price.recurring) {
          console.log(`    Recurring:`);
          console.log(`      Interval: ${price.recurring.interval}`);
          console.log(`      Interval Count: ${price.recurring.interval_count}`);
        }
        // Add other price fields as needed
      });
    });
  } catch (error) {
    console.error("Error in test function:", error);
  }
};

// Test function to fetch and print data for a specific product
const testFetchSpecificCarbonCreditProduct = async (productId: string) => {
  try {
    console.log(`Fetching Carbon Credit product with ID: ${productId}`);
    const product = await fetchSpecificCarbonCreditProduct(productId);

    if (product) {
      console.log("Product found:");
      console.log(`ID: ${product.id}`);
      console.log(`Name: ${product.name}`);
      console.log(`Description: ${product.description}`);
      console.log(`Active: ${product.active}`);
      console.log(`Images: ${product.images.join(", ")}`);
      console.log(`Role: ${product.role}`);
      console.log(`Tax Code: ${product.tax_code}`);
      console.log("Metadata:");
      Object.entries(product.metadata).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`);
      });
      console.log("Stripe Metadata:");
      console.log(`  CTA: ${product.stripe_metadata_cta}`);
      console.log(`  Key Features: ${product.stripe_metadata_key_features}`);
      console.log(`  Product Type: ${product.stripe_metadata_product_type}`);
      console.log(`  Project Overview: ${product.stripe_metadata_project_overview}`);
      console.log(`  Registry Link: ${product.stripe_metadata_registry_link}`);
      console.log(`  Registry Title: ${product.stripe_metadata_registry_title}`);
      console.log(`  Your Purchase: ${product.stripe_metadata_your_purchase}`);
      console.log(`  Color 0: ${product.stripe_metadata_color_0}`);
      console.log(`  Color 1: ${product.stripe_metadata_color_1}`);
      console.log(`  Color 2: ${product.stripe_metadata_color_2}`);
      console.log("Prices:");
      product.prices.forEach((price, index) => {
        console.log(`  Price ${index + 1}:`);
        console.log(`    ID: ${price.id}`);
        console.log(`    Active: ${price.active}`);
        console.log(`    Billing Scheme: ${price.billing_scheme}`);
        console.log(`    Currency: ${price.currency}`);
        console.log(`    Unit Amount: ${price.unit_amount}`);
        if (price.recurring) {
          console.log(`    Recurring:`);
          console.log(`      Interval: ${price.recurring.interval}`);
          console.log(`      Interval Count: ${price.recurring.interval_count}`);
        }
        // Add other price fields as needed
      });
    } else {
      console.log(`No product found with ID: ${productId}`);
    }
  } catch (error) {
    console.error("Error in test function:", error);
  }
};

export { testFetchCarbonCreditProducts, testFetchSpecificCarbonCreditProduct };
