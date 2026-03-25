import React, { useState, useEffect } from 'react';
import { StatsCards } from '../components/StatsCards/StatsCards';
import { MemberGrid } from '../components/MemberGrid/MemberGrid';
import { StandupTimer } from '../components/Timer/StandupTimer';
import { MemberModal } from '../components/MemberModal/MemberModal';
import type { Member } from '../api/mockApi';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [gridCols, setGridCols] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setGridCols(window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard__title">
        <h1>Dashboard</h1>
        <p>Team overview and activity at a glance</p>
      </div>
      <div className="dashboard__top">
        <StatsCards />
        <StandupTimer />
      </div>
      <MemberGrid onSelectMember={setSelectedMember} columns={gridCols} />
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onUpdateMember={(updated) => setSelectedMember(updated)}
        />
      )}
    </div>
  );
};
