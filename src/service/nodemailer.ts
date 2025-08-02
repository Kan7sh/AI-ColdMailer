import nodemailer from "nodemailer";

export interface EmailOptions {
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  body: string;
  senderPassword: string;
}

export async function sendEmail({
  senderEmail,
  recipientEmail,
  subject,
  body,
  senderPassword,
}: EmailOptions): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
    });

    const mailOptions = {
      from: senderEmail,
      to: recipientEmail,
      subject: subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error: any) {
    console.error("Failed to send email:", error.message);
    throw error;
  }
}
