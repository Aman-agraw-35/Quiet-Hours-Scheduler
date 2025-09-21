import cron from "node-cron";
import { connectDB } from "./mongodb";
import StudyBlock, { StudyBlockType } from "./models/StudyBlock";
import nodemailer, { Transporter } from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail({ to, subject, text }: EmailOptions): Promise<void> {
  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  });

  console.log(`Email queued: ${info.messageId} -> ${to}`);
}

export async function startCron(): Promise<void> {
  await connectDB();

  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const targetTime = new Date(now.getTime() + 10 * 60 * 1000);

    console.log("🔍 Cron check at", now.toLocaleString());

    try {
      const blocks: StudyBlockType[] = await StudyBlock.find({
        startTime: { $gte: now, $lte: targetTime },
        notified: false,
      });

      for (const block of blocks) {
        try {
          const userEmail: string = block.email;

          await sendEmail({
            to: userEmail,
            subject: "Quiet Hours Reminder",
            text: `Your study block starts at ${block.startTime.toLocaleString()}`,
          });

          block.notified = true;
          await block.save();

          console.log(`📧 Email sent to ${userEmail} for block ${block._id}`);
        } catch (err: any) {
          console.error("❌ Failed to send email for block:", block._id, err.message);
        }
      }
    } catch (err: any) {
      console.error("❌ Cron job failed:", err.message);
    }
  });

  console.log("✅ Cron job started: checking blocks every minute...");
}
