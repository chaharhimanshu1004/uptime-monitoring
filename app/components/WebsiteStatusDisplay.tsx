
import { websiteStatus } from "../hooks/websiteStatus";

export function WebsiteStatusDisplay() {
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

