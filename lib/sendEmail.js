import nodemailer from "nodemailer";

export default async function sendMail(mailOptions) {
  try {
    const smtpTransport = await nodemailer.createTransport({
      host: process.env.EMAIL_SMTP_SERVER,
      port: process.env.EMAIL_SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_SMTP_USERNAME,
        pass: process.env.EMAIL_SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const { to, subject, text, html } = mailOptions;

    const mailData = {
      from: process.env.EMAIL_FROM_ADDRESS,
      to,
      subject,
      text,
      html,
    };

    await smtpTransport.sendMail(mailData);

    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
}
