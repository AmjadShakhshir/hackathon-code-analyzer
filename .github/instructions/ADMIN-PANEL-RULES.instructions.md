# ADMIN-PANEL-RULES.md

This file defines strict conventions and architecture rules for this project. It must be followed by all contributors and AI copilots to ensure code clarity, maintainability, and professionalism.

---

## Naming Conventions

### Component Files

- Use PascalCase for full components:
  - Examples: `CampaignForm.tsx`, `UsersTable.tsx`, `NewsCard.tsx`
- File names must match the feature and purpose.
- Names should be short, precise, and meaningful.
- Avoid generic names like: `Wrapper.tsx`, `Component.tsx`, `Index.tsx`, `Thing.tsx`

### Primitives

- Use lowercase filenames for atomic, reusable components:
  - Examples: `input.tsx`, `button.tsx`, `checkbox.tsx`
- Save all primitives inside `/components/primitives/`

---

## Folder Structure and Responsibilities

Use folders that reflect the purpose of the components, not just the route or page.

/components/
├── campaigns/ → Only campaign-specific logic and UI
├── news/ → News-specific components
├── forms/ → Only full form components (e.g., CampaignForm.tsx)
├── tables/ → Only table-related components (e.g., UsersTable.tsx)
├── primitives/ → Pure UI building blocks (e.g., input.tsx, button.tsx)
├── ui/ → Shared UI blocks (e.g., modal.tsx, card.tsx)
├── composables/ → Shared hooks or logic (e.g., useSearch.ts, usePagination.ts)
├── layout/ → Layout-level components (e.g., AdminLayout.tsx, Sidebar.tsx)


- Do not place logic or utilities in the wrong folders.
- Place feature-specific components in their own folders like `campaigns/`, `news/`.
- Do not place primitives inside `forms/`, `tables/`, or other unrelated folders.

---

## Prohibited Patterns

- Do not use `index.ts` or `index.js` files for central exports.
  - All imports must be explicit and clear.
- Do not name files ambiguously.
  - Avoid names like `Component.tsx`, `Thing.tsx`, `Wrapper.tsx`, `Page.tsx`
- Do not use names like `SearchFilter.tsx`
  - It must be either `Search.tsx` or `Filter.tsx` — never both in one.

---

## Code Organization and Quality

- Follow SOC: Separate logic by concern — UI, data, hooks, handlers, etc.
- Follow DRY: Abstract repeated logic or UI responsibly.
- Keep files focused and purpose-driven.

---

## File Size and Structure

- No single file should exceed 500 lines of code.
  - If it does, break it into smaller subcomponents or hooks.
- Each file should have:
  - A single, clear responsibility
  - Proper formatting, comments, and structure
  - No dead code

---

## API Namespace Conventions

- Admin-specific APIs should be under `/dashboard/`, not `/api/`:
  - Correct: `/dashboard/pages/{slug}`
  - Incorrect: `/api/pages/{slug}`

---

## Component Builder Guidelines

- Reusable elements (such as `SearchBar`, `Table`, `Modal`) must:
  - Be configurable via props
  - Be visually compact and optimized for user experience
  - Use icon and short label dropdowns when listing options
- All inserted elements should:
  - Conform to the builder's structure
  - Be previewable and vertically added
  - Use a consistent data shape and rendering structure

---

## Developer Communication

- If code is starting to go out of scope, alert immediately.
- When facing architectural trade-offs:
  - Compare three top professional practices
  - Choose the most maintainable option and explain why

---

## First-Time Contributor Quick Checklist

- Is your file in the right folder?
- Does your filename follow the convention?
- Is your file under 500 lines?
- Are you using explicit imports (no index files)?
- Is your component single-responsibility?
- Is your logic DRY and reusable?

---

This guide is enforced in all PR reviews, refactors, and AI-assisted workflows.