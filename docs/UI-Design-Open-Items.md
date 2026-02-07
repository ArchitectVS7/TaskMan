## Recommended Priority Sequence

### P0: CRITICAL -- Do First

#### 1. Pagination System (3 days)
**Why:** Every list endpoint currently returns unbounded results. This will cause performance degradation and potential OOM errors as data grows. Blocks public API work (Sprint 8) since external consumers need paginated responses.

**Scope:**
- Backend: Cursor-based pagination on `GET /api/tasks`, `GET /api/notifications`, activity logs
- Frontend: `useInfiniteQuery` in TasksPage, load-more or infinite scroll
- Tests: Pagination correctness, max limit enforcement, cursor + filter interaction

**Depends on:** Nothing
**Blocks:** Public API (Sprint 8), scale readiness

---

### P1: HIGH -- Unique Differentiators

#### 2. Creator Accountability Dashboard (5 days)
**Why:** Unique feature no competitor has. Positions TaskMan as "anti-busywork" tool. Backend analytics route already exists as a foundation.

**Scope:**
- Backend: GET `/api/analytics/creator-metrics` -- tasks created per user, self-assigned vs delegated ratio, velocity by creator, bottleneck identification
- Authorization: OWNER/ADMIN only
- Frontend: Creator leaderboard page, delegation ratio badges, charts
- Tests: Permission checks, metric calculation correctness

**Depends on:** Nothing
**Blocks:** Nothing (standalone feature)

#### 3. Smart Task Dependencies (7-10 days)
**Why:** High-value project management feature. Asana has it, most task managers don't. Enables critical path analysis and "What's blocking me?" views.

**Scope:**
- Backend: TaskDependency model + migration, cycle detection (DFS), CRUD endpoints, critical path calculation
- Frontend: Dependency picker in task modal, Gantt/timeline view (consider `gantt-task-react`), blocked-task indicators
- Tests: Dependency CRUD, circular dependency rejection, cascade delete, critical path algorithm

**Depends on:** Nothing
**Blocks:** Nothing (standalone feature)

---

### P2: MEDIUM -- Strategic Positioning

#### 4. Public API + API Keys (10 days)
**Why:** Enables developer integrations, Zapier/Make automation, and the CLI tool. Core to "task manager for developers" positioning.

**Scope:**
- Backend: ApiKey model, API key auth middleware (alongside cookie auth), key generation/revocation endpoints, OpenAPI spec generation
- Rate limiting: Per-key rate limits (1000 req/hour)
- Tests: Key auth, revocation, rate limiting

**Depends on:** Pagination (P0) -- paginated responses needed for API consumers

#### 5. Webhooks (5 days)
**Why:** Enables workflow automation. Complements public API.

**Scope:**
- Backend: Webhook model, dispatch system with HMAC signatures, retry logic (3 attempts, exponential backoff), webhook logs
- Frontend: Webhook management UI in settings
- Tests: Dispatch on events, signature verification, retry behavior

**Depends on:** Public API (uses same auth model)

#### 6. CLI Tool (4 days)
**Why:** Developer appeal, quick task capture from terminal.

**Scope:**
- Separate package: `taskman-cli` using commander + chalk + inquirer
- Commands: create, list, update, login (API key auth)
- Shell completion (zsh, bash)

**Depends on:** Public API (needs API key auth to work)

---

### P3: LOW -- Nice-to-Have Enhancements -- COMPLETED

#### 7. Natural Language Input ~~(10 days)~~ DONE
**Status:** COMPLETED (2026-02-06)

**Implemented:**
- `frontend/src/lib/nlpParser.ts` -- NLP parser using chrono-node (date extraction) + compromise (text cleanup)
- `frontend/src/components/SmartTaskInput.tsx` -- Smart input component with live parsing preview
- Parses: dates ("tomorrow", "next Friday", "by March 15"), priorities (urgent/high/low/p0-p3), project hints (#projectname)
- Integrated into CommandPalette (Ctrl+K > "Quick Create") and TasksPage header ("Quick Add" button)
- Auto-matches project hints to existing projects
- Real-time visual preview showing parsed title, due date, priority, and project tokens

#### 8. E2E Testing Setup ~~(3-5 days)~~ DONE
**Status:** COMPLETED (2026-02-06)

**Implemented:**
- Playwright config (`playwright.config.ts`) with webServer for both backend (port 4000) and frontend (port 3000)
- 21 E2E tests across 4 spec files:
  - `e2e/auth.spec.ts` (8 tests) -- register, login, logout, redirect, error states, page cross-links
  - `e2e/projects.spec.ts` (4 tests) -- create, list, detail navigation, empty state
  - `e2e/tasks.spec.ts` (4 tests) -- create task, change status, view switching, empty state
  - `e2e/navigation.spec.ts` (5 tests) -- sidebar links, page navigation
- Shared helpers: `e2e/helpers/auth.ts` (registerUser, loginUser, logout), `e2e/helpers/fixtures.ts` (unique test data generators)
- Scripts: `npm run test:e2e`, `test:e2e:ui`, `test:e2e:headed`, `test:e2e:report`

#### 9. Error Boundaries ~~(1 day)~~ DONE
**Status:** COMPLETED (2026-02-06)

**Implemented:**
- `frontend/src/components/ErrorBoundary.tsx` -- React class component with getDerivedStateFromError, componentDidCatch, resetError method, customizable fallback and onError callback
- `frontend/src/components/ErrorFallback.tsx` -- Styled fallback UI with AlertTriangle icon, dark mode support, "Try Again" and "Go to Dashboard" actions
- Wrapped in `App.tsx` (top-level boundary around SessionValidator)
- Wrapped in `Layout.tsx` (route-level boundary with `key={location.pathname}` for auto-reset on navigation)
- Sidebar stays functional when page content crashes

---

### P4: DEFERRED -- Sprint 10 Items

These should only be considered after P0-P2 are complete:

- Habit Tracking (5 days) -- niche, TickTick territory
- Collaborative Estimation (4 days) -- enterprise only
- Voice Input (7 days) -- gimmick, low adoption expected
- Burnout Prevention Dashboard (5 days) -- interesting but needs real usage data first

---

## Sequencing Diagram

```
Week 1-2:  [P0: Pagination] ─────────────────────────────┐
                                                          │
Week 1-3:  [P1: Creator Dashboard] (parallel)             │
                                                          │
Week 2-4:  [P1: Task Dependencies] (parallel)             │
                                                          │
Week 3-5:  [P2: Public API + Keys] ◄─────────────────────┘
                                          │
Week 5-6:  [P2: Webhooks] ◄──────────────┘
                    │
Week 6-7:  [P2: CLI Tool] ◄──────────────┘

Parallel track (COMPLETED):
  [P3: NLP Input]        ✅
  [P3: E2E Testing]      ✅
  [P3: Error Boundaries]  ✅
```

**Optimal parallelism:** Pagination and Creator Dashboard can start simultaneously. Dependencies can start once Pagination is underway. Public API starts after Pagination ships.

---

## Changes Since Previous Audit

The previous audit (2026-02-06 original) was written before Sprints 4, 5, and parts of 7/9 were implemented. Key changes:

| Previous Recommendation | Current Status |
|------------------------|----------------|
| "Complete Sprint 2 AI Insights" | DONE -- analytics route exists with 5 tests |
| "Add Pagination" | Still valid -- HIGHEST PRIORITY |
| "Fix Test Coverage Gaps" | Partially addressed -- notifications (9 tests), analytics (5 tests) now covered |
| "Prioritize WebSocket for Sprint 5" | DONE -- socket.io fully integrated |
| "Estimate 15 days for Comments+WS" | Completed in standard timeline |
| "Start with tags, then attachments" | All Sprint 6 items shipped together |

### Stale Sections Removed
- Detailed implementation code samples for completed sprints (no longer needed)
- Migration scripts for completed features (already applied)
- Risk assessments for shipped features (risks were mitigated)

---

## Final Assessment

### Strengths
- **Feature-complete MVP** -- all table-stakes features shipped and tested
- **Strong test coverage** -- 271 backend tests (14 suites) + 21 E2E tests (4 suites)
- **Well-structured codebase** -- 18 models, 61 endpoints, clean separation of concerns
- **Real-time foundation** -- WebSocket infrastructure ready for future features
- **Good UX polish** -- animations, skeletons, empty states, keyboard shortcuts, NLP input
- **Error resilience** -- Error boundaries prevent white-screen crashes

### Critical Gaps
- **Pagination** -- single biggest risk for production readiness
- **No public API** -- blocks developer positioning strategy

### Estimated Remaining Effort
- **P0 (Critical):** 3 days
- **P1 (Differentiators):** 12-15 days
- **P2 (Developer Platform):** 19 days
- **~~P3 (Polish):~~ COMPLETED**
- **Total remaining:** ~34-37 days for all open items (P0-P2)

---

**End of Audit Report**
