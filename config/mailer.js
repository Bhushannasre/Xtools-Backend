import nodemailer from "nodemailer";

// Gmail SMTP via nodemailer's built-in "gmail" service shorthand.
//
// EMAIL_USER must be a full Gmail address (e.g. yourname@gmail.com).
// EMAIL_PASS must be a 16-character Google "App Password" — NOT the
// account's normal login password. App Passwords require 2-Step
// Verification to already be enabled on the Google account, then are
// generated at: https://myaccount.google.com/apppasswords
//
// The server deliberately does NOT crash on startup if these are missing
// (unlike MONGO_URI/JWT_SECRET/CLIENT_URL in server.js) — forgot-password
// email is one feature among many, so the rest of the app should keep
// working in dev before this is configured. forgotPassword() in
// userController.js checks isMailerConfigured() and returns a clear error
// instead of crashing or silently failing.
const mailerConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

if (!mailerConfigured) {
    console.warn(
        "⚠️  EMAIL_USER / EMAIL_PASS are not set — password reset emails will fail until both are added to .env (see config/mailer.js for how to generate a Gmail App Password)."
    );
}

export const transporter = mailerConfigured
    ? nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
          },
      })
    : null;

export function isMailerConfigured() {
    return mailerConfigured;
}