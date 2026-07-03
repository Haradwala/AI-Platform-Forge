# ForgeOS Contribution & Coding Guidelines

Welcome to ForgeOS! As a developer on this local-first AI software engineering operating system, please adhere strictly to these architectural rules and workflow guidelines.

---

## 1. Codebase Standards

- **Strict Type-Safety**:
  - Never use the `any` keyword unless absolutely required and annotated with a logical reason.
  - Implement Zod schema validations for every incoming configuration, system call, and network payload.
- **Interfaces First**:
  - Do not write concrete classes without first declaring an abstract interface or TypeScript `interface` / Python `Protocol` inside the appropriate package or `@forge/shared`.
- **No Side Effects**:
  - Ensure module import statements are completely pure. They must never instantiate global state or execute startup scripts on loading.
- **Single Responsibility (SOLID)**:
  - Keep classes small, focused, and independently testable. Use Dependency Injection rather than hard-coded class instantiation.

---

## 2. Directory & Structure Rules

- All shared TypeScript contracts must exist inside `packages/shared/`.
- Cross-cutting concerns (logging, configuration, DI containers) exist in `packages/core/`.
- Sandboxes and execution adapters belong in `packages/runtime/`.
- Do not write custom workspace configuration structures outside of the specified monorepo layout.

---

## 3. Contribution Workflow

1.  **Installing Dependencies**:
    - Build typescript packages using `pnpm`: `npx pnpm install`.
    - Build python environment using `uv`: `uv venv` and install via `uv pip install -e .`.
2.  **Linting & Formatting**:
    - TypeScript uses ESLint Flat Config (`eslint.config.mjs`) and Prettier.
    - Python uses `ruff`. Run `uv run ruff check` and `uv run ruff format`.
    - Both linters are integrated into Git Hooks via **Husky** and **lint-staged**.
3.  **Versioning**:
    - Every change that alters behavior must include a changeset. Run `npx changeset add` before pushing branches.
