# Security Policy

## Supported Versions

The following versions of Sphynx Flicks are currently receiving security updates:

| Version | Supported |
|---|---|
| `main` (latest) | ✅ Yes |
| Older commits | ❌ No |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues, pull requests, or discussions.**  
Public disclosure before a fix is available puts all users at risk.

### How to Report

1. **Navigate** to the [Security Advisories](https://github.com/perera99-msd/Sphynx-Flicks/security/advisories) tab on this repository.
2. Click **"New draft security advisory"** and fill in the details.
3. Alternatively, contact the maintainer directly via GitHub: [@perera99-msd](https://github.com/perera99-msd).

### What to Include

Please provide as much of the following information as possible to help us understand and reproduce the issue:

- **Type of vulnerability** (e.g. XSS, SQL injection, authentication bypass, SSRF, etc.)
- **Affected component** (frontend, backend Worker, database layer, authentication)
- **File paths or endpoints** relevant to the issue
- **Step-by-step reproduction instructions**
- **Proof of concept** or exploit code (if available)
- **Impact assessment** — what an attacker could achieve
- **Suggested fix** (optional but appreciated)

---

## Response Timeline

| Milestone | Target Timeframe |
|---|---|
| Acknowledgement of report | Within **48 hours** |
| Initial triage & severity assessment | Within **5 business days** |
| Fix developed and reviewed | Within **14 days** (critical), **30 days** (high/medium) |
| Coordinated public disclosure | After fix is deployed |

We will keep you informed throughout the process and credit you in the security advisory (unless you prefer to remain anonymous).

---

## Scope

The following are **in scope** for security reports:

- Authentication and authorisation flaws
- Cross-site scripting (XSS)
- Cross-site request forgery (CSRF)
- SQL/NoSQL injection
- Sensitive data exposure (API keys, tokens, user data)
- Insecure direct object references (IDOR)
- Server-side request forgery (SSRF)
- Dependency vulnerabilities with a demonstrated impact

The following are **out of scope**:

- Denial of service attacks (DoS/DDoS)
- Reports that require physical access to the user's device
- Social engineering attacks
- Vulnerabilities in third-party services (TMDb, Cloudflare) — report those to their respective teams
- Issues with no security impact (e.g., missing CSP headers with no exploitable path)

---

## Disclosure Policy

We follow a **coordinated disclosure** model:

1. Reporter submits the vulnerability privately.
2. Maintainer acknowledges and begins investigation.
3. A fix is developed, reviewed, and deployed.
4. A security advisory is published and the reporter is credited (with permission).
5. A public post-mortem may be published for high-severity issues.

We ask that reporters **do not publicly disclose** the vulnerability until we have had a reasonable opportunity to address it.

---

## Security Best Practices for Contributors

If you are contributing to this project, please keep these guidelines in mind:

- **Never commit secrets** (API keys, passwords, tokens) to source control.
- Use the `.env` file (which is git-ignored) for all local secrets.
- Validate and sanitise all user input in both frontend and backend code.
- Use parameterised queries when working with the D1 database.
- Keep dependencies up to date and watch for security advisories via `npm audit`.

---

## Attribution

This security policy was inspired by the [GitHub Security Advisory](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability) guidelines.
