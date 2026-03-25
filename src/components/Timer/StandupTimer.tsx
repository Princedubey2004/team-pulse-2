import React, { useState, useEffect } from 'react';
import './StandupTimer.css';

function getSecondsUntilStandup(): number {
  const now = new Date();
  const standup = new Date(now);
  standup.setHours(9, 0, 0, 0);
  if (now >= standup) {
    standup.setDate(standup.getDate() + 1);
  }
  return Math.floor((standup.getTime() - now.getTime()) / 1000);
}

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const StandupTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(getSecondsUntilStandup());

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="standup-timer">
      <span className="standup-timer__icon">⏰</span>
      <h3>Next Standup</h3>
      <div className="standup-timer__display">{formatTime(timeLeft)}</div>
      <p className="standup-timer__label">until 9:00 AM</p>
    </div>
  );
};
