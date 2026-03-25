import React, { useState, useEffect } from 'react';
import { fetchNotifications } from '../../api/mockApi';
import { bindNotificationHandlers } from '../../utils/helpers';
import type { Notification } from '../../api/mockApi';

export const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    fetchNotifications().then(setNotifications);
  }, []);

  const handlers = bindNotificationHandlers(notifications, (id) => {
    setSelected(id);
  });

  return (
    <div className="notification-dropdown" style={{
      position: 'absolute',
      top: '100%',
      right: 0,
      width: '320px',
      background: 'var(--surface, #ffffff)',
      border: '1px solid var(--border, #e2e8f0)',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 99999,
      maxHeight: '400px',
      overflowY: 'auto',
    }}>
      <h3 style={{ padding: '12px 16px', margin: 0, borderBottom: '1px solid var(--border, #e2e8f0)' }}>
        Notifications
      </h3>
      {selected !== null && (
        <div style={{ padding: '12px 16px', background: '#f0f0ff', borderBottom: '1px solid var(--border, #e2e8f0)' }}>
          Viewing notification #{selected}
        </div>
      )}
      {notifications.map((n, idx) => (
        <div
          key={n.id}
          onClick={handlers[idx]}
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            borderBottom: '1px solid var(--border, #e2e8f0)',
            background: n.read ? 'transparent' : '#f8f9ff',
          }}
        >
          <strong>{n.title}</strong>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary, #64748b)' }}>
            {n.message}
          </p>
        </div>
      ))}
    </div>
  );
};
