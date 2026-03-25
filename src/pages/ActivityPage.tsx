import React from 'react';
import { ActivityFeed } from '../components/ActivityFeed/ActivityFeed';

export const ActivityPage: React.FC = () => {
  return (
    <div className="activity-page">
      <h1>Activity Feed</h1>
      <ActivityFeed />
    </div>
  );
};
