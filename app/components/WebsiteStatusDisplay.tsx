import { useEffect } from "react";
import { websiteStatus } from "../hooks/websiteStatus";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import axios from "axios";

export function WebsiteStatusDisplay() {
  const { data: session } = useSession();
  const user = session?.user as User;
  let userId: string | number | undefined = user?.id;  // userId can be either a string, number, or undefined

  if (userId) {
    userId = typeof userId === 'string' ? parseInt(userId) : userId;  // Parse to number only if it's a string
  }



  useEffect(() => {
    try{
      if(!userId){
        return;
      }
      const fetchWebsites = async () => {
        const addedWebsites = await axios.get(`/api/user/get-websites?userId=${userId}`);
        console.log('>>> addedWebsites', addedWebsites);
      };
      fetchWebsites();

    }catch(err){
      console.log('>>Error in fetchWebsites', err);

    }
  }, [user]);


  const statuses = websiteStatus();

  return (
    <div>
      <h2>Website Statuses</h2>
      <ul>
        {statuses.map(status => (
          <li key={status.url}>
            {status.url}: {status.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

