import nodemailer from "nodemailer";

const hasOAuth2Config =
  process.env.GOOGLE_USER &&
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_REFRESH_TOKEN;

const transporter = nodemailer.createTransport(
  hasOAuth2Config
    ? {
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.GOOGLE_USER,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        },
      }
    : {
        service: "gmail",
        auth: {
          user: process.env.GOOGLE_USER,
          pass: process.env.GOOGLE_APP_PASSWORD,
        },
      },
);

if (hasOAuth2Config || process.env.GOOGLE_APP_PASSWORD) {
  transporter.verify((err, success) => {
    if (err) {
      console.log(err);
      if (err.response) {
        console.log(err.response);
      }
    } else {
      console.log(success);
    }
  });
}

export async function sendEmail({ to, subject, html, text }) {
  const mailOptions = {
    from: process.env.GOOGLE_USER,
    to,
    subject,
    html,
    text,
  };
  const details = await transporter.sendMail(mailOptions);
  console.log("Email sent:", details);
}

export default sendEmail;
