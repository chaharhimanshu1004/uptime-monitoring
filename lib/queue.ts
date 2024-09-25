import redis from "./redis";

const QUEUE_NAME = "uptime-monitoring-queue";
// const USER_WEBSITES_SET = "user-websites:";

interface WebsiteCheck {
  url: string;
  nextCheckTime: number;
  userId: string;
  userEmail: string;
}

export async function registerWebsite(url: string,userId:string,userEmail:string) {
  const initialCheckTime = Date.now();
  // await addWebsiteToQueue({ url, nextCheckTime: initialCheckTime,userId });
  const check: WebsiteCheck = { url, nextCheckTime: initialCheckTime, userId,userEmail };
  await addWebsiteToQueue(check);
  // await Promise.all([
  //   addWebsiteToQueue(check),
  //   addWebsiteToUserSet(userId, url)
  // ]);
}

// async function addWebsiteToUserSet(userId: string, url: string) {
//   await redis.sadd(`${USER_WEBSITES_SET}${userId}`, url);
// }

async function addWebsiteToQueue(check: WebsiteCheck) {
  await redis.zadd(QUEUE_NAME, check.nextCheckTime, JSON.stringify(check));
}

