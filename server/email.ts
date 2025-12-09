import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_APP_PASSWORD,
    },
  });
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOtpExpiryTime(): string {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10);
  return expiry.toISOString();
}

export async function sendOtpEmail(
  email: string,
  otp: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"AQeel Pharmacy" <${process.env.ZOHO_EMAIL}>`,
      to: email,
      subject: "Your Verification Code - AQeel Pharmacy",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">AQeel Pharmacy</h1>
            <p style="color: #64748b; margin-top: 5px;">Your Trusted Healthcare Partner</p>
          </div>
          
          <div style="background: #f8fafc; border-radius: 12px; padding: 30px; text-align: center;">
            <h2 style="color: #1e293b; margin-top: 0;">Verification Code</h2>
            <p style="color: #64748b; margin-bottom: 25px;">
              Enter this code to verify your email address and access your account.
            </p>
            
            <div style="background: #ffffff; border: 2px dashed #2563eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">
                ${otp}
              </span>
            </div>
            
            <p style="color: #94a3b8; font-size: 14px; margin-top: 20px;">
              This code will expire in 10 minutes.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              If you didn't request this code, please ignore this email.
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 10px;">
              &copy; ${new Date().getFullYear()} AQeel Pharmacy. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    await getTransporter().sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return false;
  }
}
