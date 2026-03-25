import React, { useState, useEffect } from 'react';
import { fetchActivities } from '../../api/mockApi';
import { batchAssignRole } from '../../utils/batchOperations';
import { updateMemberRole } from '../../api/mockApi';
import { useToast } from '../Toast/ToastContainer';
import type { Activity } from '../../api/mockApi';
import './ActivityFeed.css';

export const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [filterText, setFilterText] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    fetchActivities().then(data => {
      setActivities(data);
    });
  }, []);

  const sorted = [...activities].sort((a, b) => {
    const aTime = new Date(a.timestamp).getTime();
    const bTime = new Date(b.timestamp).getTime();
    return sortBy === 'newest' ? bTime - aTime : aTime - bTime;
  });

  const filtered = filterText
    ? sorted.filter(a => a.action.toLowerCase().includes(filterText.toLowerCase()) ||
        a.memberName.toLowerCase().includes(filterText.toLowerCase()))
    : sorted;

  const handleBatchAssign = () => {
    if (selectedIds.length === 0) return;
    batchAssignRole(
      selectedIds,
      'Senior Engineer',
      updateMemberRole,
      () => showToast('All roles updated!'),
      (msg) => showToast(msg, 'error')
    );
  };

  return (
    <div className="activity-feed">
      <div className="activity-feed__controls">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <input
          type="text"
          placeholder="Filter activities..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button className="btn-primary" onClick={handleBatchAssign}>
          Batch Assign Role ({selectedIds.length})
        </button>
      </div>
      <div className="activity-feed__list">
        {filtered.map(activity => (
          <div key={activity.id} className="activity-feed__item">
            <input
              type="checkbox"
              checked={selectedIds.includes(activity.memberId)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds(prev => [...prev, activity.memberId]);
                } else {
                  setSelectedIds(prev => prev.filter(id => id !== activity.memberId));
                }
              }}
            />
            <div className="activity-feed__item-content">
              <strong>{activity.memberName}</strong>
              <span>{activity.action}</span>
              <time>{new Date(activity.timestamp).toLocaleString()}</time>
              <input
                className="activity-feed__note"
                type="text"
                defaultValue={activity.note}
                placeholder="Add note..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
