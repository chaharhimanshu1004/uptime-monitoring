import redis from "./redis";

const QUEUE_NAME = "uptime-monitoring-queue";
const RECOVERY_SET = "uptime-processing-set";
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
  isAcknowledged: boolean;
}

export async function registerWebsite(url: string,userId:string,userEmail:string,websiteId:number) {
  const initialCheckTime = Date.now();
  // await addWebsiteToQueue({ url, nextCheckTime: initialCheckTime,userId });
  for (const region of REGIONS) {
    const check: WebsiteCheck = { url, nextCheckTime: initialCheckTime, userId, userEmail, id: websiteId, isPaused: false, isFirstCheck: true, region, isEmailSent: false, lastEmailSentAt: null, isAcknowledged: false };
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
    let websiteDeleted = false;
    for (const region of REGIONS) {
      const REGION_WISE_QUEUE = `${QUEUE_NAME}-${region}`;
      const REGION_WISE_RECOVERY_SET = `${RECOVERY_SET}-${region}`;
      
      // Remove from monitoring queue
      const queueItems = await redis.zrange(REGION_WISE_QUEUE, 0, -1);
      for (const item of queueItems) {
        try {
          const parsedItem = JSON.parse(item);
          if (parsedItem.id === websiteId) {
            const result = await redis.zrem(REGION_WISE_QUEUE, item);
            if (result > 0) {
              websiteDeleted = true;
              console.log(`Unregistered website ID ${websiteId} from ${REGION_WISE_QUEUE}`);
            }
          }
        } catch (error) {
          console.error(`Error parsing queue item from ${REGION_WISE_QUEUE}:`, error);
          throw error;
        }
      }
      
      // Remove from recovery set
      const recoveryItems = await redis.zrange(REGION_WISE_RECOVERY_SET, 0, -1);
      for (const item of recoveryItems) {
        try {
          const parsedItem = JSON.parse(item);
          if (parsedItem.id === websiteId) {
            const result = await redis.zrem(REGION_WISE_RECOVERY_SET, item);
            if (result > 0) {
              websiteDeleted = true;
              console.log(`Unregistered website ID ${websiteId} from ${REGION_WISE_RECOVERY_SET}`);
            }
          }
        } catch (error) {
          console.error(`Error parsing recovery item from ${REGION_WISE_RECOVERY_SET}:`, error);
          throw error;
        }
      }
    }

    return websiteDeleted;
  } catch (error) {
    console.error(`Error unregistering website for websiteId: ${websiteId}`, error);
    throw error;
  }
}

export async function pauseWebsiteMonitoring(websiteId: number): Promise<boolean> {
  try {
    let paused = false;

    for (const region of REGIONS) {
      const REGION_WISE_QUEUE = `${QUEUE_NAME}-${region}`;
      const REGION_WISE_RECOVERY_SET = `${RECOVERY_SET}-${region}`;
      
      // Pause in monitoring queue
      const queueItems = await redis.zrange(REGION_WISE_QUEUE, 0, -1);
      for (const item of queueItems) {
        try {
          const parsedItem = JSON.parse(item);
          if (parsedItem.id === websiteId) {
            if (parsedItem.isPaused) {
              paused = true;
              continue;
            }
            await redis.zrem(REGION_WISE_QUEUE, item);
            parsedItem.isPaused = true;
            await redis.zadd(REGION_WISE_QUEUE, parsedItem.nextCheckTime, JSON.stringify(parsedItem));
            paused = true;
            console.log(`Paused monitoring for website ID ${websiteId} in ${REGION_WISE_QUEUE}`);
          }
        } catch (error) {
          console.error(`Error parsing queue item from ${REGION_WISE_QUEUE}:`, error);
          throw error;
        }
      }

      // Pause in recovery set
      const recoveryItems = await redis.zrange(REGION_WISE_RECOVERY_SET, 0, -1);
      for (const item of recoveryItems) {
        try {
          const parsedItem = JSON.parse(item);
          if (parsedItem.id === websiteId) {
            if (parsedItem.isPaused) {
              paused = true;
              continue;
            }
            await redis.zrem(REGION_WISE_RECOVERY_SET, item);
            parsedItem.isPaused = true;
            await redis.zadd(REGION_WISE_RECOVERY_SET, parsedItem.nextCheckTime, JSON.stringify(parsedItem));
            paused = true;
            console.log(`Paused monitoring for website ID ${websiteId} in ${REGION_WISE_RECOVERY_SET}`);
          }
        } catch (error) {
          console.error(`Error parsing recovery item from ${REGION_WISE_RECOVERY_SET}:`, error);
          throw error;
        }
      }
    }

    return paused;
  } catch (error) {
    console.error(`Error pausing website monitoring for websiteId : ${websiteId} `, error);
    throw error;
  }
}


export async function resumeWebsiteMonitoring(websiteId: number): Promise<boolean> {
  try {
    let resumed = false;

    for (const region of REGIONS) {
      const REGION_WISE_QUEUE = `${QUEUE_NAME}-${region}`;
      const REGION_WISE_RECOVERY_SET = `${RECOVERY_SET}-${region}`;
      
      // Resume in monitoring queue
      const queueItems = await redis.zrange(REGION_WISE_QUEUE, 0, -1);
      for (const item of queueItems) {
        try {
          const parsedItem = JSON.parse(item);
          if (parsedItem.id === websiteId) {
            if (!parsedItem.isPaused) {
              resumed = true;
              continue;
            }
            await redis.zrem(REGION_WISE_QUEUE, item);
            parsedItem.isPaused = false;
            parsedItem.nextCheckTime = Date.now();
            await redis.zadd(REGION_WISE_QUEUE, parsedItem.nextCheckTime, JSON.stringify(parsedItem));
            resumed = true;
            console.log(`Resumed monitoring for website ID ${websiteId} in ${REGION_WISE_QUEUE}`);
          }
        } catch (error) {
          console.error(`Error parsing queue item from ${REGION_WISE_QUEUE}:`, error);
          throw error;
        }
      }

      // Resume in recovery set
      const recoveryItems = await redis.zrange(REGION_WISE_RECOVERY_SET, 0, -1);
      for (const item of recoveryItems) {
        try {
          const parsedItem = JSON.parse(item);
          if (parsedItem.id === websiteId) {
            if (!parsedItem.isPaused) {
              resumed = true;
              continue;
            }
            await redis.zrem(REGION_WISE_RECOVERY_SET, item);
            parsedItem.isPaused = false;
            parsedItem.nextCheckTime = Date.now();
            await redis.zadd(REGION_WISE_RECOVERY_SET, parsedItem.nextCheckTime, JSON.stringify(parsedItem));
            resumed = true;
            console.log(`Resumed monitoring for website ID ${websiteId} in ${REGION_WISE_RECOVERY_SET}`);
          }
        } catch (error) {
          console.error(`Error parsing recovery item from ${REGION_WISE_RECOVERY_SET}:`, error);
          throw error;
        }
      }
    }

    return resumed;
  } catch (error) {
    console.error(`Error resuming website monitoring for websiteId: ${websiteId}`, error);
    throw error;
  }
}

export async function acknowledgeWebsite(websiteId: number): Promise<boolean> {
  try {
    let acknowledged = false;

    for (const region of REGIONS) {
      const REGION_WISE_QUEUE = `${QUEUE_NAME}-${region}`;
      const REGION_WISE_RECOVERY_SET = `${RECOVERY_SET}-${region}`;
      
      // Resume in monitoring queue
      const queueItems = await redis.zrange(REGION_WISE_QUEUE, 0, -1);
      for (const item of queueItems) {
        try {
          const parsedItem = JSON.parse(item);
          if (parsedItem.id === websiteId) {
            await redis.zrem(REGION_WISE_QUEUE, item);
            parsedItem.isAcknowledged = true;
            parsedItem.nextCheckTime = Date.now();
            await redis.zadd(REGION_WISE_QUEUE, parsedItem.nextCheckTime, JSON.stringify(parsedItem));
            acknowledged = true;
            console.log(`Acknowledged website ID ${websiteId} in ${REGION_WISE_QUEUE}`);
          }
        } catch (error) {
          console.error(`Error acknowledging from ${REGION_WISE_QUEUE}:`, error);
          acknowledged = false;
          throw error;
        }
      }

      // Resume in recovery set
      const recoveryItems = await redis.zrange(REGION_WISE_RECOVERY_SET, 0, -1);
      for (const item of recoveryItems) {
        try {
          const parsedItem = JSON.parse(item);
          if (parsedItem.id === websiteId) {
            await redis.zrem(REGION_WISE_RECOVERY_SET, item);
            parsedItem.isAcknowledged = true;
            parsedItem.nextCheckTime = Date.now();
            await redis.zadd(REGION_WISE_RECOVERY_SET, parsedItem.nextCheckTime, JSON.stringify(parsedItem));
            acknowledged = true;
            console.log(`Acknowledged website ID ${websiteId} in ${REGION_WISE_RECOVERY_SET}`);
          }
        } catch (error) {
          console.error(`Error acknowledging website ${websiteId} from ${REGION_WISE_RECOVERY_SET}:`, error);
          acknowledged = false;
          throw error;
        }
      }
    }

    return acknowledged;
  } catch (error) {
    console.error(`Error Acknowledging website for website if: ${websiteId} `, error);
    throw error;
  }

}








