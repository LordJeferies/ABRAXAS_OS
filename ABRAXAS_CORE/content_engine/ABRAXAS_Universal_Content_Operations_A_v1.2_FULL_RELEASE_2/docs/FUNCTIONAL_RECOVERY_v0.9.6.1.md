# Functional Recovery Contract · v0.9.6.1

A release is invalid if the HTML renders visually but JavaScript does not boot.

Mandatory gates:
1. Source app boots in a browser-like VM with `document` present.
2. Home renders non-empty content.
3. Every primary route renders after navigation: Home, Clients, Library, Calendar, He, Production, Shim, AI Results, Assets, Brand Intelligence, Guide, Roadmap.
4. Shim advances between steps.
5. El Arquitecto opens, changes intent and closes without a global page reload.
6. Built standalone HTML is evaluated independently and must pass the same route smoke.
7. Startup exceptions must render Recovery Mode instead of a blank page.
