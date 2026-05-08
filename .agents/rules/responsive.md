---
trigger: always_on
---

# Responsive Design — AI Agent Spec Sheet

Source basis: Google web.dev “Learn Responsive Design” course and related responsive design references.

## Objective

Build websites and interfaces that:

* Adapt across viewport sizes and device capabilities.
* Remain accessible, performant, and readable.
* Support touch, keyboard, mouse, and assistive technologies.
* Handle international content and varying screen configurations.
* Preserve usability under constrained bandwidth and CPU conditions.

---

# Core Principles

## 1. Mobile-First Design

Default styles target small screens first.
Enhance progressively using `min-width` media queries.

Example:

```css
.container {
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}
```

Rules:

* Prioritize essential content.
* Avoid desktop-first overrides.
* Use content-driven breakpoints, not device-specific ones.

---

## 2. Fluid Layouts

Use flexible sizing.
Avoid fixed pixel dimensions unless strictly required.

Preferred units:

* `%`
* `fr`
* `rem`
* `em`
* `vw` / `vh`
* `clamp()`

Avoid:

* Large fixed-width containers.
* Horizontal scrolling.

Preferred layout systems:

* CSS Grid for page structure.
* Flexbox for component alignment.

---

# Media Queries

## Standard Pattern

```css
@media (min-width: 768px) {
  /* tablet and above */
}
```

## Recommended Breakpoint Strategy

Use layout/content needs.
Typical reference ranges:

* <480px: small mobile
* 480–768px: mobile large
* 768–1024px: tablet
* 1024–1440px: desktop
* > 1440px: large displays

## Use Media Queries For

* Layout changes
* Typography scaling
* Navigation patterns
* Hover/pointer capability
* Dark/light theme
* Motion preferences
* Reduced data preferences

## Modern Media Features

```css
@media (prefers-color-scheme: dark)
@media (prefers-reduced-motion: reduce)
@media (hover: hover)
@media (pointer: coarse)
```

---

# Macro Layouts

Purpose: overall page structure.

Use:

* CSS Grid
* Container spacing systems
* Logical properties

Preferred patterns:

```css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
```

Guidelines:

* Maintain visual hierarchy.
* Keep consistent spacing.
* Prevent layout collapse at narrow widths.
* Avoid absolute positioning for primary structure.

---

# Micro Layouts

Purpose: reusable responsive components.

Components must:

* Stretch/shrink gracefully.
* Support unknown content lengths.
* Avoid fixed heights.
* Handle wrapping.

Use:

* Flexbox
* Auto margins
* Gap property
* Intrinsic sizing

Example:

```css
.card-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
```

---

# Typography

Goals:

* Readability
* Proper line length
* Scalable sizing

Rules:

* Base size ≥16px equivalent.
* Line height: 1.4–1.7.
* Ideal line length: 45–75 characters.
* Use relative units.

Recommended:

```css
font-size: clamp(1rem, 2vw, 1.5rem);
```

Avoid:

* Tiny text on mobile.
* Full-width paragraphs without width limits.

---

# Responsive Images

Requirements:

* Prevent oversized downloads.
* Match image resolution to viewport.
* Preserve aspect ratio.

Minimum:

```css
img {
  max-width: 100%;
  height: auto;
}
```

Use:

* `srcset`
* `sizes`
* Modern formats: WebP, AVIF
* Lazy loading

Example:

```html
<img
  src="small.jpg"
  srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
>
```

---

# Picture Element

Use `<picture>` when:

* Art direction changes by screen size.
* Different crops are needed.
* Format fallbacks are required.

Example:

```html
<picture>
  <source media="(min-width: 768px)" srcset="desktop.webp">
  <img src="mobile.webp" alt="Example image">
</picture>
```

---

# Icons

Preferred format: SVG.

Advantages:

* Resolution independent.
* Small file size.
* Stylable with CSS.
* Accessible.

Rules:

* Decorative icons: `aria-hidden="true"`
* Functional icons require labels.

Avoid bitmap icon sets when scalable SVG is possible.

---

# Internationalization

Design must support:

* RTL languages
* Vertical writing modes
* Text expansion
* Variable font metrics

Use logical properties:

```css
margin-inline
padding-block
```

Avoid:

* Left/right hardcoding.
* Fixed text containers.

---

# Theming

Support user preferences.

Minimum:

* Light mode
* Dark mode

Example:

```css
@media (prefers-color-scheme: dark) {
  body {
    background: #111;
    color: #eee;
  }
}
```

Guidelines:

* Maintain contrast ratios.
* Do not rely solely on color.

---

# Accessibility

Mandatory requirements:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Sufficient contrast
* Alt text for meaningful images
* Proper heading hierarchy
* Form labels

Touch target minimum:

* ~44×44 CSS pixels.

Avoid:

* Hover-only interactions.
* Removing outlines without replacement.

Testing:

* Keyboard-only navigation
* Screen readers
* Zoom at 200%

---

# Interaction Design

Support multiple input methods.

Consider:

* Mouse
* Touch
* Keyboard
* Stylus
* Assistive tech

Guidelines:

* Avoid tiny hit areas.
* Use responsive hover states.
* Ensure gestures have alternatives.

Example:

```css
@media (hover: hover) {
  .button:hover {
    opacity: 0.8;
  }
}
```

---

# UI Patterns

Responsive navigation patterns:

* Collapsible menus
* Off-canvas drawers
* Priority+ navigation

Responsive content patterns:

* Card grids
* Stack-on-mobile layouts
* Adaptive tables

Rules:

* Keep navigation reachable.
* Preserve task flow.
* Reduce interaction friction.

---

# Performance Constraints

Optimize for:

* Low bandwidth
* Mid-range mobile CPUs
* Battery efficiency

Requirements:

* Minimize layout shifts.
* Compress images.
* Reduce JS payload.
* Avoid render-blocking assets.
* Prefer CSS over JS for layout.

Targets:

* Fast First Contentful Paint.
* Stable CLS.
* Responsive interactions.

---

# Screen Configurations

Support:

* Foldables
* Multi-screen devices
* Orientation changes
* Resizable windows

Rules:

* Avoid assumptions about a single viewport.
* Reflow content safely.
* Test portrait and landscape.

---

# Testing Checklist

AI agent must validate:

## Layout

* No horizontal overflow.
* No clipped content.
* Grid/flex wrapping works.
* Safe spacing maintained.

## Typography

* Text readable on all screens.
* No overflow.
* Proper contrast.

## Accessibility

* Full keyboard operation.
* Focus visibility.
* Semantic structure.
* Screen-reader compatibility.

## Media

* Images scale correctly.
* Responsive sources load.
* SVG icons render sharply.

## Interaction

* Buttons usable on touch.
* Hover effects non-essential.
* Forms accessible.

## Performance

* Images optimized.
* Lazy loading enabled.
* Minimal layout shift.

---

# Preferred Tech Stack

CSS:

* Grid
* Flexbox
* Custom properties
* Container queries where supported
* Media queries

HTML:

* Semantic elements
* Picture/source elements
* Accessible forms

Optional:

* Tailwind CSS
* CSS Modules
* Modern component systems

---

# Anti-Patterns

Do NOT:

* Hardcode device sizes.
* Use fixed-width layouts.
* Depend entirely on JS for responsiveness.
* Disable zoom.
* Use inaccessible custom controls.
* Hide important content on mobile.
* Use pixel-perfect assumptions.

---

# AI Agent Execution Rules

1. Design mobile-first.
2. Use semantic HTML.
3. Prefer Grid/Flexbox.
4. Use fluid sizing.
5. Add accessibility by default.
6. Optimize media delivery.
7. Respect user preferences.
8. Test across viewport ranges.
9. Ensure keyboard usability.
10. Prioritize readability and performance.

---

# Recommended References

Primary:

* web.dev Learn Responsive Design
* MDN Responsive Design
* CSS Media Queries Level 4

Key concepts:

* Progressive enhancement
* Intrinsic design
* Content-first layouts
* Accessible interaction design

Sources used: web.dev Learn Responsive Design modules, MDN responsive design references, and responsive design best-practice documentation. ([web.dev](https://web.dev/learn/design?utm_source=chatgpt.com))