# Coupon & Deals Modular Frontend Engine

[![CI](https://github.com/nadimtuhin/coupon-deals-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/nadimtuhin/coupon-deals-frontend/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Modular Handlebars templating, SCSS styling, and TypeScript frontend components engineered for high-converting affiliate coupon & deal platforms.

---

## 📸 UI Components Preview

![Coupon & Deals UI Preview](assets/coupon-ui-preview.png)

---

## 🚀 Key Features

1. **Handlebars Templating**: Pre-compiled, zero-runtime-overhead templates for coupon cards, store headers, and accessible copy-code modals.
2. **Modular SCSS Architecture**: BEM-structured stylesheets with mobile-first breakpoints and zero cumulative layout shift (CLS).
3. **TypeScript Component Logic**: Typed coupon models, clipboard copy interactions, and accessible dialog focus traps.
4. **Automated Test Suite**: 100% test coverage validating template rendering, coupon code visibility, and dialog accessibility.

---

## 🧪 Local Testing & Build

```bash
# Install dependencies
bun install

# Compile SCSS to CSS
bun run build:sass

# Run test suite
bun test

# Run TypeScript typechecks
bun run typecheck
```

---

## 📄 License
MIT © Nadim Tuhin
