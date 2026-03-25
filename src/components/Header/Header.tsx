import React, { useState, useEffect, useRef } from 'react';
import { NotificationDropdown } from '../NotificationDropdown/NotificationDropdown';
import { searchMembers } from '../../api/mockApi';
import { useTheme } from '../../context/ThemeContext';
import type { Member } from '../../api/mockApi';
import './Header.css';

function computeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export const Header: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [greeting, setGreeting] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setGreeting(computeGreeting());
  }, []);

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    let cancelled = false;
    debounceRef.current && clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchMembers(query).then(results => {
        if (!cancelled) setSearchResults(results);
      });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <header className="header">
      <div className="header__left">
        <h1 className="header__logo" onClick={() => onNavigate('dashboard')}>TeamPulse</h1>
      </div>
      <div className="header__center">
        <div className="header__search-container">
          <input
            className="header__search"
            type="text"
            placeholder="Search members..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {searchResults.length > 0 && query && (
            <div className="header__search-results">
              {searchResults.map(m => (
                <div key={m.id} className="header__search-result-item">
                  <strong>{m.name}</strong>
                  <span>{m.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="header__right">
        <span className="header__greeting">{greeting}, John</span>
        <button
          className="header__theme-btn"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button
          className="header__notification-btn"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          🔔
        </button>
        {showNotifications && <NotificationDropdown />}
        <div className="header__avatar">JD</div>
      </div>
    </header>
  );
};
