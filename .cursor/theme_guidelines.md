# Theme & Styling Guidelines

This document outlines the semantic color token system and styling guidelines for the City Hall NUI. Cursor must strictly follow these mappings when creating or modifying components, pages, or layouts.

---

## 🎨 Semantic CSS Variables Reference

These custom variables are configured in `:root` in [styles.css](file:///g:/Dev%20work/city-hall-menu/src/styles.css) and must be utilized in place of hardcoded CSS values or generic utility classes.

### 1. Panel & Surface Tokens
Used to structure panel layering, background overlays, and card backgrounds.

| Variable | Value | Intended Usage |
| :--- | :--- | :--- |
| `--bg-panel` | `rgba(6, 8, 16, 0.76)` | Shell container background, main windows, sidebar body, modals |
| `--bg-surface` | `rgba(6, 8, 16, 0.45)` | Card backgrounds, list containers, form fields |
| `--bg-row` | `rgba(255, 255, 255, 0.03)` | Alternating rows, basic list items, hover list overlays |
| `--bg-row-alt` | `rgba(255, 255, 255, 0.055)`| Alternating row stripes, badge background indicators |

### 2. Border & Divider Tokens
Used to draw layout dividers, bounds, and hover highlights.

| Variable | Value | Intended Usage |
| :--- | :--- | :--- |
| `--bd` | `rgba(255, 255, 255, 0.09)` | Standard divider lines, unselected borders, default card boundaries |
| `--bd-strong` | `rgba(255, 255, 255, 0.14)` | Card hover boundaries, active dividers, input field focus borders |
| `--bd-primary` | `rgba(107, 191, 255, 0.28)` | Selected item borders, active tab outlines, primary card accents |

### 3. Primary Accent & Glow Tokens
Semantic primary highlights and glow opacities.

| Variable | Value | Intended Usage |
| :--- | :--- | :--- |
| `--primary` | `#6bbfff` | Active text glows, primary icons, primary buttons, highlighted text |
| `--primary-08` | `rgba(107, 191, 255, 0.08)` | Ambient glowing backdrops, active item hover backdrops |
| `--primary-15` | `rgba(107, 191, 255, 0.15)` | Primary button normal state backgrounds, active nav tab highlights |
| `--primary-30` | `rgba(107, 191, 255, 0.3)` | Primary button hover backgrounds, active progress bar glows |

### 4. Text Hierarchy Tokens
Used to maintain text readability and contrast ratios.

| Variable | Value | Intended Usage |
| :--- | :--- | :--- |
| `--tx` | `rgba(255, 255, 255, 0.88)` | Main headings, player name, primary values, active states |
| `--tx-2` | `rgba(255, 255, 255, 0.5)` | Subheadings, descriptions, metrics labels, timestamps |
| `--tx-3` | `rgba(255, 255, 255, 0.25)` | Disabled controls, helper hints, empty placeholders |

### 5. Status & Utility Colors
Categorized color indicators for warrants, applications, and license states.

| Variable | Value | Intended Usage |
| :--- | :--- | :--- |
| `--c-green` | `#4ade80` | Active licenses, approved applications, payment success |
| `--c-orange` | `#fb923c` | Pending applications, warnings, key warning badges |
| `--c-red` | `#f87171` | Expired licenses, rejected applications, active warrants |
| `--c-purple` | `#c084fc` | Special roles, admin labels, judicial notes |
| `--c-blue` | `#6bbfff` | Default information, government badges |
| `--c-slate` | `#94a3b8` | Neutral fallback, unacquired states, generic items |

---

## ⚠️ Coding Rules for Cursor

1. **NO Hardcoded Colors**: 
   - Never write hexadecimal, rgb, or oklch colors directly in JSX files.
   - Do NOT use Tailwind color classes (such as `bg-zinc-800`, `text-slate-400`, `border-neutral-700`) for main structural elements.
   - *Example (Correct)*: `className="border border-[var(--bd)] text-[var(--tx-2)] bg-[var(--bg-surface)]"`
   - *Example (Incorrect)*: `className="border border-neutral-700 text-slate-400 bg-slate-900"`

2. **Logo & Watermark Preservation**:
   - Do **NOT** remove or change the `los-santos-seal.png` logo image elements. Keep `/branding/los-santos-seal.png` intact in [AppShell.tsx](file:///g:/Dev%20work/city-hall-menu/src/components/layout/AppShell.tsx) and [Sidebar.tsx](file:///g:/Dev%20work/city-hall-menu/src/components/layout/Sidebar.tsx).

3. **Glassmorphism Rules**:
   - For primary window wrappers and sidebar layouts, use the `.glass` utility.
   - For internal dashboard cards, grids, and modular items, use the `.glass-card` utility.
   - Maintain the backdrop blurs (`12px` to `20px` range) so the NUI remains readable against game backdrops.
