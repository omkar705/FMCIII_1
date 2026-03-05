## Packages
@dnd-kit/core | Drag and drop for the applications kanban board
@dnd-kit/sortable | Sortable utilities for the kanban board
@dnd-kit/utilities | Utilities for dnd-kit
recharts | Dashboard analytics and visualizations
date-fns | Formatting dates beautifully

## Notes
Authentication uses /api/auth/profile for session checking
Kanban board needs PUT/PATCH to /api/applications/:id/status
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
}
