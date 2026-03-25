# Bug Report — TeamPulse Dashboard

Hey, so I went through the entire codebase looking for bugs.  
Here's what I found, why it was breaking, and what I did to fix each one.

---

## Bug 1: Timer doesn't count down

**Where:** `src/components/Timer/StandupTimer.tsx`

Okay so this one was pretty obvious when you look at the dashboard — the timer just sits there frozen.

The problem? `setInterval` was set up inside `useEffect` with an empty dep array, which is fine, but the callback was doing `setTimeLeft(timeLeft - 1)`. Since `timeLeft` gets captured at the time the effect runs (only once, on mount), it's always the same initial value. So the timer is technically ticking, but it keeps setting the same number minus one, over and over.

Also there was no `clearInterval`, so if the component ever re-mounts you'd get multiple intervals stacking.

**Fix:** Switched to `setTimeLeft(prev => prev - 1)` so it always reads the latest value, and added a cleanup `return () => clearInterval(id)`.

---

## Bug 2: Clicking notifications shows wrong ID

**Where:** `src/utils/helpers.ts`

Every notification click was showing `-1` as the ID. Didn't matter which one you clicked.

Turned out to be the classic `var` scoping issue. The loop in `bindNotificationHandlers` uses `for (var i = ...)` with a closure inside. Since `var` is function-scoped (not block-scoped), by the time you actually click a notification, `i` is already equal to `notifications.length`. So `notifications[i]` is `undefined` and the `?? -1` fallback kicks in.

**Fix:** Just changed `var` to `let`. Now each iteration gets its own `i`.

---

## Bug 3: Sidebar filters do nothing

**Where:** `src/context/FilterContext.tsx`

I spent a minute wondering why clicking the status/role filters had zero effect on the grid. Turns out the `updateFilter` function was doing something pretty sneaky — it was mutating the state object directly:

```ts
(filters as unknown as Record<string, string>)[key] = value;
setFilters(filters);
```

The thing is, React checks if the new state `===` the old state. Since it's the exact same object reference, React goes "nothing changed" and skips the re-render entirely.

**Fix:** `setFilters(prev => ({ ...prev, [key]: value }))` — creates a fresh object so React picks up the change.

---

## Bug 4: ⌘K shortcut gets weirder the more you navigate

**Where:** `src/App.tsx`

I noticed that after switching between Dashboard and Activity Feed a few times, pressing ⌘K felt laggy or would trigger multiple times.

The `useEffect` had `[currentPage]` in the dep array, but the handler doesn't even use `currentPage`. So every time you navigate, a brand new `keydown` listener gets added — but the old one is never removed because there's no cleanup. After a few page switches you've got like 5 listeners all firing at once.

**Fix:** Added `return () => document.removeEventListener(...)` and changed deps to `[]` since the handler doesn't depend on anything.

---

## Bug 5: Resize listener never gets cleaned up

**Where:** `src/pages/Dashboard.tsx`

Same pattern as Bug 4 basically. There's a resize listener that adjusts grid columns, but no cleanup. Also had a stray `console.log('resize handler fired')` in there.

**Fix:** Pulled the handler into a named function, added `removeEventListener` in the cleanup, removed the console.log.

---

## Bug 6: Member grid keeps fetching nonstop

**Where:** `src/components/MemberGrid/MemberGrid.tsx`

This one was subtle. If you open the network tab, you'd see `fetchMembers` firing over and over, way more than it should.

The culprit was the useEffect dependency:
```ts
useEffect(() => { ... }, [{ status: filters.status, role: filters.role }]);
```

That inline object `{ status: ..., role: ... }` is created fresh every render. React compares deps by reference, and a new object is never `===` to the previous one. So the effect runs every single render.

**Fix:** Changed it to `[filters.status, filters.role]` — primitives that React can actually compare properly.

---

## Bug 7: Header search doesn't debounce properly

**Where:** `src/components/Header/Header.tsx`

Three things wrong here:

1. The `setTimeout` for debouncing was never cleared on the next keystroke. So typing "hello" would fire searches for "h", "he", "hel", "hell", "hello" — just delayed.
2. No handling for stale responses. If the search for "he" resolves after "hello", old results would overwrite the current ones.
3. `query` was initialized as `undefined` (`useState<string | undefined>()`), which makes the input uncontrolled at first, then controlled once you type. React warns about this.

**Fix:**
- Used a `useRef` to store the timeout ID and `clearTimeout` it on each new keystroke
- Added a `cancelled` flag inside the effect so stale promises don't update state
- Changed initial state to `useState('')`

---

## Bug 8: Activity feed shows double entries

**Where:** `src/components/ActivityFeed/ActivityFeed.tsx`

The activity list had way too many items. It was showing duplicates.

The useEffect was doing:
```ts
setActivities(prev => [...prev, ...data]);
```

This appends to whatever's already there. In React 18 StrictMode (which is enabled in main.tsx), effects run twice during development. So the data gets appended twice.

Also the list was using `key={index}` which breaks when you sort or filter — React can't tell which item is which.

**Fix:** Changed to `setActivities(data)` (straight replacement, no append) and switched to `key={activity.id}`.

---

## Bug 9: Batch role update says "success" before it's actually done

**Where:** `src/utils/batchOperations.ts`

The `batchAssignRole` function was calling `onSuccess()` way too early. And if any individual update threw an error, it would just get swallowed silently.

The issue is `Array.forEach` with an async callback:
```ts
memberIds.forEach(async (id) => {
  await updateFn(id, role);
});
```

`forEach` doesn't care about the promises returned by async callbacks — it just fires them all off and moves on. The `try/catch` only catches synchronous errors, and `onSuccess` via `setTimeout(..., 0)` runs immediately.

**Fix:** Replaced `forEach` with a `for...of` loop so each update is properly awaited. Removed the `setTimeout` wrapper around `onSuccess`.

---

## Bug 10: Adding tags in the modal mutates original data

**Where:** `src/components/MemberModal/MemberModal.tsx`

This one's sneaky. When you add a tag, it looks like it's creating a copy:
```ts
const updated = { ...selectedMember };
updated.tags.push(newTag.trim());
```

But the spread operator only does a shallow copy. `updated.tags` is still pointing to the exact same array as `selectedMember.tags`. So `.push()` mutates the original array, which means the parent component's data gets changed too without it knowing.

**Fix:** `{ ...selectedMember, tags: [...selectedMember.tags, newTag.trim()] }` — creates a brand new tags array.

---

## Bug 11: Toast notifications break after the first one

**Where:** `src/components/Toast/ToastContainer.tsx`

Toasts were behaving weirdly — sometimes they wouldn't dismiss, or the wrong one would disappear.

The problem was `let nextId = 0` declared inside the component body. Every time React re-renders the component, `nextId` resets back to 0. So multiple toasts end up with the same ID, and the auto-dismiss `setTimeout` removes the wrong toast.

**Fix:** Used `useRef(0)` instead. The ref persists across renders, so each toast gets a unique incrementing ID.

---

## New Feature: Search Comments

**Where:** `src/components/Search/SearchOverlay.tsx` (rewrote from the placeholder)

The search overlay was just a "not implemented" message. I built it out:

- Fetches comments from `https://jsonplaceholder.typicode.com/comments`
- Input is debounced (300ms) with proper timeout cleanup
- Filters on the `body` field, case-insensitive, caps results at 50
- Matching text gets highlighted using a `HighlightedText` component that splits the string into spans — no `innerHTML` or `dangerouslySetInnerHTML`
- Keyboard nav works: arrow keys move through results, Enter selects, Escape closes
- Shows a spinner while loading, error message with retry button if the fetch fails, and a "no results" message when nothing matches

---

## UI/UX Improvements

After fixing bugs and building the search feature, I spent some time polishing the overall look and feel. Nothing crazy — just stuff I noticed that could be better while I was working through the code.

### 1. Dark mode

I noticed there was a `ThemeContext` already in the project but nothing was actually using it. So I wired up a toggle button (the 🌙 in the header) and wrote a full set of dark theme CSS variables. The background, text, borders, shadows — everything adapts. I added `transition: background 0.2s ease` on the body and key containers so the switch feels smooth instead of jarring.

### 2. Status badge contrast

The "Active" badge had white text on a light green background (`#90EE90` + `#ffffff`). That's basically invisible. I changed it to dark green text on a softer green background (`#166534` on `#dcfce7`). Much easier to read now.

### 3. Buttons feel clickable

The buttons didn't have any pressed/active state — you'd click and nothing happened visually. I added `transform: scale(0.97)` on `:active` so they "push in" slightly when clicked. Small thing but it makes the app feel more responsive.

### 4. Modal opens smoothly

The modal just appeared instantly before, which felt abrupt. I added a quick fade-in on the backdrop and a subtle slide-up + scale animation on the content panel (`translateY(-10px) scale(0.98)` → `translateY(0) scale(1)`). Takes 200ms, barely noticeable but feels way better.

Also made the modal responsive — on screens under 640px it goes full-width with less padding so it doesn't overflow.

### 5. Toast entry animation

The toast notifications slid in from the right, but the easing was basic. I switched to a custom cubic-bezier (`0.21, 1.02, 0.73, 1`) which gives a slight overshoot — feels more natural. Also added `opacity` to the transition and put type-specific icons (`✓`, `✕`, `⚠`) via CSS `::before` pseudo-elements so each toast has a visual indicator without needing more JSX.

### 6. Member card overflow

With longer names, the text could break the card layout. Added `text-overflow: ellipsis` and `overflow: hidden` on the name, and `overflow: hidden` on the card itself.

### 7. Sidebar hides on mobile

On screens under 768px, the sidebar was taking up too much space. I just hid it with `display: none` in a media query. Also hid the "Good morning, John" greeting in the header since it takes up room on small screens.

### 8. Scrollbar styling

The default browser scrollbar looked out of place, especially in dark mode. I added a thin 6px custom scrollbar with a rounded thumb that uses the `--border` color. Subtle but cleaner.

### 9. Focus rings for keyboard users

I added `:focus-visible` outlines (2px solid primary) so keyboard users get a visible focus indicator, but mouse users don't see it. The `:focus:not(:focus-visible)` rule removes the outline for mouse clicks.

### 10. Text selection color

Added `::selection` with a light indigo tint (`rgba(79, 70, 229, 0.2)`) so selected text matches the app's color scheme instead of the default blue.
