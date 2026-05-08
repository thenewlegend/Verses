---
trigger: always_on
---

# Android-Only PWA Agentic Development Specification

## Objective

Design and implement a production-grade Android-focused Progressive Web App (PWA) that behaves as closely as possible to a native Android application while preserving web deployment simplicity.

The AI agent must optimize for:

* Native-app feel
* Installability
* Offline resilience
* High performance
* Low latency interactions
* Android Chrome compatibility
* Maintainable architecture
* Accessibility
* Security
* Battery/network efficiency
* Scalable frontend architecture

Desktop support is optional.
Primary target platform is Android devices using Chromium-based browsers.

---

# Global Constraints

```yaml
platform:
  target: android_only
  browsers:
    - chrome_android_latest
    - edge_android_latest
    - samsung_internet_latest
  minimum_android_version: 10

architecture:
  rendering:
    preferred: hybrid_ssr_spa
  hydration: partial
  offline_first: true
  pwa_required: true

performance:
  lighthouse_mobile:
    performance: ">=95"
    accessibility: ">=95"
    best_practices: ">=95"
    seo: ">=90"
    pwa: full

core_web_vitals:
  lcp_ms: "<2000"
  inp_ms: "<150"
  cls: "<0.1"

network:
  default_strategy: stale_while_revalidate
  api_strategy: network_first
  media_strategy: cache_first

ui:
  touch_optimized: true
  responsive: true
  dark_mode: automatic
  animations: 60fps

security:
  https_only: true
  csp_required: true
  sanitize_all_inputs: true

build:
  typescript: strict
  linting: required
  tests_required: true
```

---

# Mandatory Technology Stack

```yaml
frontend:
  framework: nextjs_latest
  language: typescript
  styling:
    - tailwindcss
    - css_variables
  state_management:
    preferred:
      - zustand
      - react_query
  forms:
    - react_hook_form
    - zod

pwa:
  service_worker:
    library: workbox
  manifest: required
  install_prompt: custom

storage:
  local:
    - indexeddb
    - cache_api
  secure_storage:
    - encrypted_local_storage

backend:
  api_style: rest_or_trpc
  auth:
    - jwt
    - refresh_tokens

observability:
  logging: structured
  analytics: privacy_respecting
  error_tracking: required

deployment:
  platform:
    - vercel
    - cloudflare_pages
    - firebase_hosting
```

---

# Core Product Philosophy

The application must never feel like a traditional website.

The AI agent must:

1. Eliminate browser-like behaviors where possible.
2. Prefer gesture-first interactions.
3. Prioritize touch ergonomics.
4. Maintain instantaneous perceived responsiveness.
5. Avoid visible full-page reloads.
6. Cache aggressively.
7. Preserve user state during interruptions.
8. Ensure offline continuity.
9. Maintain app-shell architecture.
10. Ensure installability from Android Chrome.

---

# Required PWA Capabilities

## Installability

```yaml
manifest:
  required_fields:
    - name
    - short_name
    - icons
    - theme_color
    - background_color
    - display
    - start_url
    - scope

  display: standalone
  orientation: portrait
  categories:
    - productivity

icons:
  required_sizes:
    - 192x192
    - 512x512

install_flow:
  custom_install_ui: true
  beforeinstallprompt: required
```

Requirements:

* App must open in standalone mode.
* No browser chrome visible after installation.
* Install CTA must appear only after meaningful engagement.
* App icon must appear native-quality.

---

## Offline-First Architecture

```yaml
offline:
  strategy: app_shell

  cache_layers:
    static_assets: precache
    api_data: runtime_cache
    media: persistent_cache

  fallbacks:
    offline_page: required
    cached_content: required
    retry_mechanism: required

background_sync:
  enabled: true
```

Requirements:

* App shell must always load.
* Previously viewed data must remain accessible offline.
* Offline indicators must be subtle and non-blocking.
* User actions queued offline must sync automatically.

---

## Android Native-Like Features

```yaml
android_integrations:
  supported:
    - web_share_api
    - media_session_api
    - badging_api
    - push_notifications
    - background_sync
    - periodic_background_sync
    - wake_lock
    - vibration_api
    - file_system_access
    - clipboard_api

  unsupported_native_patterns:
    - ios_specific_ui
    - desktop_hover_dependencies
```

Requirements:

* Hardware back gestures must behave predictably.
* Touch feedback required.
* Long-press actions supported.
* Native share sheet integration mandatory.
* Push notifications supported.
* App shortcuts configured.

---

# UX Requirements

## Navigation

```yaml
navigation:
  type: bottom_navigation
  thumb_reach_optimized: true
  gesture_support: true

routing:
  transitions:
    animated: true
    duration_ms: 180

history:
  preserve_scroll: true
  preserve_state: true
```

Requirements:

* Primary navigation reachable with one hand.
* Avoid hamburger menus for core actions.
* Navigation transitions must feel native.
* Route changes must not flash white screens.

---

## Motion System

```yaml
motion:
  target_fps: 60
  reduced_motion_support: true

animation_rules:
  use_transform_only: true
  avoid_layout_thrashing: true
  prefer_gpu_acceleration: true
```

Requirements:

* Use transform and opacity animations only.
* Avoid heavy box-shadow animations.
* Maintain sub-16ms frame budget.

---

## Typography & Layout

```yaml
design:
  typography:
    font_family: system_ui
    dynamic_scaling: true

  spacing:
    base_unit: 4

  touch_targets:
    minimum_size_px: 48

  safe_areas:
    support_notches: true
```

Requirements:

* Respect Android safe areas.
* Use native-feeling typography.
* Avoid tiny touch targets.
* Optimize for portrait-first usage.

---

# Performance Engineering

## Rendering

```yaml
rendering:
  critical_path:
    inline_critical_css: true
    defer_noncritical_js: true
    lazy_load_routes: true

images:
  format_priority:
    - avif
    - webp

  responsive: true
  lazy_loading: true

javascript:
  bundle_budget_kb: 200
  tree_shaking: required
  code_splitting: aggressive
```

Requirements:

* Prevent hydration bottlenecks.
* Minimize JavaScript execution time.
* Avoid blocking the main thread.
* Preload critical assets only.

---

## Data Fetching

```yaml
data:
  fetching:
    optimistic_updates: true
    deduplication: true
    retries: exponential_backoff

  cache:
    persistence: true
    stale_time_ms: 300000
```

Requirements:

* UI updates should appear instant.
* Retry transient network failures.
* Persist critical state locally.

---

# Accessibility Requirements

```yaml
accessibility:
  wcag_target: AA

  required:
    - semantic_html
    - aria_labels
    - keyboard_support
    - focus_management
    - contrast_compliance
    - screen_reader_support
```

Requirements:

* Never rely solely on color.
* All controls must be reachable.
* Screen readers must correctly identify structure.

---

# Security Requirements

```yaml
security:
  headers:
    - csp
    - x_frame_options
    - x_content_type_options
    - strict_transport_security

  authentication:
    token_rotation: true
    secure_cookies: true

  storage:
    never_store_plaintext_secrets: true

  validation:
    client_validation: required
    server_validation: required
```

Requirements:

* Prevent XSS.
* Prevent CSRF.
* Never trust client input.
* Enforce HTTPS everywhere.

---

# Service Worker Rules

```yaml
service_worker:
  lifecycle:
    skip_waiting: true
    clients_claim: true

  caching:
    static_assets:
      strategy: cache_first

    api:
      strategy: network_first

    images:
      strategy: stale_while_revalidate

  update_strategy:
    silent_background_update: true
```

Requirements:

* Never cache sensitive API responses.
* Prevent stale auth state.
* Avoid infinite cache growth.
* Version all caches.

---

# Push Notification Specification

```yaml
notifications:
  permission_strategy:
    ask_after_engagement: true

  payloads:
    lightweight: true

  interactions:
    deep_linking: true

  anti_spam:
    frequency_control: true
```

Requirements:

* Never request permission on first load.
* Notifications must provide actionable value.
* Clicking notifications must restore context.

---

# Android UX Optimization

```yaml
android_ux:
  pull_to_refresh:
    custom_handling: true

  overscroll_behavior:
    disabled_where_needed: true

  viewport:
    dynamic_viewport_units: true

  theme:
    status_bar_color_sync: true
```

Requirements:

* Avoid accidental browser refresh.
* Match Android visual conventions.
* Respect dark mode automatically.

---

# AI Agent Coding Rules

## Code Generation Principles

```yaml
agent_rules:
  always:
    - generate_modular_code
    - generate_typed_code
    - generate_accessible_markup
    - optimize_for_mobile_first
    - prefer_composition_over_inheritance
    - isolate_business_logic
    - prevent_memory_leaks
    - avoid_duplicate_requests
    - include_loading_states
    - include_error_states
    - include_empty_states

  never:
    - use_inline_styles
    - use_untyped_any
    - block_main_thread
    - ship_unused_dependencies
    - hardcode_secrets
    - use_large_monolithic_components
    - ignore_offline_state
    - create_layout_shift
```

---

## Component Architecture

```yaml
components:
  max_component_length: 250_lines

  structure:
    - ui
    - features
    - shared
    - hooks
    - services
    - store
    - utils

  principles:
    - single_responsibility
    - reusable
    - testable
```

---

# Suggested Directory Structure

```txt
src/
 ├── app/
 ├── components/
 │    ├── ui/
 │    ├── shared/
 │    └── features/
 ├── hooks/
 ├── services/
 ├── store/
 ├── lib/
 ├── workers/
 ├── styles/
 ├── types/
 ├── utils/
 ├── config/
 └── tests/
```

---

# Required Testing Strategy

```yaml
testing:
  unit_tests: required
  integration_tests: required
  e2e_tests: required

  mobile_testing:
    android_chrome: mandatory
    slow_network_simulation: mandatory
    offline_mode: mandatory

  performance_testing:
    lighthouse_ci: required
```

Requirements:

* Validate offline functionality.
* Validate installability.
* Validate service worker updates.
* Validate touch interactions.

---

# Build Optimization Rules

```yaml
optimization:
  assets:
    compress_images: true
    minify_fonts: true
    preload_critical_assets: true

  scripts:
    remove_dead_code: true
    lazy_load_noncritical: true

  fonts:
    self_hosted: preferred
    variable_fonts: preferred
```

---

# Native-App Illusion Requirements

The AI agent must aggressively optimize for perceived nativeness.

Required behaviors:

* Instant route transitions
* Persistent app shell
* Native-feeling momentum scrolling
* Smooth gesture handling
* Zero visible browser reloads
* Cached avatar/media rendering
* Skeleton loading states
* Persistent auth sessions
* State restoration after tab suspension
* Background refresh when connectivity resumes

---

# Manifest Example

```json
{
  "name": "Application",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "orientation": "portrait",
  "scope": "/",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

# Service Worker Strategy Example

```yaml
routes:
  static_assets:
    strategy: cache_first

  api_requests:
    strategy: network_first
    timeout_seconds: 3

  images:
    strategy: stale_while_revalidate

  fonts:
    strategy: cache_first
```

---

# Final Agent Directive

The AI agent must treat the project as a native Android application delivered through web technologies.
