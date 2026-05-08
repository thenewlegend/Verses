---
trigger: always_on
---

# SvelteKit — AI Agent Spec Sheet

Source basis:

* Official SvelteKit documentation
* SvelteKit routing/forms/hooks references
* Production deployment and architecture references
* Supplemental SvelteKit cheat sheet material fileciteturn0file0

---

# Objective

Build production-grade SvelteKit applications that are:

* Performant
* SSR-capable
* Accessible
* Secure
* Progressive-enhancement friendly
* SEO compatible
* Type-safe
* Deployable across edge/server/static environments

---

# Core Architecture

SvelteKit is:

* A full-stack framework built on Svelte.
* File-system routed.
* SSR-first by default.
* Vite-powered.
* Adapter-driven for deployment.

Primary strengths:

* Minimal client JS.
* Fast hydration.
* Server rendering.
* Progressive enhancement.
* Native web platform alignment.

---

# Project Structure

Standard structure:

```txt
src/
 ├ routes/
 ├ lib/
 ├ app.html
 ├ hooks.server.ts
 └ params/
```

Important conventions:

* `src/routes` → filesystem routing.
* `src/lib` → shared modules/components.
* Use `$lib/...` imports.
* Route files use `+` conventions.

---

# Route File Conventions

## UI

```txt
+page.svelte
+layout.svelte
+error.svelte
```

## Data Loading

```txt
+page.js
+page.server.js
+layout.js
+layout.server.js
```

## API Endpoints

```txt
+server.js
```

## Hooks

```txt
hooks.server.js
hooks.client.js
```

---

# Routing

Filesystem-based routing.

Examples:

```txt
src/routes/about/+page.svelte
→ /about
```

Dynamic routes:

```txt
src/routes/blog/[slug]/+page.svelte
```

Optional params:

```txt
[[lang]]
```

Route groups:

```txt
(routes)
(auth)
```

Param matchers:

```txt
[color=hex]
```

Rules:

* Prefer nested layouts.
* Group authenticated routes.
* Keep routes shallow where possible.
* Avoid unnecessary nesting.

---

# Layouts

Layouts persist across navigation.

Use layouts for:

* Navigation
* Shared state
* Auth wrappers
* Theme providers
* Shared loaders

Inheritance:

```txt
root layout
 → nested layout
   → page
```

Break inheritance using:

```txt
+page@.svelte
```

---

# Load Functions

## Universal Load

Runs on:

* Server initially
* Browser during navigation

File:

```txt
+page.js
```

Use when:

* Public API calls
* Client-compatible data
* Shared hydration logic

## Server Load

Runs only server-side.

File:

```txt
+page.server.js
```

Use when:

* DB access
* Secrets
* Filesystem
* Private APIs

Example:

```js
export async function load({ params, fetch }) {
  return { post };
}
```

Rules:

* Keep load functions lean.
* Avoid waterfall fetches.
* Return serializable data.
* Use parent() carefully.

---

# Form Actions

Primary mutation system.

File:

```txt
+page.server.js
```

Example:

```js
export const actions = {
  default: async ({ request }) => {}
};
```

Named actions:

```js
export const actions = {
  create: async () => {},
  delete: async () => {}
};
```

Form usage:

```html
<form method="POST" action="?/create">
```

Advantages:

* Works without JS.
* Progressive enhancement.
* Automatic invalidation.
* Simplified mutation flow.

Validation:

```js
import { fail } from '@sveltejs/kit';
return fail(400, { error: 'Invalid input' });
```

Rules:

* Prefer actions over manual fetch mutations.
* Validate server-side always.
* Return structured errors.
* Preserve form state.

---

# Progressive Enhancement

Use:

```js
import { enhance } from '$app/forms';
```

Example:

```html
<form method="POST" use:enhance>
```

Benefits:

* No reloads.
* Optimistic UX.
* Graceful fallback.

Rules:

* App must still work without JS.
* Do not rely entirely on client hydration.

---

# Server Endpoints

Create APIs using:

```txt
+server.js
```

Methods:

```js
GET
POST
PUT
DELETE
PATCH
```

Example:

```js
export async function GET() {
  return new Response('ok');
}
```

Use endpoints for:

* JSON APIs
* Webhooks
* Streaming
* External integrations

---

# Hooks

Hooks intercept framework lifecycle events.

## handle

```js
export async function handle({ event, resolve }) {}
```

Use for:

* Auth
* Sessions
* Logging
* Request mutation

## handleFetch

Intercept internal fetch calls.

## handleError

Centralized error handling.

Rules:

* Keep hooks lightweight.
* Avoid expensive synchronous logic.
* Store request-scoped state in `event.locals`.

---

# Authentication

Preferred flow:

1. Validate session in hooks.
2. Store user in `event.locals`.
3. Read via server load.
4. Protect route groups.

Example:

```js
event.locals.user = user;
```

Avoid:

* Client-only auth checks.
* Exposing secrets publicly.

---

# Environment Variables

Modules:

```txt
$env/static/private
$env/static/public
$env/dynamic/private
$env/dynamic/public
```

Rules:

* Secrets only in private modules.
* Public vars require `PUBLIC_` prefix.
* Use static env for build-time optimization.
* Use dynamic env for runtime deployment variability.

Never expose:

* Tokens
* DB credentials
* API secrets

---

# Navigation

Programmatic navigation:

```js
import { goto } from '$app/navigation';
```

Preloading:

```html
<a data-sveltekit-preload-data>
```

Preload strategies:

* hover
* tap
* viewport
* eager
* off

Invalidate data:

```js
invalidate('/api/data');
invalidateAll();
```

Rules:

* Prefer native links.
* Preload important routes.
* Avoid unnecessary invalidation.

---

# Error Handling

Expected errors:

```js
import { error } from '@sveltejs/kit';
throw error(404, 'Not found');
```

Redirects:

```js
throw redirect(303, '/login');
```

Custom error page:

```txt
+error.svelte
```

Rules:

* Separate expected vs unexpected errors.
* Never leak stack traces.
* Handle API failures gracefully.

---

# Stores

Built-in stores:

```js
$page
$navigating
$updated
```

Use for:

* Route state
* Navigation transitions
* App update detection

Avoid overusing global stores.

---

# Rendering Modes

## SSR

Default.

```js
export const ssr = true;
```

## CSR Only

```js
export const ssr = false;
```

## Static Generation

```js
export const prerender = true;
```

## Disable Client JS

```js
export const csr = false;
```

Rules:

* Prefer SSR for SEO/content.
* Prefer prerender for static pages.
* Use CSR-only sparingly.

---

# Performance

Key goals:

* Minimal JS shipped.
* Fast hydration.
* Small bundles.
* Efficient navigation.

Practices:

* Lazy load components.
* Use dynamic imports.
* Avoid oversized stores.
* Avoid unnecessary reactivity.
* Prefer server rendering.

Monitor:

* CLS
* FCP
* LCP
* TBT

---

# Accessibility

Mandatory:

* Semantic HTML
* Keyboard navigation
* Proper labels
* ARIA only when necessary
* Focus management
* Accessible forms

Svelte advantage:
Compiler warns for accessibility issues.

Rules:

* Never ignore accessibility warnings blindly.
* Ensure forms work with screen readers.

---

# SEO

Use:

```svelte
<svelte:head>
  <title>Page</title>
</svelte:head>
```

Requirements:

* Unique titles
* Meta descriptions
* SSR content
* Structured headings
* Canonical URLs where needed

---

# TypeScript

Preferred: TypeScript-first.

Use generated types:

```txt
./$types
```

Example:

```ts
import type { PageServerLoad } from './$types';
```

Rules:

* Avoid `any`.
* Use inferred types.
* Keep route contracts typed.

---

# Deployment

Adapters:

* adapter-node
* adapter-vercel
* adapter-cloudflare
* adapter-static

Selection criteria:

* SSR needs
* Edge support
* Static generation
* Runtime APIs

Rules:

* Match adapter to infrastructure.
* Validate env behavior in production.
* Test SSR compatibility.

---

# Testing Checklist

## Routing

* Dynamic params work.
* Nested layouts behave correctly.
* Redirects validated.

## Forms

* Works without JS.
* Validation handled.
* Errors displayed.

## Auth

* Protected routes secured.
* Sessions validated.
* Secrets server-only.

## Performance

* No excessive hydration.
* Minimal bundle size.
* Lazy loading operational.

## Accessibility

* Keyboard usable.
* Labels correct.
* Focus states visible.

## SEO

* Metadata rendered server-side.
* Titles/descriptions correct.

---

# Anti-Patterns

Avoid:

* Client-side secret handling.
* Fetching sensitive APIs in universal load.
* Massive global stores.
* Overusing client rendering.
* Blocking hooks.
* Deep route nesting.
* Redundant invalidation.
* Heavy hydration.
* Disabling SSR unnecessarily.

---

# AI Agent Execution Rules

1. Prefer SSR by default.
2. Use server load for protected data.
3. Use form actions for mutations.
4. Keep progressive enhancement intact.
5. Use layouts strategically.
6. Keep secrets server-only.
7. Use semantic HTML.
8. Optimize hydration.
9. Type all route contracts.
10. Deploy with correct adapter.

---

# Recommended References

Primary:

* Official SvelteKit docs
* Svelte documentation
* Vite documentation

Key topics:

* Routing
* Load functions
* Form actions
* Hooks
* SSR/CSR/prerender
* Environment variables
* Progressive enhancement

Supplemental reference used: SvelteKit Cheat Sheet fileciteturn0file0

Official references:

* SvelteKit routing docs
* SvelteKit hooks docs
* SvelteKit form actions docs
* SvelteKit environment variable docs

Web references used for validation and best practices. ([svelte.dev](https://svelte.dev/docs/kit/server-only-modules?utm_source=chatgpt.com))
