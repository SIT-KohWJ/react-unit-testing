# Static Code Analysis (ICT2216 – Lab 8)

This document describes the static code analysis setup added to this project:
**ESLint** (with security plugins) and **GitHub CodeQL**, both reporting to
GitHub **Code Scanning** in the SARIF format.

---

## 1. Overview

Static analysis inspects source code **without running it** to find bugs,
quality issues, and security vulnerabilities early. This project uses two
independent analysers, run automatically on every push / pull request to `main`:

| Tool | What it does | Config file |
| --- | --- | --- |
| **ESLint** | JS/JSX quality + security linting (flat config) | `eslint.config.mjs` |
| **CodeQL** | GitHub's deep semantic security scanner | `.github/workflows/codeql.yml` |

Both upload results in **SARIF** format, which GitHub renders under
**Security → Code scanning**.

---

## 2. Tooling & versions

The project is a Create React App (`react-scripts@5.0.1`) app. ESLint is pinned
to **v9** with the modern **flat config** (`eslint.config.mjs`).

> ⚠️ **Do not run `npm install eslint@latest`** (pulls ESLint 10, unsupported by
> the React plugins) **or `npm audit fix --force`** (downgrades `react-scripts`
> to an empty `0.0.0` stub and breaks the toolchain). The ~65 `npm audit`
> warnings live in CRA's deep dev/build dependencies and are expected.

Dev dependencies added for this lab:

```
eslint                              ^9.39.5
@microsoft/eslint-formatter-sarif   ^3.1.0   (SARIF output for Code Scanning)
@babel/eslint-parser                ^7.29.7  (pinned to 7.x — CRA uses Babel 7)
@babel/preset-react                 ^7.29.7
eslint-plugin-react                 ^7.37.5
eslint-plugin-jest                  ^29.15.5
eslint-plugin-testing-library       ^7.16.2
eslint-plugin-security              ^4.0.1   (5.1 – detects eval, ReDoS, etc.)
eslint-plugin-security-node         ^1.1.4   (5.2 – Node.js security rules)
eslint-plugin-no-unsanitized        ^4.1.5   (5.3 – XSS / unsafe DOM writes)
```

Install everything from the committed lockfile:

```bash
npm ci        # or: npm install
```

---

## 3. ESLint configuration (`eslint.config.mjs`)

Flat config with two blocks:

- **Source (`**/*.{js,jsx}`)** — React recommended rules plus the security
  plugins:
  - `security/detect-eval-with-expression` — flags `eval()` of dynamic strings
  - `security-node/detect-crlf` — flags CRLF injection (server-side Node)
  - `no-unsanitized` recommended rules — flags unsafe `innerHTML` /
    `dangerouslySetInnerHTML` (XSS)
- **Tests (`**/*.test.{js,jsx}`)** — Jest + Testing Library rules and globals.

---

## 4. Running locally

```bash
npm run lint          # human-readable output in the terminal
npm run lint:sarif    # writes reports/eslint-results.sarif (for Code Scanning)
```

`npm run lint` exits non-zero when issues are found (expected — CI uses this).

### How to verify a security rule fires

Each security rule is confirmed by writing a tiny file that deliberately does the
unsafe thing, linting it, then deleting it:

```bash
# eslint-plugin-security (eval)
echo "eval('1+1')" > tmp.js && npx eslint tmp.js && rm tmp.js
# → error  security/detect-eval-with-expression

# eslint-plugin-no-unsanitized (XSS)
printf "export function Bad(){ document.getElementById('o').innerHTML = window.location.hash; }" > tmp.jsx
npx eslint tmp.jsx && rm tmp.jsx
# → error  Unsafe assignment to innerHTML  no-unsanitized/property
```

`security-node/detect-crlf` targets server-side Node HTTP code, so it produces no
findings in this browser React app — that is expected.

---

## 5. GitHub Actions workflows

### `.github/workflows/eslint.yml`
Runs on push / PR to `main`. Steps: `npm ci` → run ESLint → **upload SARIF** to
Code Scanning → **fail the job** if any issues are found. (The lint step uses
`|| true` so the SARIF still uploads before a final `eslint .` fails the build.)

### `.github/workflows/codeql.yml`
Runs on push / PR to `main`. Initializes CodeQL for `javascript`
(`build-mode: none`, no build needed for JS/JSX) and uploads results to Code
Scanning.

Results for both appear under the repository's **Security → Code scanning** tab.

---

## 6. Current findings

ESLint currently reports **9 problems** in `src/` (these are real code-quality
findings, not setup errors):

- `react/prop-types` (×7) — components missing PropTypes validation
- `react/jsx-key` (×1) — a `.map()` element missing a `key` prop
- `jest/expect-expect` (×1, warning) — a test with no assertions

The ESLint workflow therefore **fails by design** while these exist — the point
of the gate is to surface them. Fixing them (add PropTypes, a `key`, an
assertion) turns the workflow green.

---

## 7. References

- GitHub SARIF support: https://docs.github.com/en/code-security/code-scanning/integrating-with-code-scanning/sarif-support-for-code-scanning
- ESLint: https://eslint.org/
- eslint-plugin-security: https://www.npmjs.com/package/eslint-plugin-security
- eslint-plugin-security-node: https://www.npmjs.com/package/eslint-plugin-security-node
- eslint-plugin-no-unsanitized: https://www.npmjs.com/package/eslint-plugin-no-unsanitized
- GitHub CodeQL: https://github.com/github/codeql-action
