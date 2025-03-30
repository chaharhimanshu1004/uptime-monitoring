import redis from "./redis";

const QUEUE_NAME = "uptime-monitoring-queue";
// const USER_WEBSITES_SET = "user-websites:";

interface WebsiteCheck {
  id: number,
  url: string;
  nextCheckTime: number;
  userId: string;
  userEmail: string;
}

export async function registerWebsite(url: string,userId:string,userEmail:string,websiteId:number) {
  const initialCheckTime = Date.now();
  // await addWebsiteToQueue({ url, nextCheckTime: initialCheckTime,userId });
  const check: WebsiteCheck = { url, nextCheckTime: initialCheckTime, userId,userEmail , id: websiteId };
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

export async function unregisterWebsite(websiteId: number): Promise<boolean> {
  try {
    const queueItems = await redis.zrange(QUEUE_NAME, 0, -1)

    let removed = false
    for (const item of queueItems) {
      try {
        const parsedItem = JSON.parse(item)
        if (parsedItem.id === websiteId) {
          const result = await redis.zrem(QUEUE_NAME, item)
          if (result > 0) {
            removed = true
            console.log(`Unregistered website ID ${websiteId} from monitoring queue`)
          }
        }
      } catch (error) {
        console.error("Error parsing queue item:", error)
      }
    }

    return removed;
  } catch (error) {
    console.error("Error unregistering website:", error)
    throw error
  }
}




