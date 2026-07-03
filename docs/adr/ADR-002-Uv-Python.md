# ADR-002: Python Environment Management via uv

## Status
Approved

## Context
The cognitive planner and multi-agent reasoning loop run in Python (utilizing FastAPI, LangGraph, and ChromaDB).
Managing local python dependencies, isolated virtual environments, and python versions across different developer setups typically adds significant latency and setup complexity.

## Decision
We utilize **`uv`** (a fast, Rust-based Python package manager) for all Python-based packages:
1.  Python workspaces, workspace links, and tools are specified inside a root `pyproject.toml`.
2.  `uv` automatically installs Python if missing, sets up `.venv` environments, and links local developments.
3.  Pre-commit checks and tests are executed through `uv run`.

## Consequences
- **Pros**:
  - Sub-second dependency installation and synchronization times.
  - No need to pre-install Python version managers (e.g. pyenv); `uv` bootstraps the python runtime directly.
  - Zero-config workspace caching.
- **Cons**:
  - `uv` is a relatively new tool in the Python ecosystem (though highly stable and standard).
