import redis from "./redis";

const QUEUE_NAME = "uptime-monitoring-queue";
const CHECK_INTERVAL = 5 * 60 * 1000;

interface WebsiteCheck {
  url: string;
  nextCheckTime: number;
}

export async function registerWebsite(url: string) {
  const initialCheckTime = Date.now();
  await addWebsiteToQueue({ url, nextCheckTime: initialCheckTime });

}

async function addWebsiteToQueue(check: WebsiteCheck) {
  await redis.zadd(QUEUE_NAME, check.nextCheckTime, JSON.stringify(check));
}

export async function extractWebsiteFromQueue(): Promise<WebsiteCheck | null> {
  const now = Date.now();
  const result = await redis.zrangebyscore(QUEUE_NAME, 0, now, "LIMIT", 0, 1);
  if (result.length === 0) {
    return null;
  }
  const check: WebsiteCheck = JSON.parse(result[0]);
  await redis.zrem(QUEUE_NAME, result[0]);

  return check;
}

export async function rescheduleWebsiteCheck(url: string) {
  const nextCheckTime = Date.now() + CHECK_INTERVAL;
  await addWebsiteToQueue({ url, nextCheckTime });
}
