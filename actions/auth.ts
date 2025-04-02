// actions/auth.ts
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, error: "User not found" };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour expiry

  await prisma.user.update({
    where: { email },
    data: {
      passwordResetToken: resetToken,
      passwordResetExpires: resetTokenExpires,
    },
  });

  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${email}`;

  //   await resend.emails.send({
  //     from: "noreply@yourdomain.com",
  //     to: email,
  //     subject: "Password Reset Request",
  //     text: `Click this link to reset your password: ${resetLink}`,
  //   });

  return { success: true, link: resetLink };
}

export async function resetPassword(
  email: string,
  token: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (
    !user ||
    user.passwordResetToken !== token ||
    !user.passwordResetExpires ||
    user.passwordResetExpires < new Date()
  ) {
    return { success: false, error: "Invalid or expired reset token" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  return { success: true };
}
