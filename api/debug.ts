import {
  fetchCarbonCreditProducts,
  fetchSpecificCarbonCreditProduct,
  fetchCarbonCreditSubscription,
  fetchCarbonCreditsByPaymentId,
} from "./products";

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
      console.log(`  Project Name: ${product.stripe_metadata_project_name}`);
      console.log(`  Certificate Title: ${product.stripe_metadata_certificate_title}`);
      console.log(`  Retirement Reason: ${product.stripe_metadata_retirement_reason}`);
      console.log(`  Serial Number: ${product.stripe_metadata_serial_number}`);
      console.log(`  FG Logo: ${product.stripe_metadata_fg_logo}`);
      console.log(`  Standard: ${product.stripe_metadata_standard_logo}`);
      console.log(`  Mini Standard: ${product.stripe_metadata_mini_standard}`);

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

const testFetchCarbonCreditSubscription = async () => {
  try {
    console.log("Testing fetchCarbonCreditSubscription function...");

    const testEmissions = [16.7, 17.1, 18.9, 19.6, 20.5];

    for (const emissions of testEmissions) {
      console.log(`\nTest Case: Emissions ${emissions}`);
      const result = await fetchCarbonCreditSubscription(emissions);

      if (result) {
        console.log("Product:");
        console.log(`  ID: ${result.product.id}`);
        console.log(`  Name: ${result.product.name}`);
        console.log(`  Description: ${result.product.description}`);
        console.log(`  Product Type: ${result.product.stripe_metadata_product_type}`);
        console.log(`  Subscription Type: ${result.product.stripe_metadata_subscription_type}`);
        console.log("Recommended Price:");
        console.log(`  ID: ${result.recommendedPrice.id}`);
        console.log(`  Unit Amount: ${result.recommendedPrice.unit_amount}`);
      } else {
        console.log("No result returned");
      }
    }
  } catch (error) {
    console.error("Error in test function:", error);
  }
};

const testFetchCarbonCreditsByPaymentId = async (paymentId: string) => {
  try {
    console.log(`Testing fetchCarbonCreditsByPaymentId with payment ID: ${paymentId}`);

    const carbonCredits = await fetchCarbonCreditsByPaymentId(paymentId);

    if (carbonCredits.length > 0) {
      console.log(`Found ${carbonCredits.length} Carbon Credit(s):`);
      
      carbonCredits.forEach((carbonCredit, creditIndex) => {
        console.log(`\nCarbon Credit ${creditIndex + 1}:`);
        console.log(`ID: ${carbonCredit.id}`);
        console.log(`Name: ${carbonCredit.name}`);
        console.log(`Description: ${carbonCredit.description}`);
        console.log(`Active: ${carbonCredit.active}`);
        console.log(`Images: ${carbonCredit.images.join(", ")}`);
        console.log(`Role: ${carbonCredit.role}`);
        console.log(`Tax Code: ${carbonCredit.tax_code}`);

        console.log("Metadata:");
        Object.entries(carbonCredit.metadata).forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });

        console.log("Stripe Metadata:");
        console.log(`  CTA: ${carbonCredit.stripe_metadata_cta}`);
        console.log(`  Key Features: ${carbonCredit.stripe_metadata_key_features}`);
        console.log(`  Product Type: ${carbonCredit.stripe_metadata_product_type}`);
        console.log(`  Project Overview: ${carbonCredit.stripe_metadata_project_overview}`);
        console.log(`  Registry Link: ${carbonCredit.stripe_metadata_registry_link}`);
        console.log(`  Registry Title: ${carbonCredit.stripe_metadata_registry_title}`);
        console.log(`  Your Purchase: ${carbonCredit.stripe_metadata_your_purchase}`);
        console.log(`  Color 0: ${carbonCredit.stripe_metadata_color_0}`);
        console.log(`  Color 1: ${carbonCredit.stripe_metadata_color_1}`);
        console.log(`  Color 2: ${carbonCredit.stripe_metadata_color_2}`);
        console.log(`  Project Name: ${carbonCredit.stripe_metadata_project_name}`);
        console.log(`  Certificate Title: ${carbonCredit.stripe_metadata_certificate_title}`);
        console.log(`  Retirement Reason: ${carbonCredit.stripe_metadata_retirement_reason}`);
        console.log(`  Serial Number: ${carbonCredit.stripe_metadata_serial_number}`);
        console.log(`  FG Logo: ${carbonCredit.stripe_metadata_fg_logo}`);
        console.log(`  Standard: ${carbonCredit.stripe_metadata_standard_logo}`);
        console.log(`  Mini Standard: ${carbonCredit.stripe_metadata_mini_standard}`);

        console.log("Prices:");
        carbonCredit.prices.forEach((price, index) => {
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
        });
      });
    } else {
      console.log(`No carbon credits found for payment ID: ${paymentId}`);
    }
  } catch (error) {
    console.error("Error in test function:", error);
  }
};


export {
  testFetchCarbonCreditProducts,
  testFetchSpecificCarbonCreditProduct,
  testFetchCarbonCreditSubscription,
  testFetchCarbonCreditsByPaymentId,
};
