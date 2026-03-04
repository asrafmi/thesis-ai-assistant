When adding new state to the Zustand workspace store (src/store/workspace.store.ts):

1. Add field + action method to WorkspaceState interface
2. Add matching implementation in create() object
3. Initialize with sensible default value

Action naming:
- Direct set: setActiveSectionId(id)
- Boolean toggle: toggleSidebar()
- Array append: addPromptHistory(prompt)

Patterns:
```ts
// Direct set
setFoo: (value) => set({ foo: value }),

// Toggle boolean
toggleBar: () => set((s) => ({ bar: !s.bar })),

// Prepend to array with max limit
addItem: (item) =>
  set((s) => ({ items: [item, ...s.items].slice(0, 20) })),
```

Rules:
- Always immutable updates: set((s) => ({ ... })) for computed values
- Never mutate state directly
- Slice arrays to prevent unbounded growth
- Keep store flat — no nested objects unless necessary

For workspace-specific UI state (panel visibility, active section, etc.): add to existing useWorkspaceStore.
For domain data (thesis, sections): keep in hooks (useThesis, useSections), not store.

Reference: src/store/workspace.store.ts
