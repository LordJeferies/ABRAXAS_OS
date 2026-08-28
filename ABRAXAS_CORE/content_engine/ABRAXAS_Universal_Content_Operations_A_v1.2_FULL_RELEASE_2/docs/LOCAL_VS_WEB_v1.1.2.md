# LOCAL vs WEB · v1.1.2

## LOCAL
Single standalone HTML. `file://`, no CDN, no secrets, local state, browser downloads. Service Worker/PWA and secure backend integrations are intentionally absent.

## WEB
`web_build_v1.1.2/` contains modular `index.html`, CSS/JS/data, web manifest, service worker and brand assets. It can be hosted on GitHub Pages or static hosting. It still contains no secrets; connected LLM/auth/sync requires a secure backend later.

Both targets consume the same data model and interaction contracts.
