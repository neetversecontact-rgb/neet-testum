
# Testum — Phase 2 Plan

Phase 1 (landing, mock auth, practice/test engine, dashboard) is live. The full spec you sent is ~6 months of work; Phase 2 makes the platform **real** (database-backed) and ships the **admin foundation** so you can start seeding content. Remaining features layer on top in Phase 3+.

## What Phase 2 ships

### 1. Lovable Cloud + real auth
- Enable Lovable Cloud (managed Postgres + Auth + Storage).
- Replace the `localStorage` auth shim with real Email/Password + Google sign-in.
- `profiles` table (name, target_year, avatar) auto-created on signup.
- `user_roles` table + `has_role()` security-definer function (student / admin / super_admin) — proper RBAC, no role on profile.
- Protected `/admin` route guarded by `has_role(admin)`.

### 2. Core schema
```text
subjects → chapters → topics
questions (text, image_url, subject_id, chapter_id, topic_id,
           difficulty, type, source, tags[])
question_options (question_id, label A-D, text, image_url, is_correct)
  └─ CHECK: text IS NOT NULL OR image_url IS NOT NULL
question_solutions (question_id, explanation, image_url)
test_series, tests, test_questions, test_attempts, test_answers
user_activity_log (user_id, action, entity, metadata, created_at)
menu_items (label, icon, route, parent_id, visible_to, order, active)
broadcasts (title, body, audience_filter, channels, scheduled_at)
broadcast_reads (broadcast_id, user_id, read_at)
question_reports, question_bookmarks
```
All tables: RLS on, granular policies, `GRANT`s for `authenticated` + `service_role`.

### 3. Storage
- `question-images` bucket (public read, admin write) for question + option + solution images.
- `avatars` bucket (public read, owner write).

### 4. Admin panel foundation (`/admin`)
- Admin layout with its own sidebar + audit-trail middleware.
- **Admin Dashboard**: user count, questions count, tests taken today, live activity feed (from `user_activity_log`).
- **Question Management**:
  - Add/Edit/Delete questions with rich form.
  - Cascading Subject → Chapter → Topic dropdowns.
  - 4 options, each with text field + image upload, mark correct.
  - Client + server validation: each option needs text OR image; ≥1 correct.
  - Question bank table with filter (subject/chapter/difficulty/status), pagination, search.
  - Solution editor with image.
- **User Management**: list + search + role change (student / admin / super_admin), ban toggle. Super-admin-only for promoting admins.
- **Dynamic Sidebar Manager**: CRUD on `menu_items`, drag-to-reorder, visibility per role, parent/child. The student sidebar reads from this table — no more hardcoded items.

### 5. Student side wired to real data
- Practice screens query `questions` by subject/chapter/topic instead of mock data.
- Bookmark + report buttons write to DB.
- Test engine submits to `test_attempts` / `test_answers`; results page reads back real score + breakdown.
- Dashboard stats come from `user_activity_log` aggregates.

### 6. Deferred to Phase 3+
Bulk Excel/CSV import, live classes + polls (WebSockets), broadcast delivery (email/push), AI tools (Syllabus Tracker, Rank/College Predictor, DPP Generator, YouTube), NCERT viewer, Smart Modules, leaderboard, peer comparison, payments. Schema for these will be added when we build them so the foundation doesn't drift.

## Technical notes
- TanStack Start + `createServerFn` with `requireSupabaseAuth` for all reads/writes.
- Admin mutations go through server fns that check `has_role(admin)` and write to `user_activity_log` (audit trail).
- Image uploads: signed-URL flow → Storage → store public URL on row.
- Rich text: `@tiptap/react` for question text + solutions.
- Validation: `zod` schemas shared client/server.
- `profiles` row auto-created via `on_auth_user_created` trigger.

## Confirm before I start
1. **Enable Lovable Cloud now?** Required for everything above. (Yes/No)
2. **Seed data**: should I seed Physics/Chemistry/Biology + their chapters from the NCERT NEET syllabus so you can start adding questions immediately? (Yes/No)
3. **First admin**: after Cloud is enabled, the first user to sign up will be auto-promoted to `super_admin`. OK?
