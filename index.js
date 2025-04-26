import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post("/api/quote", async (req, res) => {
  const { fullName, companyName, email, phone, description, selectedService } =
    req.body;

  if (!fullName || !email || !phone || !companyName || !selectedService) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.MAIL_TO,
    subject: `Demande de devis de ${fullName}`,
    html: `
      <h3>Demande de devis</h3>
      <p><strong>Nom:</strong> ${fullName}</p>
      <p><strong>Compagnie:</strong> ${companyName || "N/A"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Numéro:</strong> ${phone}</p>
      <p><strong>Services selectionné:</strong> ${selectedService || "N/A"}</p>
      <p><strong>Description:</strong> ${description || "N/A"}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
