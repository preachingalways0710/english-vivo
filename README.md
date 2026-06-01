# English Vivo

WordPress plugin — AI-powered English learning app for Brazilian Portuguese speakers. Sister app to Português Vivo.

## Install

1. In WordPress, install via WP Pusher pointed at this repo.
2. Activate the **English Vivo** plugin.
3. Add the shortcode `[english_vivo]` to a page.

## Architecture

- `english-vivo.php` — plugin header, shortcode, enqueues
- `assets/css/app.css` — styles (scoped under `.ev-root`)
- `assets/js/app.js` — app logic, uses xAI Grok API (user-supplied key)

User data (API key, exam result, progress, saved vocab) lives in browser `localStorage` under key `ev1_state` — per device, no server storage.

## Updating

Bump `Version:` in `english-vivo.php` AND `EV_VERSION` constant. Commit, push, then update the plugin via WP Pusher. The version tag at the bottom of the rendered app confirms the live page picked up the update.
