import { useState, useEffect } from 'react';

interface WebsiteStatus {
  url: string;
  status: 'up' | 'down';
}

export function websiteStatus() {
  const [statuses, setStatuses] = useState<WebsiteStatus[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function pollServer() {
      while (isMounted) {
        try {
          const response = await fetch('/api/subscribe');
          
          if (response.status === 204) {
            continue;
          }

          if (!response.ok) {
            throw new Error('Failed to fetch updates');
          }

          const data = await response.json();
          
          if (data.success && data.message) {
            const { url, status , id } = data.message;
            setStatuses(prevStatuses => {
              const updatedStatuses = [...prevStatuses.filter(s => s.url !== url), { id, url, status }];
              return updatedStatuses;
            });
          }
        } catch (error) {
          console.error('Polling error:', error);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }

    pollServer();

    return () => {
      isMounted = false;
    };
  }, []);

  return statuses;
}