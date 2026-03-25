import React, { useState, useEffect, useRef } from 'react';
import { fetchMembers } from '../../api/mockApi';
import type { Member } from '../../api/mockApi';
import './StatsCards.css';

function useAnimatedCounter(target: number, duration = 800): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

export const StatsCards: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetchMembers().then(setMembers);
  }, []);

  const total = useAnimatedCounter(members.length);
  const active = useAnimatedCounter(members.filter(m => m.status === 'active').length);
  const onLeave = useAnimatedCounter(members.filter(m => m.status === 'on-leave').length);

  return (
    <div className="stats-cards">
      <div className="stats-cards__card stats-cards__card--total">
        <span className="stats-cards__icon">👥</span>
        <span className="stats-cards__value">{total}</span>
        <span className="stats-cards__label">Total Members</span>
      </div>
      <div className="stats-cards__card stats-cards__card--active">
        <span className="stats-cards__icon">✅</span>
        <span className="stats-cards__value">{active}</span>
        <span className="stats-cards__label">Active</span>
      </div>
      <div className="stats-cards__card stats-cards__card--leave">
        <span className="stats-cards__icon">🏖️</span>
        <span className="stats-cards__value">{onLeave}</span>
        <span className="stats-cards__label">On Leave</span>
      </div>
    </div>
  );
};
