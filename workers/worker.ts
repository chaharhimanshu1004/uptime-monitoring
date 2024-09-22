
import { extractWebsiteFromQueue, rescheduleWebsiteCheck } from "@/lib/queue";
import fetch from 'node-fetch'
import { sendNotificationEmail } from "@/helpers/sendNotificationEmail";

async function checkWebsiteUptime(url:string) : Promise<boolean>{
    try{
        const response = await fetch(url);
        if(response.status === 200){
            return true;
        }
        return false;
        
    }catch(err){
        console.error(err);
        return false;
    }
}

async function checkWebsite(){
    while(true){
        const check  = await extractWebsiteFromQueue();
        if(!check){
            await new Promise((resolve) => setTimeout(resolve, 5000));
            continue;
        }
        const now = Date.now();
        console.log(`Processing ${check.url} at ${new Date(now).toISOString()}`);
        const isUp = await checkWebsiteUptime(check.url);
        if (!isUp) {
            await sendNotificationEmail();
        }
        await rescheduleWebsiteCheck(check.url);
        console.log(`Next check for ${check.url} scheduled at ${new Date(now + 5*60*1000).toISOString()}`);

    }

}

checkWebsite();



