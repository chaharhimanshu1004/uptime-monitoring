import redis from "./redis";

const QUEUE_NAME = "uptime-monitoring-queue";

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

