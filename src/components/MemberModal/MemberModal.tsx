import React, { useState, useEffect, useRef } from 'react';
import { getTeamDisplay } from '../../utils/helpers';
import type { Member } from '../../api/mockApi';
import './MemberModal.css';

interface MemberModalProps {
  member: Member;
  onClose: () => void;
  onUpdateMember: (member: Member) => void;
}

export const MemberModal: React.FC<MemberModalProps> = ({ member, onClose, onUpdateMember }) => {
  const [newTag, setNewTag] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member>(member);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.focus();
  }, []);

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const updated = { ...selectedMember, tags: [...selectedMember.tags, newTag.trim()] };
    setSelectedMember(updated);
    onUpdateMember(updated);
    setNewTag('');
  };

  return (
    <div className="member-modal__backdrop" onClick={onClose}>
      <div
        className="member-modal__content"
        ref={contentRef}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
      >
        <div className="member-modal__header">
          <div className="member-modal__avatar">{selectedMember.avatar}</div>
          <div className="member-modal__info-row">
            <h2>{selectedMember.name}</h2>
            <p>{selectedMember.role} — {selectedMember.email}</p>
          </div>
          <button className="member-modal__close" onClick={onClose}>×</button>
        </div>
        <div className="member-modal__body">
          <div className="member-modal__info-row">
            <p><strong>Status:</strong> {selectedMember.status}</p>
            <p><strong>Team:</strong> {getTeamDisplay(selectedMember)}</p>
          </div>
          <div className="member-modal__section">
            <h3>Tags</h3>
            <div className="member-modal__tags">
              {selectedMember.tags.map(tag => (
                <span key={tag} className="member-modal__tag">{tag}</span>
              ))}
            </div>
            <div className="member-modal__add-tag">
              <input
                type="text"
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <button onClick={handleAddTag}>Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
