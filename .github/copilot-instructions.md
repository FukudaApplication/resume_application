# Copilot instructions for this repository

This is a small static resume/履歴書 builder made of plain HTML/CSS/JS. Key files:
- `index.html` — landing page with links to the form.
- `resume.html` — the main form (client-side validation, address lookup, dynamic fields).
- `style.css` — global styling.

Quick summary (big picture)
- Single-page static site where `resume.html` contains the interactive form and embedded JS. The form `action` points to `/form.php` (no `form.php` in this repo), so server-side processing is expected in deployment.
- Client code calls an external address API: `https://zipcloud.ibsnet.co.jp/api/search` (see `resume.html` near `searchAddress()`).

What an AI agent should do first
- Read `resume.html` to understand form structure: repeated patterns are `.form-row`, `.form-label`, `.form-input-group`, and classes like `textbox`, `address_textbox`, `name_textbox`.
- Note dynamic-entry buttons with IDs: `add_School`, `add_Company` and the generic `document.querySelector('button')` handler — avoid breaking button selection logic when modifying buttons.

Editing guidelines & examples
- Keep DOCTYPE/charset/meta and the `link rel="stylesheet"` line intact when editing HTML head.
- Preserve existing class names when adding inputs so CSS continues to apply. Example: add a new phone input using `class="textbox"` and place it inside a `.form-input-group` next to its `.form-label`.
- Prefer explicit element selection to avoid altering behavior. For example, instead of `document.querySelector('button')`, use `document.getElementById('add_School')` when attaching handlers.

Developer workflows (what works locally)
- Static preview (no POST handling):
  - `python -m http.server 8000` from the repo root, then open `http://localhost:8000/resume.html`.
- Full form POST testing (requires PHP because `form action="/form.php"`):
  - If PHP is installed, run `php -S localhost:8000` from the repo root to let `POST /form.php` be handled by a PHP endpoint (you still must provide `form.php` or stub it for testing).
- Debugging: use browser DevTools Console & Network panels. Check the zipcloud request and client-side regex validation functions (`inputAddressCheck`, `inputTelCheck`, `inputMailCheck`) in `resume.html`.

Patterns and pitfalls discovered
- Validation is implemented in-page with simple regexes: postal code expects 7 digits, telephone expects 11 digits, email uses `/.+@.+\\..+/`. Keep changes consistent with these patterns unless intentionally updating validation rules.
- External dependency: zipcloud API call is inlined in `resume.html` — network failures should be handled gracefully (current code writes text directly into DOM).
- There is no JS bundler or build step; edits are direct file edits. Avoid introducing imports or build-tool-only features without adding appropriate config files.

PR guidance for agents
- Make minimal, focused diffs. When adding JS, prefer creating a new `.js` file and linking it in `resume.html` only if the change is non-trivial.
- If adding server-side code (e.g., `form.php`), include a README snippet explaining how to run the server locally (use `php -S localhost:8000`) and what the endpoint expects.

If anything is unclear or you want more detail, tell me which area to expand (form fields, validation rules, local test stubs, or adding `form.php`).
