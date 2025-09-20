import cron from "node-cron";
import { connectDB } from "./mongodb";
import StudyBlock from "./models/StudyBlock";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(to: string, subject: string, text: string) {
  await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text });
}

export async function startCron() {
  await connectDB();

  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const targetTime = new Date(now.getTime() + 10 * 60 * 1000); 

    const blocks = await StudyBlock.find({
      startTime: { $gte: now, $lte: targetTime },
      notified: false,
    });

    for (const block of blocks) {
      try {
        const userEmail = `${block.userId}@example.com`;

        await sendEmail(
          userEmail,
          "Quiet Hours Reminder",
          `Your study block starts at ${block.startTime.toLocaleString()}`
        );

        block.notified = true;
        await block.save();
        console.log(`Email sent to ${userEmail} for block starting at ${block.startTime}`);
      } catch (err) {
        console.error("Failed to send email for block:", block._id, err);
      }
    }
  });

  console.log("Cron job started: checking blocks every minute...");
}
