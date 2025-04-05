import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD, // Gmail App Password
      },
    });
  }

  async sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `No-Reply <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }
}

export const emailService = new EmailService();
