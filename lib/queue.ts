import redis from "./redis";

const QUEUE_NAME = "uptime-monitoring-queue";
const REGIONS = ["asia", "europe"];
// const USER_WEBSITES_SET = "user-websites:";

interface WebsiteCheck {
  id: number,
  url: string;
  nextCheckTime: number;
  userId: string;
  userEmail: string;
  isPaused: boolean;
  isFirstCheck: boolean;
  isEmailSent: boolean;
  lastEmailSentAt: Date | null;
  region: string;
}

export async function registerWebsite(url: string,userId:string,userEmail:string,websiteId:number) {
  const initialCheckTime = Date.now();
  // await addWebsiteToQueue({ url, nextCheckTime: initialCheckTime,userId });
  for (const region of REGIONS) {
    const check: WebsiteCheck = { url, nextCheckTime: initialCheckTime, userId, userEmail, id: websiteId, isPaused: false, isFirstCheck: true, region, isEmailSent: false, lastEmailSentAt: null };
    await addWebsiteToQueue(check);
  }
  // await Promise.all([
  //   addWebsiteToQueue(check),
  //   addWebsiteToUserSet(userId, url)
  // ]);
}

// async function addWebsiteToUserSet(userId: string, url: string) {
//   await redis.sadd(`${USER_WEBSITES_SET}${userId}`, url);
// }

async function addWebsiteToQueue(check: WebsiteCheck) {
  const REGION_WISE_QUEUE_NAME = `${QUEUE_NAME}-${check.region}`;
  await redis.zadd(REGION_WISE_QUEUE_NAME, check.nextCheckTime, JSON.stringify(check));
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

export async function pauseWebsiteMonitoring(websiteId: number): Promise<boolean> {
  try {
    const queueItems = await redis.zrange(QUEUE_NAME, 0, -1);
    
    let paused = false;
    for (const item of queueItems) {
      try {
        const parsedItem = JSON.parse(item);
        if (parsedItem.id === websiteId) {
          if (parsedItem.isPaused) {
            return true;
          }
          await redis.zrem(QUEUE_NAME, item);
          parsedItem.isPaused = true;
          await redis.zadd(QUEUE_NAME, parsedItem.nextCheckTime, JSON.stringify(parsedItem));
          paused = true;
          console.log(`Paused monitoring for website ID ${websiteId}`);
          break;
        }
      } catch (error) {
        console.error("Error parsing queue item:", error);
      }
    }
    
    return paused;
  } catch (error) {
    console.error("Error pausing website monitoring:", error);
    throw error;
  }
}


export async function resumeWebsiteMonitoring(websiteId: number): Promise<boolean> {
  try {
    const queueItems = await redis.zrange(QUEUE_NAME, 0, -1);
    
    let resumed = false;
    for (const item of queueItems) {
      try {
        const parsedItem = JSON.parse(item);
        if (parsedItem.id === websiteId) {
          if (!parsedItem.isPaused) {
            return true;
          }
          
          await redis.zrem(QUEUE_NAME, item);
          
          parsedItem.isPaused = false;
          parsedItem.nextCheckTime = Date.now(); 
          await redis.zadd(QUEUE_NAME, parsedItem.nextCheckTime, JSON.stringify(parsedItem));
          
          resumed = true;
          console.log(`Resumed monitoring for website ID ${websiteId}`);
          break;
        }
      } catch (error) {
        console.error("Error parsing queue item:", error);
      }
    }
    
    return resumed;
  } catch (error) {
    console.error("Error resuming website monitoring:", error);
    throw error;
  }
}








