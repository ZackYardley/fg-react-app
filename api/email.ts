import { getFirestore, collection, addDoc } from "firebase/firestore";

// Function to send a generic email by adding a document to the 'mail' collection
// Deeplinking to be added
const sendEmail = async (to: string[], subject: string, text: string, html: string): Promise<void> => {
  const db = getFirestore();

  try {
    await addDoc(collection(db, "email"), {
      to,
      message: {
        subject,
        text,
        html,
      },
    });
  } catch (error) {
    console.error("Error adding email document:", error);
    throw error;
  }
};

// Function to send welcome email
const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  const subject = "Welcome to Forevergreen!";
  const text = `Dear ${name},\n\nWelcome to Forevergreen! 🌱\n\nWe're thrilled to have you join our community of passionate individuals committed to making a difference for our planet. Forevergreen is more than just a platform—it's a movement towards a sustainable future, and we're excited to help you take meaningful action.\n\nWhat You Can Expect:\n\n- Calculate Your Carbon Footprint: Our intuitive tools allow you to track your carbon emissions and identify areas where you can make impactful changes.\n- Take Action: Whether it’s planting trees, creating sustainable grids, or reducing waste, Forevergreen provides actionable solutions to help you offset your carbon footprint.\n- Monitor Your Progress: Keep track of your efforts with our monthly reports and see the real-world impact of your sustainable choices.\n- Join a Community: Connect with like-minded individuals, share your sustainability journey, and inspire others to make a difference.\n\nGetting Started:\n\n1. Log In: Visit our platform [here] and log in using the credentials you used to sign up.\n2. Complete Your Profile: Tell us more about yourself and your sustainability goals.\n3. Calculate Your Footprint: Use our carbon calculator to get started on your sustainability journey.\n4. Explore: Discover the various actions you can take to reduce your carbon footprint, from everyday changes to larger commitments.\n\nWe’re here to support you every step of the way. If you have any questions or need assistance, don’t hesitate to reach out to our support team at info@forevergreen.earth or check out our [Help Center/FAQ page].\n\nThank you for joining Forevergreen—together, we can create a greener, more sustainable world!`;

  const html = `
    <p>Dear ${name},</p>
    <h2>Welcome to Forevergreen! 🌱</h2>
    <p>We're thrilled to have you join our community of passionate individuals committed to making a difference for our planet. Forevergreen is more than just a platform—it's a movement towards a sustainable future, and we're excited to help you take meaningful action.</p>
    <h3>What You Can Expect:</h3>
    <ul>
      <li><strong>Calculate Your Carbon Footprint:</strong> Our intuitive tools allow you to track your carbon emissions and identify areas where you can make impactful changes.</li>
      <li><strong>Take Action:</strong> Whether it’s planting trees, creating sustainable grids, or reducing waste, Forevergreen provides actionable solutions to help you offset your carbon footprint.</li>
      <li><strong>Monitor Your Progress:</strong> Keep track of your efforts with our monthly reports and see the real-world impact of your sustainable choices.</li>
      <li><strong>Join a Community:</strong> Connect with like-minded individuals, share your sustainability journey, and inspire others to make a difference.</li>
    </ul>
    <h3>Getting Started:</h3>
    <ol>
      <li><strong>Log In:</strong> Visit our platform <a href="https://fg-react-app.web.app/">here</a> and log in using the credentials you used to sign up.</li>
      <li><strong>Complete Your Profile:</strong> Tell us more about yourself and your sustainability goals.</li>
      <li><strong>Calculate Your Footprint:</strong> Use our carbon calculator to get started on your sustainability journey.</li>
      <li><strong>Explore:</strong> Discover the various actions you can take to reduce your carbon footprint, from everyday changes to larger commitments.</li>
    </ol>
    <p>We’re here to support you every step of the way. If you have any questions or need assistance, don’t hesitate to reach out to our support team at info@forevergreen.earth or check out our <a href="https://www.forevergreen.earth/about">Help Center/FAQ page</a>.</p>
    <p>Thank you for joining Forevergreen—together, we can create a greener, more sustainable world!</p>
  `;

  await sendEmail([email], subject, text, html);
};

// Function to send account deletion email
const sendAccountDeletionEmail = async (email: string, name: string): Promise<void> => {
  const subject = `Sorry to See You Go, ${name} 🌱`;
  const text = `Hi ${name},\n\nWe noticed that you've recently deleted your Forevergreen account. We're sorry to see you leave our community of eco-conscious individuals working towards a more sustainable future. 🌍\n\nIf there’s anything we could have done better or if you have any feedback, we’d love to hear from you. Your insights can help us improve and make the world a little greener together.\n\nIf you ever change your mind, know that you’re always welcome back. Your contributions have already made a difference, and we hope you’ll continue your sustainability journey with us in the future.\n\nUntil then, stay green and take care! 🌱\n\nBest regards,\n\nThe Forevergreen Team`;
  const html = `
    <p>Hi ${name},</p>
    <p>We noticed that you've recently deleted your Forevergreen account. We're sorry to see you leave our community of eco-conscious individuals working towards a more sustainable future. 🌍</p>
    <p>If there’s anything we could have done better or if you have any feedback, we’d love to hear from you. Your insights can help us improve and make the world a little greener together.</p>
    <p>If you ever change your mind, know that you’re always welcome back. Your contributions have already made a difference, and we hope you’ll continue your sustainability journey with us in the future.</p>
    <p>Until then, stay green and take care! 🌱</p>
    <p>Best regards,<br>The Forevergreen Team</p>
  `;

  await sendEmail([email], subject, text, html);
};

const sendSuccessfulPaymentEmail = async (
  email: string,
  name: string,
  transactionId: string,
  customerId: string,
  carbonCreditDetails: string,
  paymentAmount: number,
  timestamp: string
): Promise<void> => {
  const subject = "🎉 Payment Success! You're Making a Greener Future 🌱";
  const text = `Hi ${name},

Woohoo! 🎉 Your payment has been successfully processed, and your carbon credits are now working hard to make the planet a better place. 🌍 Here's a summary of your transaction:

* Transaction ID: ${transactionId}
* Customer ID: ${customerId}
* Carbon Credit Details: ${carbonCreditDetails}
* Payment Amount: $${paymentAmount}
* Timestamp: ${timestamp}

Your contribution isn't just a drop in the ocean—it's a wave of positive change! 🌊 Thanks to you, we're one step closer to a greener, more sustainable future.

Need help or have questions? Our friendly support team is just an email away at info@forevergreen.earth. 😊

Keep being awesome,
The Forevergreen Team 🌿`;

  const html = `
    <h2>🎉 Payment Success! You're Making a Greener Future 🌱</h2>
    <p>Hi ${name},</p>
    <p>Woohoo! 🎉 Your payment has been successfully processed, and your carbon credits are now working hard to make the planet a better place. 🌍 Here's a summary of your transaction:</p>
    <ul>
      <li><strong>Transaction ID:</strong> ${transactionId}</li>
      <li><strong>Customer ID:</strong> ${customerId}</li>
      <li><strong>Carbon Credit Details:</strong> ${carbonCreditDetails}</li>
      <li><strong>Payment Amount:</strong> $${paymentAmount}</li>
      <li><strong>Timestamp:</strong> ${timestamp}</li>
    </ul>
    <p>Your contribution isn't just a drop in the ocean—it's a wave of positive change! 🌊 Thanks to you, we're one step closer to a greener, more sustainable future.</p>
    <p>Need help or have questions? Our friendly support team is just an email away at info@forevergreen.earth. 😊</p>
    <p>Keep being awesome,<br>The Forevergreen Team 🌿</p>
  `;

  await sendEmail([email], subject, text, html);
};

const sendPaymentProcessingEmail = async (
  email: string,
  name: string,
  transactionId: string,
  customerId: string,
  carbonCreditDetails: string,
  paymentAmount: number,
  timestamp: string
): Promise<void> => {
  const subject = "⏳ Payment Processing - Your Carbon Credits are on the Way!";
  const text = `Hi ${name},

Just a quick update: we've received your payment request, and it's currently being processed. Your carbon credits will soon be hard at work reducing carbon footprints! 🌍

Here are the details of your transaction:

* Transaction ID: ${transactionId}
* Customer ID: ${customerId}
* Carbon Credit Details: ${carbonCreditDetails}
* Payment Amount: $${paymentAmount}
* Timestamp: ${timestamp}

Hang tight! We'll let you know as soon as everything's finalized. If you have any questions in the meantime, our support team is here to help—just drop us a line at info@forevergreen.earth. 📧

Thanks for being a part of the green movement! 🌱

Warm regards,
The Forevergreen Team 🌿`;

  const html = `
    <h2>⏳ Payment Processing - Your Carbon Credits are on the Way!</h2>
    <p>Hi ${name},</p>
    <p>Just a quick update: we've received your payment request, and it's currently being processed. Your carbon credits will soon be hard at work reducing carbon footprints! 🌍</p>
    <p>Here are the details of your transaction:</p>
    <ul>
      <li><strong>Transaction ID:</strong> ${transactionId}</li>
      <li><strong>Customer ID:</strong> ${customerId}</li>
      <li><strong>Carbon Credit Details:</strong> ${carbonCreditDetails}</li>
      <li><strong>Payment Amount:</strong> $${paymentAmount}</li>
      <li><strong>Timestamp:</strong> ${timestamp}</li>
    </ul>
    <p>Hang tight! We'll let you know as soon as everything's finalized. If you have any questions in the meantime, our support team is here to help—just drop us a line at info@forevergreen.earth. 📧</p>
    <p>Thanks for being a part of the green movement! 🌱</p>
    <p>Warm regards,<br>The Forevergreen Team 🌿</p>
  `;

  await sendEmail([email], subject, text, html);
};

const sendFailedPaymentEmail = async (
  email: string,
  name: string,
  transactionId: string,
  customerId: string,
  carbonCreditDetails: string,
  paymentAmount: number,
  timestamp: string
): Promise<void> => {
  const subject = "⚠️ Payment Issue - Let's Try Again!";
  const text = `Hi ${name},

Uh-oh! 🚨 It looks like there was an issue processing your payment for the carbon credits. But don't worry—we've got your back. Here's what happened:

* Transaction ID: ${transactionId}
* Customer ID: ${customerId}
* Carbon Credit Details: ${carbonCreditDetails}
* Payment Amount: $${paymentAmount}
* Timestamp: ${timestamp}

Please try again, or use a different payment method. If you need any help, our support team is ready to assist at info@forevergreen.earth. We're here to ensure your contribution helps make the world a better place! 🌍

Thanks for your dedication to a sustainable future,
The Forevergreen Team 🌿`;

  const html = `
    <h2>⚠️ Payment Issue - Let's Try Again!</h2>
    <p>Hi ${name},</p>
    <p>Uh-oh! 🚨 It looks like there was an issue processing your payment for the carbon credits. But don't worry—we've got your back. Here's what happened:</p>
    <ul>
      <li><strong>Transaction ID:</strong> ${transactionId}</li>
      <li><strong>Customer ID:</strong> ${customerId}</li>
      <li><strong>Carbon Credit Details:</strong> ${carbonCreditDetails}</li>
      <li><strong>Payment Amount:</strong> $${paymentAmount}</li>
      <li><strong>Timestamp:</strong> ${timestamp}</li>
    </ul>
    <p>Please try again, or use a different payment method. If you need any help, our support team is ready to assist at info@forevergreen.earth. We're here to ensure your contribution helps make the world a better place! 🌍</p>
    <p>Thanks for your dedication to a sustainable future,<br>The Forevergreen Team 🌿</p>
  `;

  await sendEmail([email], subject, text, html);
};

// todo: add carbon credit subscription email
// todo: add carbon credit subscription cancellation email
// todo: add carbon credit subscription renewal email

export {
  sendEmail,
  sendWelcomeEmail,
  sendAccountDeletionEmail,
  sendSuccessfulPaymentEmail,
  sendPaymentProcessingEmail,
  sendFailedPaymentEmail,
};
