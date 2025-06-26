// api/index.js - Complete serverless function
const sgMail = require("@sendgrid/mail");

// Set API key once at module level
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "https://sigridvolders.be");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Handle GET request
  if (req.method === "GET") {
    res.status(200).json({ message: "Hello, world!" });
    return;
  }

  // Handle POST request
  if (req.method === "POST") {
    try {
      // Validate required environment variables
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error("SENDGRID_API_KEY is not configured");
      }
      if (!process.env.SENDGRID_FROM_EMAIL) {
        throw new Error("SENDGRID_FROM_EMAIL is not configured");
      }
      if (!process.env.SENDGRID_TO_EMAIL) {
        throw new Error("SENDGRID_TO_EMAIL is not configured");
      }
      if (!process.env.SENDGRID_TEMPLATE_ID) {
        throw new Error("SENDGRID_TEMPLATE_ID is not configured");
      }

      const data = req.body;

      // Validate request body
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({
          message: "Request body is required",
          error: "INVALID_REQUEST_BODY",
        });
      }

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

      console.log("Attempting to send email with template:", process.env.SENDGRID_TEMPLATE_ID);

      const response = await sgMail.send(msg);

      console.log("Email sent successfully:", {
        statusCode: response[0].statusCode,
        messageId: response[0].headers["x-message-id"],
      });

      res.status(201).json({
        message: "Email successfully sent!",
        messageId: response[0].headers["x-message-id"],
      });
    } catch (error) {
      console.error("SendGrid error details:", {
        message: error.message,
        code: error.code,
        statusCode: error.response?.status,
        body: error.response?.body,
        stack: error.stack,
      });

      // Return more specific error information
      if (error.code === "ECONNRESET") {
        res.status(500).json({
          message: "Network connection error. Please try again.",
          error: "CONNECTION_RESET",
        });
      } else if (error.response?.status === 401) {
        res.status(500).json({
          message: "SendGrid API authentication failed.",
          error: "AUTHENTICATION_ERROR",
        });
      } else if (error.response?.status === 400) {
        res.status(400).json({
          message: "Invalid email data or template.",
          error: "INVALID_EMAIL_DATA",
          details: error.response?.body,
        });
      } else {
        res.status(500).json({
          message: "Failed to send the email.",
          error: error.message || "UNKNOWN_ERROR",
        });
      }
    }
    return;
  }

  // Method not allowed
  res.status(405).json({ message: "Method not allowed" });
}
