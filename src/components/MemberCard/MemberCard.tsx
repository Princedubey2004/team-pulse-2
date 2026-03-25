import React from 'react';
import type { Member } from '../../api/mockApi';
import './MemberCard.css';

interface MemberCardProps {
  member: Member;
  onBookmark: (id: number) => void;
  onClick: (member: Member) => void;
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #ec4899, #f43f5e)',
  'linear-gradient(135deg, #14b8a6, #06b6d4)',
  'linear-gradient(135deg, #f97316, #eab308)',
  'linear-gradient(135deg, #3b82f6, #6366f1)',
];

export const MemberCard = React.memo<MemberCardProps>(({ member, onBookmark, onClick }) => {
  const avatarBg = AVATAR_GRADIENTS[member.name.charCodeAt(0) % AVATAR_GRADIENTS.length];

  return (
    <div className="member-card" onClick={() => onClick(member)}>
      <div className="member-card__header">
        <div className="member-card__avatar" style={{ background: avatarBg }}>{member.avatar}</div>
        <button
          className="member-card__bookmark"
          onClick={(e) => {
            e.stopPropagation();
            onBookmark(member.id);
          }}
        >
          <span className="icon">{member.bookmarked ? '★' : '☆'}</span>
        </button>
      </div>
      <h3 className="member-card__name">{member.name}</h3>
      <p className="member-card__role">{member.role}</p>
      <span className={`member-card__status member-card__status--${member.status}`}>
        {member.status === 'on-leave' ? 'On Leave' : member.status.charAt(0).toUpperCase() + member.status.slice(1)}
      </span>
      <p className="member-card__team">{member.team?.name ?? 'Unassigned'}</p>
      <div className="member-card__tags">
        {member.tags.map(tag => (
          <span key={tag} className="member-card__tag">{tag}</span>
        ))}
      </div>
    </div>
  );
});
