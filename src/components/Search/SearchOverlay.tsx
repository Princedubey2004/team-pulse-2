import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SearchOverlay.css';

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

// Highlight matching text by splitting into parts — no innerHTML needed
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="search-overlay__highlight">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export const SearchOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setComments([]);
      setError('');
      setActiveIndex(-1);
      // Small delay so the DOM is ready
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Fetch and filter comments with debounce
  const fetchComments = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    fetch('https://jsonplaceholder.typicode.com/comments')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Comment[]) => {
        const lower = searchQuery.toLowerCase();
        const filtered = data.filter(c => c.body.toLowerCase().includes(lower));
        setComments(filtered.slice(0, 50)); // cap at 50 results for performance
        setActiveIndex(-1);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch comments');
        setComments([]);
        setLoading(false);
      });
  }, []);

  // Handle input changes with debounce
  const handleInputChange = (value: string) => {
    setQuery(value);
    clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      fetchComments(value);
    }, 300);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < comments.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      // Could open detail view — for now just log selection
      const selected = comments[activeIndex];
      if (selected) {
        alert(`Selected comment #${selected.id} by ${selected.email}`);
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll('.search-overlay__result-item');
    items[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-overlay__content" onClick={e => e.stopPropagation()}>
        {/* Search Input */}
        <div className="search-overlay__input-wrapper">
          <span className="search-overlay__search-icon">🔍</span>
          <input
            ref={inputRef}
            className="search-overlay__input"
            type="text"
            placeholder="Search comments..."
            value={query}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <kbd className="search-overlay__kbd">ESC</kbd>
        </div>

        {/* Results Area */}
        <div className="search-overlay__results" ref={listRef}>
          {/* Loading state */}
          {loading && (
            <div className="search-overlay__state">
              <div className="search-overlay__spinner" />
              <span>Searching comments...</span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="search-overlay__state search-overlay__state--error">
              <span>⚠️ {error}</span>
              <button className="search-overlay__retry-btn" onClick={() => fetchComments(query)}>
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && query.trim() && comments.length === 0 && (
            <div className="search-overlay__state">
              <span>No comments matching "{query}"</span>
            </div>
          )}

          {/* Initial state */}
          {!loading && !error && !query.trim() && (
            <div className="search-overlay__state search-overlay__state--hint">
              <span>Type to search through comments</span>
              <span className="search-overlay__hint-sub">Use ↑↓ to navigate, Enter to select</span>
            </div>
          )}

          {/* Results */}
          {!loading && !error && comments.map((comment, idx) => (
            <div
              key={comment.id}
              className={`search-overlay__result-item ${idx === activeIndex ? 'search-overlay__result-item--active' : ''}`}
              onClick={() => alert(`Selected comment #${comment.id} by ${comment.email}`)}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              <div className="search-overlay__result-header">
                <span className="search-overlay__result-email">{comment.email}</span>
                <span className="search-overlay__result-id">#{comment.id}</span>
              </div>
              <p className="search-overlay__result-body">
                <HighlightedText text={comment.body} query={query} />
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        {comments.length > 0 && (
          <div className="search-overlay__footer">
            <span>{comments.length} result{comments.length !== 1 ? 's' : ''} found</span>
          </div>
        )}
      </div>
    </div>
  );
};
