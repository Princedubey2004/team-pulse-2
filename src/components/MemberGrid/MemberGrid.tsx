import React, { useState, useEffect } from 'react';
import { fetchMembers } from '../../api/mockApi';
import { MemberCard } from '../MemberCard/MemberCard';
import { useFilters } from '../../context/FilterContext';
import type { Member } from '../../api/mockApi';
import './MemberGrid.css';

interface MemberGridProps {
  onSelectMember: (member: Member) => void;
  columns?: number;
}

export const MemberGrid: React.FC<MemberGridProps> = ({ onSelectMember, columns = 3 }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const { filters } = useFilters();

  useEffect(() => {
    fetchMembers(filters).then(data => {
      setMembers(data);
    });
  }, [filters.status, filters.role]);

  const handleBookmark = (id: number) => {
    const next = new Set(bookmarks);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setBookmarks(next);
  };

  const displayMembers = members.map(m => ({
    ...m,
    bookmarked: bookmarks.has(m.id)
  }));

  return (
    <div className="member-grid">
      <div className="member-grid__header">
        <h2>Team Members ({displayMembers.length})</h2>
        <span>Bookmarked: {bookmarks.size}</span>
      </div>
      <div className="member-grid__cards" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {displayMembers.length === 0 && <p className="member-grid__empty">No members found</p>}
        {displayMembers.map(member => (
          <MemberCard
            key={member.id}
            member={member}
            onBookmark={handleBookmark}
            onClick={onSelectMember}
          />
        ))}
      </div>
    </div>
  );
};
