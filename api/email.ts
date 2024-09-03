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
      <li><strong>Log In:</strong> Visit our platform [here] and log in using the credentials you used to sign up.</li>
      <li><strong>Complete Your Profile:</strong> Tell us more about yourself and your sustainability goals.</li>
      <li><strong>Calculate Your Footprint:</strong> Use our carbon calculator to get started on your sustainability journey.</li>
      <li><strong>Explore:</strong> Discover the various actions you can take to reduce your carbon footprint, from everyday changes to larger commitments.</li>
    </ol>
    <p>We’re here to support you every step of the way. If you have any questions or need assistance, don’t hesitate to reach out to our support team at info@forevergreen.earth or check out our [Help Center/FAQ page].</p>
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

// todo: add carbon credit purchase email
// todo: add carbon credit subscription email
// todo: add carbon credit subscription cancellation email
// todo: add carbon credit subscription renewal email

export { sendEmail, sendWelcomeEmail, sendAccountDeletionEmail };
