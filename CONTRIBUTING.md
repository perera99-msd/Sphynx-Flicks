# Contributing to Sphynx Flicks

Thank you for taking the time to contribute! 🎉  
Every contribution — big or small — is valued and appreciated.

Please read this guide carefully before submitting issues or pull requests.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Branching Strategy](#branching-strategy)
- [Commit Conventions](#commit-conventions)
- [Code Style](#code-style)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Issues](#reporting-issues)
- [Security Vulnerabilities](#security-vulnerabilities)

---

## Code of Conduct

This project adheres to our [Code of Conduct](CODE_OF_CONDUCT.md).  
By participating you are expected to uphold it. Please report unacceptable behaviour to the maintainers.

---

## How Can I Contribute?

| Type | Description |
|---|---|
| 🐛 **Bug reports** | Open an issue using the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) |
| 💡 **Feature requests** | Open an issue using the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md) |
| 🔧 **Code contributions** | Fork → branch → commit → PR (see steps below) |
| 📝 **Documentation** | Improvements to README, inline comments, or the wiki |
| 🔒 **Security issues** | Follow the [Security Policy](SECURITY.md) — **do not open a public issue** |

---

## Development Setup

### Prerequisites

- **Node.js** v18 or newer
- **npm** v9 or newer
- A **Cloudflare account** (free tier) for backend dev
- A **TMDb API key** — [register here](https://developer.themoviedb.org/docs/getting-started)

### Local Setup

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/Sphynx-Flicks.git
cd Sphynx-Flicks

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd backend && npm install && cd ..

# 4. Configure environment
cp .env.example .env          # then fill in your VITE_TMDB_API_KEY
# (Backend variables go in backend/wrangler.toml or Cloudflare dashboard)

# 5. Initialise the local D1 database
cd backend && npm run db:init && cd ..

# 6. Start development servers (two terminals)
npm run dev                   # Frontend → http://localhost:3000
cd backend && npm run dev     # Backend  → http://localhost:8787
```

### Running the Linter

```bash
npm run lint
```

All linting errors **must be resolved** before a PR will be merged.

---

## Branching Strategy

| Branch prefix | Purpose | Example |
|---|---|---|
| `feat/` | New feature | `feat/trailer-playback` |
| `fix/` | Bug fix | `fix/search-debounce` |
| `docs/` | Documentation only | `docs/api-reference` |
| `chore/` | Tooling, dependencies, config | `chore/upgrade-vite` |
| `refactor/` | Code restructuring without behaviour change | `refactor/auth-context` |
| `test/` | Adding or updating tests | `test/movie-service` |

> **Always branch off `main`.** Never commit directly to `main`.

```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

---

## Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### Types

| Type | When to use |
|---|---|
| `feat` | A new feature visible to the end user |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Code change that is neither a fix nor a feature |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates, config |
| `ci` | CI/CD configuration changes |

### Examples

```bash
feat(search): add debounced live search input
fix(auth): resolve JWT expiry check on refresh
docs(readme): update environment variable table
chore(deps): upgrade vite to v5.1.0
```

### Rules

- Use the **imperative mood** in the description ("add" not "added")
- Keep the description under **72 characters**
- Reference related issues in the footer: `Closes #42`
- Mark breaking changes with `BREAKING CHANGE:` in the footer

---

## Code Style

### General

- **ESLint** is configured and enforced — run `npm run lint` before committing
- Follow the existing patterns already in the codebase
- Prefer named exports over default exports for components
- Keep components small and focused — extract logic into hooks or services

### React

- Use **functional components** and React hooks (no class components)
- Keep JSX readable — if a component exceeds ~150 lines, consider splitting it
- Props must be explicitly listed — avoid spreading all props onto DOM elements
- Use the `contexts/` directory for global state; keep component state local where possible

### CSS

- Use existing CSS custom properties (variables) defined in `index.css`
- Scope styles to the component — avoid global overrides where possible
- Follow the existing BEM-like class naming pattern

### Backend (Cloudflare Workers)

- All API responses must include appropriate HTTP status codes
- Validate and sanitise all user input before processing
- Keep Worker handlers thin — extract business logic into dedicated modules

---

## Submitting a Pull Request

1. **Ensure your branch is up to date with `main`**

   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run the linter** and fix any issues

   ```bash
   npm run lint
   ```

3. **Build successfully**

   ```bash
   npm run build
   ```

4. **Push your branch**

   ```bash
   git push origin feat/your-feature-name
   ```

5. **Open a Pull Request** against `main` on GitHub

6. **Fill in the PR template** completely — incomplete PRs may be closed without review

7. **Respond to review comments** promptly

### PR Checklist (reviewers check these)

- [ ] Follows the branching convention
- [ ] Follows Conventional Commits format
- [ ] No ESLint errors or warnings
- [ ] Build passes (`npm run build`)
- [ ] README / docs updated if applicable
- [ ] No secrets or API keys committed

---

## Reporting Issues

Before opening an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Reproduce the problem** and note the steps clearly
3. **Include your environment** (OS, Node version, browser)

Use the appropriate issue template:
- [🐛 Bug Report](.github/ISSUE_TEMPLATE/bug_report.md)
- [💡 Feature Request](.github/ISSUE_TEMPLATE/feature_request.md)

---

## Security Vulnerabilities

**Please do not report security vulnerabilities through public GitHub issues.**

Follow the process described in [SECURITY.md](SECURITY.md).

---

Thank you for contributing to Sphynx Flicks! 🎬
