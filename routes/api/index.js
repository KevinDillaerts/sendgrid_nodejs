const express = require("express");
const sgMail = require("@sendgrid/mail");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Hello, world!" });
});

router.post("/", async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const data = req.body;
  const msg = {
    from: process.env.SENDGRID_FROM_EMAIL,
    template_id: process.env.SENDGRID_TEMPLATE_ID,
    personalizations: [
      {
        to: [
          {
            email: process.env.SENDGRID_TO_EMAIL,
          },
        ],
        dynamic_template_data: {
          ...data,
          date: new Date().toLocaleDateString("nl-BE"),
        },
      },
    ],
  };

  try {
    await sgMail.send(msg);
    res.status(201).json({ message: "Email successfully sent!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send the email." });
  }
});

module.exports = router;
