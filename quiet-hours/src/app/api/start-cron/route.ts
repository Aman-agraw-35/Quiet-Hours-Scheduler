import { startCron } from "@/lib/cron";

export default async function handler(req: any, res: any) {
  try {
      console.log("Test cron run");
      
    await startCron();
    res.status(200).json({ message: "Cron started" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start cron" });
  }
}
