# Bug Report — TeamPulse Dashboard

So I went through the whole codebase and found 11 bugs total. Some were pretty obvious, others took a bit of digging. Here's everything documented.

---

## Bug 1 — Timer is stuck

**File:** `src/components/Timer/StandupTimer.tsx`

First thing I noticed on the dashboard — the countdown timer wasn't moving at all. Looked at the code and found that `setInterval` was using `timeLeft` directly instead of the functional updater. Because `useEffect` runs once (empty deps), `timeLeft` is always the initial value inside that closure. So it keeps doing `initialValue - 1` over and over. Also no `clearInterval` anywhere, which would cause problems if the component re-mounts.

**What I did:** Changed `setTimeLeft(timeLeft - 1)` to `setTimeLeft(prev => prev - 1)` and added `return () => clearInterval(id)` in the cleanup.

---

## Bug 2 — Wrong notification ID on click

**File:** `src/utils/helpers.ts`

Clicking any notification always showed ID `-1`. Classic `var` in a for-loop problem. The function uses `for (var i = ...)` so by the time any handler runs, `i` has already gone past the array length. Every handler reads the same stale value.

**What I did:** Changed `var` to `let`. That's it.

---

## Bug 3 — Filters don't do anything

**File:** `src/context/FilterContext.tsx`

Clicked the sidebar filters and nothing happened. The `updateFilter` function was mutating the existing state object directly and then passing the same reference to `setFilters`. React sees the same reference, thinks nothing changed, skips the render.

**What I did:** Used `setFilters(prev => ({ ...prev, [key]: value }))` so it actually creates a new object.

---

## Bug 4 — ⌘K starts acting weird after navigating

**File:** `src/App.tsx`

After going back and forth between pages a few times, the search shortcut would fire multiple times or feel laggy. The `useEffect` for the keydown listener had `[currentPage]` as dependency but the handler doesn't use `currentPage`. So each navigation adds another listener and none of them get cleaned up.

**What I did:** Switched deps to `[]` and added `removeEventListener` in the cleanup return.

---

## Bug 5 — Resize handler leaks

**File:** `src/pages/Dashboard.tsx`

Same story as the keyboard one — `addEventListener('resize', ...)` without any cleanup. Plus there was a leftover `console.log` in the handler.

**What I did:** Moved handler to a named function, added cleanup, removed the console.log.

---

## Bug 6 — Infinite API calls from member grid

**File:** `src/components/MemberGrid/MemberGrid.tsx`

Opened the network tab and saw `fetchMembers` firing nonstop. The useEffect had an inline object as dependency — `[{ status: filters.status, role: filters.role }]`. React can't compare objects by value, only by reference, and a new object literal is always a new reference.

**What I did:** Changed to `[filters.status, filters.role]` — plain strings that React can actually compare.

---

## Bug 7 — Search doesn't debounce

**File:** `src/components/Header/Header.tsx`

Typing in the search bar was firing a request for every keystroke. Three problems here:
- Timeout was never cleared between keystrokes
- No stale response handling (old search could overwrite newer results)
- `query` started as `undefined` which triggers React's controlled/uncontrolled warning

**What I did:** Added a `useRef` for the timeout, clear it on each change, added a `cancelled` flag in the effect, init query as `''`.

---

## Bug 8 — Duplicate activity entries

**File:** `src/components/ActivityFeed/ActivityFeed.tsx`

Activity feed was showing double entries. The effect was doing `setActivities(prev => [...prev, ...data])` which appends to existing state. In StrictMode, effects run twice, so data gets added twice. Also was using `key={index}` which is unreliable.

**What I did:** Changed to `setActivities(data)` and switched to `key={activity.id}`.

---

## Bug 9 — Batch update fires success too early

**File:** `src/utils/batchOperations.ts`

`batchAssignRole` was calling `onSuccess` before the updates actually finished. The function uses `forEach` with an async callback, but `forEach` doesn't wait for promises — it just fires them all and moves on. Errors from individual updates get silently swallowed too.

**What I did:** Replaced `forEach` with `for...of` and removed the `setTimeout` around `onSuccess`.

---

## Bug 10 — Tag mutation leaks to parent

**File:** `src/components/MemberModal/MemberModal.tsx`

Adding a tag in the modal was mutating the original member's tags array. The spread `{ ...selectedMember }` only does a shallow copy, so `updated.tags` is still the same array reference. `.push()` modifies that shared array directly.

**What I did:** `{ ...selectedMember, tags: [...selectedMember.tags, newTag.trim()] }` — new array, no mutation.

---

## Bug 11 — Toast IDs collide

**File:** `src/components/Toast/ToastContainer.tsx`

Toast notifications were misbehaving — wrong ones getting removed, sometimes not dismissing. `let nextId = 0` was declared inside the component body, so it resets to 0 every render. Multiple toasts end up with the same ID.

**What I did:** Replaced with `useRef(0)` so the counter persists across renders.

---

## Search Comments Feature

**File:** `src/components/Search/SearchOverlay.tsx`

The search overlay had a placeholder message saying "not implemented". I built it out:

- Hits `jsonplaceholder.typicode.com/comments` API
- 300ms debounce on the input with proper cleanup
- Filters by `body` field, case-insensitive, max 50 results
- Highlights matching text by splitting into spans (no `dangerouslySetInnerHTML`)
- Arrow keys navigate results, Enter selects, Escape closes
- Loading spinner, error state with retry, empty state message

---

## UI/UX stuff I improved

After the bugs were done, I went back and polished a few things that were bugging me while testing.

### Dark mode
There was already a `ThemeContext` in the project but nothing used it. I added a toggle in the header and wrote dark theme CSS variables — backgrounds, text colors, borders, shadows all adapt. Put a `transition` on key containers so it doesn't just snap.

### Status badge readability
"Active" badge had white text on light green. Couldn't read it. Switched to dark green on soft green.

### Button feedback
Buttons had no visual response on click. Added a subtle `scale(0.97)` on `:active`.

### Modal animation
Modal used to just pop in. Added a quick fade + slide animation. Also made it full-width on mobile so it's not tiny on small screens.

### Toast polish
Switched the slide-in to a bouncier easing curve. Added ✓ ✕ ⚠ icons per type using `::before`.

### Card overflow
Long member names could break the layout. Added `text-overflow: ellipsis`.

### Mobile
Sidebar was eating screen space on phones. Hidden it below 768px. Also hid the greeting text in the header.

### Scrollbar
Styled it thinner (6px) with rounded corners. Looks better in dark mode especially.

### Keyboard focus
Added `:focus-visible` outlines so tab navigation works properly, but mouse clicks don't show a ring.

### Selection color
Changed text selection to match the app's indigo color instead of the default blue.
